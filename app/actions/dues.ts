"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDue(formData: FormData) {
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const dueDate = new Date(formData.get("dueDate") as string);
    const description = formData.get("description") as string;

    if (!title || isNaN(amount) || !dueDate) {
        throw new Error("Invalid due data");
    }

    try {
        await prisma.due.create({
            data: {
                title,
                amount,
                dueDate,
                description,
                status: "Pending",
            },
        });
    } catch (error) {
        console.error("Failed to create due:", error);
        throw new Error("Failed to create due");
    }

    revalidatePath("/dashboard/dues");
    redirect("/dashboard/dues");
}

export async function updateDue(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const dueDate = new Date(formData.get("dueDate") as string);
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;

    try {
        await prisma.due.update({
            where: { id },
            data: {
                title,
                amount,
                dueDate,
                status,
                description,
            },
        });
    } catch (error) {
        console.error("Failed to update due:", error);
        throw new Error("Failed to update due");
    }

    revalidatePath("/dashboard/dues");
}

export async function deleteDue(id: string) {
    try {
        await prisma.due.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Failed to delete due:", error);
        throw new Error("Failed to delete due");
    }

    revalidatePath("/dashboard/dues");
}
