'use client';

import { addToSyncQueue, cacheData } from '@/lib/db/indexed-db';
import { toast } from 'sonner';

type EntityType = 'member' | 'event' | 'due' | 'financial' | 'document';
type OperationType = 'create' | 'update' | 'delete';

interface OfflineActionOptions {
    entity: EntityType;
    operation: OperationType;
    data: any;
    optimisticUpdate?: () => Promise<void>;
    onlineAction: () => Promise<any>;
}

/**
 * Generic wrapper for server actions that supports offline queueing
 * 
 * @param options Configuration for the offline action
 * @returns Result from server action or null if queued offline
 */
export async function offlineAction<T = any>(
    options: OfflineActionOptions
): Promise<T | null> {
    const { entity, operation, data, optimisticUpdate, onlineAction } = options;

    // If online, execute the server action directly
    if (typeof window !== 'undefined' && navigator.onLine) {
        try {
            const result = await onlineAction();
            return result;
        } catch (error) {
            console.error(`Failed to ${operation} ${entity}:`, error);
            toast.error(`Failed to ${operation} ${entity}. Please try again.`);
            throw error;
        }
    }

    // If offline, queue the operation
    try {
        // Add to sync queue
        await addToSyncQueue({
            type: operation,
            entity,
            data,
        });

        // Perform optimistic update if provided
        if (optimisticUpdate) {
            await optimisticUpdate();
        }

        // Show notification
        const actionText = operation === 'create' ? 'created' : operation === 'update' ? 'updated' : 'deleted';
        toast.info(`${entity.charAt(0).toUpperCase() + entity.slice(1)} will be ${actionText} when you're back online.`);

        return null;
    } catch (error) {
        console.error(`Failed to queue ${operation} for ${entity}:`, error);
        toast.error(`Failed to save changes offline. Please try again.`);
        throw error;
    }
}

/**
 * Helper to generate a temporary ID for optimistic updates
 */
export function generateTempId(): string {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper to convert FormData to plain object
 */
export function formDataToObject(formData: FormData): Record<string, any> {
    const obj: Record<string, any> = {};

    formData.forEach((value, key) => {
        // Handle multiple values for the same key
        if (obj[key]) {
            if (Array.isArray(obj[key])) {
                obj[key].push(value);
            } else {
                obj[key] = [obj[key], value];
            }
        } else {
            obj[key] = value;
        }
    });

    return obj;
}
