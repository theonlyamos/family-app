'use client';

import { createDuePayment as serverCreateDuePayment, deleteDuePayment as serverDeleteDuePayment } from '@/app/actions/due-payments';
import { offlineAction, generateTempId, formDataToObject } from './offline-actions';
import { cacheData, deleteCachedData } from '@/lib/db/indexed-db';

export async function createDuePaymentOffline(formData: FormData) {
    const paymentData = formDataToObject(formData);

    return offlineAction({
        entity: 'due' as any, // Using 'due' entity since payments are tied to dues
        operation: 'create',
        data: formData,
        optimisticUpdate: async () => {
            const tempPayment = {
                id: generateTempId(),
                ...paymentData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await cacheData('duePayments', tempPayment);
        },
        onlineAction: () => serverCreateDuePayment(formData),
    });
}

export async function deleteDuePaymentOffline(id: string) {
    return offlineAction({
        entity: 'due' as any,
        operation: 'delete',
        data: { id },
        optimisticUpdate: async () => {
            await deleteCachedData('duePayments', id);
        },
        onlineAction: () => serverDeleteDuePayment(id),
    });
}
