import prisma from "@/lib/prisma";
import { offlineFetch } from "@/lib/data/offline-wrapper";

export async function getMembers() {
    const result = await offlineFetch(
        async () => {
            try {
                const members = await prisma.member.findMany({
                    orderBy: { createdAt: 'desc' }
                });
                return members;
            } catch (error) {
                console.error("Failed to fetch members:", error);
                throw new Error("Failed to fetch members");
            }
        },
        { storeName: 'members' }
    );

    return result.data;
}

export async function getMember(id: string) {
    const result = await offlineFetch(
        async () => {
            try {
                const member = await prisma.member.findUnique({
                    where: { id },
                    include: {
                        father: true,
                        mother: true,
                        documents: true
                    }
                });
                return member;
            } catch (error) {
                console.error("Failed to fetch member:", error);
                throw new Error("Failed to fetch member");
            }
        },
        { storeName: 'members', key: id }
    );

    return result.data;
}