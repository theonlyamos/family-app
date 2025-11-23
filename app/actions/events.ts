"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
    const title = formData.get("title") as string;
    const date = new Date(formData.get("date") as string);
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;

    if (!title || !date) {
        throw new Error("Title and date are required");
    }

    try {
        await prisma.event.create({
            data: {
                title,
                date,
                location,
                description,
                type,
            },
        });
    } catch (error) {
        console.error("Failed to create event:", error);
        throw new Error("Failed to create event");
    }

    revalidatePath("/dashboard/events");
    redirect("/dashboard/events");
}

export async function updateEvent(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const date = new Date(formData.get("date") as string);
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;

    try {
        await prisma.event.update({
            where: { id },
            data: {
                title,
                date,
                location,
                description,
                type,
            },
        });
    } catch (error) {
        console.error("Failed to update event:", error);
        throw new Error("Failed to update event");
    }

    revalidatePath("/dashboard/events");
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Failed to delete event:", error);
        throw new Error("Failed to delete event");
    }

    revalidatePath("/dashboard/events");
}
