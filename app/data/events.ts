import prisma from "@/lib/prisma";
import { offlineFetch } from "@/lib/data/offline-wrapper";

export async function getEvents() {
    const result = await offlineFetch(
        async () => {
            try {
                const events = await prisma.event.findMany({
                    orderBy: { date: 'asc' }
                });
                return events;
            } catch (error) {
                console.error("Failed to fetch events:", error);
                throw new Error("Failed to fetch events");
            }
        },
        { storeName: 'events' }
    );

    return result.data;
}

export async function getEvent(id: string) {
    const result = await offlineFetch(
        async () => {
            try {
                const event = await prisma.event.findUnique({
                    where: { id }
                });
                return event;
            } catch (error) {
                console.error("Failed to fetch event:", error);
                throw new Error("Failed to fetch event");
            }
        },
        { storeName: 'events', key: id }
    );

    return result.data;
}

