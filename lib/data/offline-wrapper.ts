// Offline wrapper for data fetching functions
import {
    cacheData,
    getCachedData,
    markCacheRefreshed,
    getCacheAge,
} from '@/lib/db/indexed-db';

interface OfflineFetchOptions {
    storeName: 'members' | 'events' | 'dues' | 'financials' | 'documents';
    key?: string;
    maxAge?: number; // Maximum cache age in milliseconds (default: 5 minutes)
}

interface FetchResult<T> {
    data: T;
    fromCache: boolean;
    cacheAge: number | null;
}

export async function offlineFetch<T>(
    fetchFn: () => Promise<T>,
    options: OfflineFetchOptions
): Promise<FetchResult<T>> {
    const { storeName, key, maxAge = 5 * 60 * 1000 } = options;

    // Server-side: Always fetch fresh data, bypass cache
    if (typeof window === 'undefined') {
        const data = await fetchFn();
        return {
            data,
            fromCache: false,
            cacheAge: null,
        };
    }

    try {
        // If online, try to fetch fresh data
        if (navigator.onLine) {
            const data = await fetchFn();

            // Cache the fresh data
            await cacheData(storeName, data);
            await markCacheRefreshed(storeName);

            return {
                data,
                fromCache: false,
                cacheAge: null,
            };
        }
    } catch (error) {
        // If fetch fails (network error, etc.), fall through to cache
        console.warn(`Failed to fetch ${storeName}, falling back to cache:`, error);
    }

    // If offline or fetch failed, use cached data
    const cachedData = await getCachedData(storeName, key);
    const cacheAge = await getCacheAge(storeName);

    if (!cachedData) {
        throw new Error(`No cached data available for ${storeName}${key ? ` (${key})` : ''}`);
    }

    // Warn if cache is stale
    if (cacheAge && cacheAge > maxAge) {
        console.warn(`Cache for ${storeName} is stale (${Math.round(cacheAge / 1000 / 60)} minutes old)`);
    }

    return {
        data: cachedData,
        fromCache: true,
        cacheAge,
    };
}

// Helper to check if we should use cached data
export function shouldUseCache(cacheAge: number | null, maxAge: number): boolean {
    if (cacheAge === null) return false;
    return cacheAge < maxAge;
}
