import prisma from "@/lib/prisma";
import { offlineFetch } from "@/lib/data/offline-wrapper";

export async function getDues() {
    const result = await offlineFetch(
        async () => {
            try {
                const dues = await prisma.due.findMany({
                    orderBy: { createdAt: 'desc' }
                });
                return dues;
            } catch (error) {
                console.error("Failed to fetch dues:", error);
                throw new Error("Failed to fetch dues");
            }
        },
        { storeName: 'dues' }
    );

    return result.data;
}

export async function getDue(id: string) {
    const result = await offlineFetch(
        async () => {
            try {
                const due = await prisma.due.findUnique({
                    where: { id }
                });
                return due;
            } catch (error) {
                console.error("Failed to fetch due:", error);
                throw new Error("Failed to fetch due");
            }
        },
        { storeName: 'dues', key: id }
    );

    return result.data;
}

