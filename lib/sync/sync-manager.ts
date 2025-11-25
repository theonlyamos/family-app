// Sync Manager - handles synchronization of offline operations
import {
    getSyncQueue,
    removeSyncQueueItem,
    updateSyncQueueItem,
    deleteCachedData,
} from '@/lib/db/indexed-db';

// Import server actions
import { createMember, updateMember, deleteMember } from '@/app/actions/members';
import { createEvent, updateEvent, deleteEvent } from '@/app/actions/events';
import { createDue, updateDue, deleteDue } from '@/app/actions/dues';
import { createTransaction, deleteTransaction } from '@/app/actions/financials';

type SyncEventCallback = (event: { type: string; details?: any }) => void;

class SyncManager {
    private isSyncing = false;
    private listeners: SyncEventCallback[] = [];
    private maxRetries = 3;

    constructor() {
        if (typeof window !== 'undefined') {
            // Listen for online events to trigger sync
            window.addEventListener('online', () => {
                this.sync();
            });
        }
    }

    on(callback: SyncEventCallback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private emit(type: string, details?: any) {
        this.listeners.forEach(callback => callback({ type, details }));
    }

    async sync(): Promise<void> {
        if (this.isSyncing) {
            return;
        }

        if (!navigator.onLine) {
            return;
        }

        this.isSyncing = true;
        this.emit('sync-start');

        try {
            const queue = await getSyncQueue();
            let processed = 0;
            let failed = 0;

            for (const item of queue) {
                try {
                    await this.processQueueItem(item);
                    await removeSyncQueueItem(item.id);
                    processed++;
                    this.emit('item-synced', { item });
                } catch (error) {
                    const newRetries = item.retries + 1;

                    if (newRetries >= this.maxRetries) {
                        // Max retries reached, keep in queue with error
                        await updateSyncQueueItem(item.id, {
                            retries: newRetries,
                            error: error instanceof Error ? error.message : 'Unknown error',
                        });
                        failed++;
                        this.emit('item-failed', { item, error });
                    } else {
                        // Retry later
                        await updateSyncQueueItem(item.id, {
                            retries: newRetries,
                            error: error instanceof Error ? error.message : 'Unknown error',
                        });
                    }
                }
            }

            this.emit('sync-complete', { processed, failed, total: queue.length });
        } catch (error) {
            this.emit('sync-error', { error });
        } finally {
            this.isSyncing = false;
        }
    }

    private async processQueueItem(item: any): Promise<void> {
        const { entity, type, data } = item;

        switch (entity) {
            case 'member':
                await this.processMemberOperation(type, data);
                break;
            case 'event':
                await this.processEventOperation(type, data);
                break;
            case 'due':
                await this.processDueOperation(type, data);
                break;
            case 'financial':
                await this.processFinancialOperation(type, data);
                break;
            default:
                throw new Error(`Unknown entity type: ${entity}`);
        }
    }

    private async processMemberOperation(type: string, data: any): Promise<void> {
        switch (type) {
            case 'create':
                await createMember(data);
                break;
            case 'update':
                await updateMember(data.id, data);
                break;
            case 'delete':
                await deleteMember(data.id);
                await deleteCachedData('members', data.id);
                break;
        }
    }

    private async processEventOperation(type: string, data: any): Promise<void> {
        switch (type) {
            case 'create':
                await createEvent(data);
                break;
            case 'update':
                await updateEvent(data.id, data);
                break;
            case 'delete':
                await deleteEvent(data.id);
                await deleteCachedData('events', data.id);
                break;
        }
    }

    private async processDueOperation(type: string, data: any): Promise<void> {
        switch (type) {
            case 'create':
                await createDue(data);
                break;
            case 'update':
                await updateDue(data.id, data);
                break;
            case 'delete':
                await deleteDue(data.id);
                await deleteCachedData('dues', data.id);
                break;
        }
    }

    private async processFinancialOperation(type: string, data: any): Promise<void> {
        switch (type) {
            case 'create':
                await createTransaction(data);
                break;
            case 'delete':
                await deleteTransaction(data.id);
                await deleteCachedData('financials', data.id);
                break;
        }
    }

    getIsSyncing(): boolean {
        return this.isSyncing;
    }
}

// Singleton instance
export const syncManager = new SyncManager();
