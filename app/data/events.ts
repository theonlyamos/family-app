import prisma from "@/lib/prisma";

export async function getEvents() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        return events;
    } catch (error) {
        console.error("Failed to fetch events:", error);
        throw new Error("Failed to fetch events");
    }
}

export async function getEvent(id: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id }
        });
        return event;
    } catch (error) {
        console.error("Failed to fetch event:", error);
        throw new Error("Failed to fetch event");
    }
}
