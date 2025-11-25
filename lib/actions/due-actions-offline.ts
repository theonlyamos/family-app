'use client';

import { createDue as serverCreateDue, updateDue as serverUpdateDue, deleteDue as serverDeleteDue } from '@/app/actions/dues';
import { offlineAction, generateTempId, formDataToObject } from './offline-actions';
import { cacheData, deleteCachedData } from '@/lib/db/indexed-db';

export async function createDueOffline(formData: FormData) {
    const dueData = formDataToObject(formData);

    return offlineAction({
        entity: 'due',
        operation: 'create',
        data: formData,
        optimisticUpdate: async () => {
            const tempDue = {
                id: generateTempId(),
                ...dueData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await cacheData('dues', tempDue);
        },
        onlineAction: () => serverCreateDue(formData),
    });
}

export async function updateDueOffline(id: string, formData: FormData) {
    const dueData = formDataToObject(formData);

    return offlineAction({
        entity: 'due',
        operation: 'update',
        data: { id, formData },
        optimisticUpdate: async () => {
            await cacheData('dues', {
                id,
                ...dueData,
                updatedAt: new Date(),
            });
        },
        onlineAction: () => serverUpdateDue(id, formData),
    });
}

export async function deleteDueOffline(id: string) {
    return offlineAction({
        entity: 'due',
        operation: 'delete',
        data: { id },
        optimisticUpdate: async () => {
            await deleteCachedData('dues', id);
        },
        onlineAction: () => serverDeleteDue(id),
    });
}
