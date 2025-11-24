"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

export async function uploadDocument(formData: FormData) {
    const file = formData.get("file") as File;
    const transactionId = formData.get("transactionId") as string;
    const description = formData.get("description") as string;
    const memberIds = formData.get("memberIds") as string; // Expecting JSON string for simplicity or handle multiple

    if (!file) {
        throw new Error("No file provided");
    }

    let parsedMemberIds: string[] = [];
    if (memberIds) {
        try {
            parsedMemberIds = JSON.parse(memberIds);
        } catch (e) {
            console.error("Failed to parse memberIds", e);
        }
    }

    await saveDocument(file, { transactionId, description, memberIds: parsedMemberIds });

    revalidatePath("/dashboard/financials");
    revalidatePath("/dashboard/members");
    revalidatePath("/dashboard/documents");
}

export async function saveDocument(file: File, relations: { transactionId?: string, description?: string, memberIds?: string[] }) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    // Ensure uploads directory exists
    const uploadDir = join(cwd(), "public", "uploads");
    const filepath = join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);

        const url = `/uploads/${filename}`;

        await prisma.document.create({
            data: {
                name: file.name,
                url,
                type: file.type,
                size: file.size,
                description: relations.description,
                transactionId: relations.transactionId || null,
                members: {
                    connect: relations.memberIds?.map(id => ({ id })) || []
                }
            },
        });
    } catch (error) {
        console.error("Error saving document:", error);
        throw new Error("Failed to save document");
    }
}

export async function deleteDocument(id: string) {
    try {
        const document = await prisma.document.findUnique({
            where: { id },
        });

        if (!document) {
            throw new Error("Document not found");
        }

        // Delete file from disk
        const filepath = join(cwd(), "public", document.url);
        try {
            await unlink(filepath);
        } catch (error) {
            console.error("Error deleting file from disk:", error);
            // Continue to delete from DB even if file delete fails (might be missing)
        }

        await prisma.document.delete({
            where: { id },
        });

        revalidatePath("/dashboard/financials");
        revalidatePath("/dashboard/members");
    } catch (error) {
        console.error("Error deleting document:", error);
        throw new Error("Failed to delete document");
    }
}
