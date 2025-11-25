'use client';

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/lib/hooks/use-online-status';
import { syncManager } from '@/lib/sync/sync-manager';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function OfflineIndicator() {
    const isOnline = useOnlineStatus();
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const unsubscribe = syncManager.on((event) => {
            switch (event.type) {
                case 'sync-start':
                    setIsSyncing(true);
                    toast.info('Syncing offline changes...');
                    break;
                case 'sync-complete':
                    setIsSyncing(false);
                    if (event.details.processed > 0) {
                        toast.success(`Synced ${event.details.processed} offline changes`);
                    }
                    break;
                case 'sync-error':
                    setIsSyncing(false);
                    toast.error('Sync failed. Will retry later.');
                    break;
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (isOnline) {
            toast.success('Back online');
        } else {
            toast.warning('You are offline. Changes will be synced when connection is restored.');
        }
    }, [isOnline]);

    if (isOnline && !isSyncing) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
                {isSyncing ? (
                    <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Syncing...</span>
                    </>
                ) : !isOnline ? (
                    <>
                        <WifiOff className="h-4 w-4" />
                        <span className="text-sm">Offline</span>
                    </>
                ) : (
                    <>
                        <Wifi className="h-4 w-4" />
                        <span className="text-sm">Online</span>
                    </>
                )}
            </div>
        </div>
    );
}
