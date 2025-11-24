"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveDocument } from "./documents";

export async function createTransaction(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string);
    const type = formData.get("type") as string;
    const category = formData.get("category") as string;
    const date = new Date(formData.get("date") as string);
    const description = formData.get("description") as string;
    const memberIds = formData.get("memberIds") as string;
    const files = formData.getAll("files") as File[];

    if (!amount || !type || !category || !date) {
        throw new Error("Missing required fields");
    }

    let parsedMemberIds: string[] = [];
    if (memberIds) {
        try {
            parsedMemberIds = JSON.parse(memberIds);
        } catch (e) {
            console.error("Failed to parse memberIds", e);
        }
    }

    try {
        const transaction = await prisma.financialTransaction.create({
            data: {
                amount,
                type,
                category,
                date,
                description,
                members: {
                    connect: parsedMemberIds.map(id => ({ id }))
                }
            },
        });

        // Save all uploaded files
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > 0) {
                    await saveDocument(file, { transactionId: transaction.id });
                }
            }
        }
    } catch (error) {
        console.error("Failed to create transaction:", error);
        throw new Error("Failed to create transaction");
    }

    revalidatePath("/dashboard/financials");
    redirect("/dashboard/financials");
}

export async function deleteTransaction(id: string) {
    try {
        await prisma.financialTransaction.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Failed to delete transaction:", error);
        throw new Error("Failed to delete transaction");
    }

    revalidatePath("/dashboard/financials");
}
