import prisma from "@/lib/prisma";

export async function getDues() {
    try {
        const dues = await prisma.due.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return dues;
    } catch (error) {
        console.error("Failed to fetch dues:", error);
        throw new Error("Failed to fetch dues");
    }
}

export async function getDue(id: string) {
    try {
        const due = await prisma.due.findUnique({
            where: { id }
        });
        return due;
    } catch (error) {
        console.error("Failed to fetch due:", error);
        throw new Error("Failed to fetch due");
    }
}
