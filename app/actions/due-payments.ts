"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDuePayment(formData: FormData) {
    const dueId = formData.get("dueId") as string;
    const memberId = formData.get("memberId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const paymentDate = new Date(formData.get("paymentDate") as string);
    const paymentMethod = formData.get("paymentMethod") as string;
    const notes = formData.get("notes") as string;

    if (!dueId || !memberId || isNaN(amount) || !paymentDate || !paymentMethod) {
        throw new Error("Invalid payment data");
    }

    try {
        // Create the payment
        const payment = await prisma.duePayment.create({
            data: {
                dueId,
                memberId,
                amount,
                paymentDate,
                paymentMethod,
                notes,
            },
        });

        // Check if due is fully paid
        const due = await prisma.due.findUnique({
            where: { id: dueId },
            include: { payments: true },
        });

        if (due) {
            const totalPaid = due.payments.reduce((sum, p) => sum + p.amount, 0);
            const newStatus =
                totalPaid >= due.amount ? "Paid" :
                    totalPaid > 0 ? "PartiallyPaid" :
                        "Pending";

            // Update due status
            await prisma.due.update({
                where: { id: dueId },
                data: { status: newStatus },
            });
        }

        revalidatePath("/dashboard/dues");
        return payment;
    } catch (error) {
        console.error("Failed to create due payment:", error);
        throw new Error("Failed to create due payment");
    }
}

export async function getDuePayments(dueId: string) {
    try {
        const payments = await prisma.duePayment.findMany({
            where: { dueId },
            include: {
                member: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { paymentDate: 'desc' },
        });
        return payments;
    } catch (error) {
        console.error("Failed to fetch due payments:", error);
        throw new Error("Failed to fetch due payments");
    }
}

export async function deleteDuePayment(id: string) {
    try {
        // Get the payment to find the associated due
        const payment = await prisma.duePayment.findUnique({
            where: { id },
        });

        if (!payment) {
            throw new Error("Payment not found");
        }

        // Delete the payment
        await prisma.duePayment.delete({
            where: { id },
        });

        // Recalculate due status
        const due = await prisma.due.findUnique({
            where: { id: payment.dueId },
            include: { payments: true },
        });

        if (due) {
            const totalPaid = due.payments.reduce((sum, p) => sum + p.amount, 0);
            const newStatus =
                totalPaid >= due.amount ? "Paid" :
                    totalPaid > 0 ? "PartiallyPaid" :
                        "Pending";

            await prisma.due.update({
                where: { id: payment.dueId },
                data: { status: newStatus },
            });
        }

        revalidatePath("/dashboard/dues");
    } catch (error) {
        console.error("Failed to delete due payment:", error);
        throw new Error("Failed to delete due payment");
    }
}
