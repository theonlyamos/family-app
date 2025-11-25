// IndexedDB wrapper for offline data storage
import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface SyncQueueItem {
    id: string;
    type: 'create' | 'update' | 'delete';
    entity: 'member' | 'event' | 'due' | 'financial' | 'document';
    data: any;
    timestamp: number;
    retries: number;
    error?: string;
}

interface FamilyAppDB extends DBSchema {
    members: {
        key: string;
        value: any;
        indexes: { timestamp: number };
    };
    documents: {
        key: string;
        value: any;
        indexes: { timestamp: number };
    };
    'sync-queue': {
        key: string;
        value: SyncQueueItem;
        indexes: { timestamp: number; entity: string };
    };
    metadata: {
        key: string;
        value: any;
    };
}

const DB_NAME = 'family-app-db';
const DB_VERSION = 1;
let dbInstance: IDBPDatabase<FamilyAppDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<FamilyAppDB>> {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await openDB<FamilyAppDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Members store
            if (!db.objectStoreNames.contains('members')) {
                const membersStore = db.createObjectStore('members', { keyPath: 'id' });
                membersStore.createIndex('timestamp', 'timestamp');
            }

            // Events store

            // Documents store
            if (!db.objectStoreNames.contains('documents')) {
                const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
                documentsStore.createIndex('timestamp', 'timestamp');
            }

            // Sync queue store
            if (!db.objectStoreNames.contains('sync-queue')) {
                const syncQueueStore = db.createObjectStore('sync-queue', { keyPath: 'id' });
                syncQueueStore.createIndex('timestamp', 'timestamp');
                syncQueueStore.createIndex('entity', 'entity');
            }

            // Metadata store for cache control
            if (!db.objectStoreNames.contains('metadata')) {
                db.createObjectStore('metadata', { keyPath: 'key' });
            }
        },
    });

    return dbInstance;
}

// Generic CRUD operations
export async function cacheData(
    storeName: string,
    data: any | any[]
): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(storeName as any, 'readwrite');
    const store = tx.objectStore(storeName as any);

    if (Array.isArray(data)) {
        for (const item of data) {
            await store.put({ ...item, timestamp: Date.now() });
        }
    } else {
        await store.put({ ...data, timestamp: Date.now() });
    }

    await tx.done;
}

export async function getCachedData(
    storeName: string,
    key?: string
): Promise<any> {
    const db = await getDB();

    if (key) {
        return await db.get(storeName as any, key);
    }

    return await db.getAll(storeName as any);
}

export async function deleteCachedData(
    storeName: string,
    key: string
): Promise<void> {
    const db = await getDB();
    await db.delete(storeName as any, key);
}

export async function clearStore(
    storeName: string
): Promise<void> {
    const db = await getDB();
    await db.clear(storeName as any);
}

// Sync Queue operations
export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>): Promise<string> {
    const db = await getDB();
    const id = `${item.entity}-${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const queueItem: SyncQueueItem = {
        ...item,
        id,
        timestamp: Date.now(),
        retries: 0,
    };

    await db.add('sync-queue', queueItem);
    return id;
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
    const db = await getDB();
    return await db.getAll('sync-queue');
}

export async function updateSyncQueueItem(id: string, updates: Partial<SyncQueueItem>): Promise<void> {
    const db = await getDB();
    const item = await db.get('sync-queue', id);

    if (item) {
        await db.put('sync-queue', { ...item, ...updates });
    }
}

export async function removeSyncQueueItem(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('sync-queue', id);
}

// Metadata operations for cache control
export async function setMetadata(key: string, value: any): Promise<void> {
    const db = await getDB();
    await db.put('metadata', {
        key,
        value,
        timestamp: Date.now(),
    });
}

export async function getMetadata(key: string): Promise<any> {
    const db = await getDB();
    const metadata = await db.get('metadata', key);
    return metadata?.value;
}

export async function getCacheAge(storeName: string): Promise<number | null> {
    const lastFetch = await getMetadata(`${storeName}-last-fetch`);
    return lastFetch ? Date.now() - lastFetch : null;
}

export async function markCacheRefreshed(storeName: string): Promise<void> {
    await setMetadata(`${storeName}-last-fetch`, Date.now());
}
