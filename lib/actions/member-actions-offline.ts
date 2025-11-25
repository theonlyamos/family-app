'use client';

import { createMember as serverCreateMember, updateMember as serverUpdateMember, deleteMember as serverDeleteMember } from '@/app/actions/members';
import { offlineAction, generateTempId, formDataToObject } from './offline-actions';
import { cacheData, deleteCachedData } from '@/lib/db/indexed-db';

export async function createMemberOffline(formData: FormData) {
    const memberData = formDataToObject(formData);

    return offlineAction({
        entity: 'member',
        operation: 'create',
        data: formData,
        optimisticUpdate: async () => {
            // Add to cache with temporary ID
            const tempMember = {
                id: generateTempId(),
                ...memberData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await cacheData('members', tempMember);
        },
        onlineAction: () => serverCreateMember(formData),
    });
}

export async function updateMemberOffline(id: string, formData: FormData) {
    const memberData = formDataToObject(formData);

    return offlineAction({
        entity: 'member',
        operation: 'update',
        data: { id, formData },
        optimisticUpdate: async () => {
            // Update cache
            await cacheData('members', {
                id,
                ...memberData,
                updatedAt: new Date(),
            });
        },
        onlineAction: () => serverUpdateMember(id, formData),
    });
}

export async function deleteMemberOffline(id: string) {
    return offlineAction({
        entity: 'member',
        operation: 'delete',
        data: { id },
        optimisticUpdate: async () => {
            // Remove from cache
            await deleteCachedData('members', id);
        },
        onlineAction: () => serverDeleteMember(id),
    });
}
