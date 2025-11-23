import prisma from "@/lib/prisma";

export async function getMembers() {
    try {
        const members = await prisma.member.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return members;
    } catch (error) {
        console.error("Failed to fetch members:", error);
        throw new Error("Failed to fetch members");
    }
}

export async function getMember(id: string) {
    try {
        const member = await prisma.member.findUnique({
            where: { id },
            include: {
                father: true,
                mother: true
            }
        });
        return member;
    } catch (error) {
        console.error("Failed to fetch member:", error);
        throw new Error("Failed to fetch member");
    }
}