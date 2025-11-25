'use client';

import { createTransaction as serverCreateTransaction, deleteTransaction as serverDeleteTransaction } from '@/app/actions/financials';
import { offlineAction, generateTempId, formDataToObject } from './offline-actions';
import { cacheData, deleteCachedData } from '@/lib/db/indexed-db';

export async function createTransactionOffline(formData: FormData) {
    const transactionData = formDataToObject(formData);

    return offlineAction({
        entity: 'financial',
        operation: 'create',
        data: formData,
        optimisticUpdate: async () => {
            const tempTransaction = {
                id: generateTempId(),
                ...transactionData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await cacheData('financials', tempTransaction);
        },
        onlineAction: () => serverCreateTransaction(formData),
    });
}

export async function deleteTransactionOffline(id: string) {
    return offlineAction({
        entity: 'financial',
        operation: 'delete',
        data: { id },
        optimisticUpdate: async () => {
            await deleteCachedData('financials', id);
        },
        onlineAction: () => serverDeleteTransaction(id),
    });
}
