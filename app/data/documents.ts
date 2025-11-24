import prisma from "@/lib/prisma";

export async function getDocuments() {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                members: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                transaction: {
                    select: {
                        description: true,
                        date: true,
                    }
                }
            }
        });
        return documents;
    } catch (error) {
        console.error("Failed to fetch documents:", error);
        throw new Error("Failed to fetch documents");
    }
}
