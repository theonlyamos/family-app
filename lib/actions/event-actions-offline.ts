'use client';

import { createEvent as serverCreateEvent, updateEvent as serverUpdateEvent, deleteEvent as serverDeleteEvent } from '@/app/actions/events';
import { offlineAction, generateTempId, formDataToObject } from './offline-actions';
import { cacheData, deleteCachedData } from '@/lib/db/indexed-db';

export async function createEventOffline(formData: FormData) {
    const eventData = formDataToObject(formData);

    return offlineAction({
        entity: 'event',
        operation: 'create',
        data: formData,
        optimisticUpdate: async () => {
            const tempEvent = {
                id: generateTempId(),
                ...eventData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await cacheData('events', tempEvent);
        },
        onlineAction: () => serverCreateEvent(formData),
    });
}

export async function updateEventOffline(id: string, formData: FormData) {
    const eventData = formDataToObject(formData);

    return offlineAction({
        entity: 'event',
        operation: 'update',
        data: { id, formData },
        optimisticUpdate: async () => {
            await cacheData('events', {
                id,
                ...eventData,
                updatedAt: new Date(),
            });
        },
        onlineAction: () => serverUpdateEvent(id, formData),
    });
}

export async function deleteEventOffline(id: string) {
    return offlineAction({
        entity: 'event',
        operation: 'delete',
        data: { id },
        optimisticUpdate: async () => {
            await deleteCachedData('events', id);
        },
        onlineAction: () => serverDeleteEvent(id),
    });
}
