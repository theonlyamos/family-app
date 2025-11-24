import prisma from "@/lib/prisma";

export async function getTransactions(limit?: number) {
    try {
        const transactions = await prisma.financialTransaction.findMany({
            orderBy: { date: 'desc' },
            take: limit,
            include: {
                members: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                documents: true,
            }
        });
        return transactions;
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw new Error("Failed to fetch transactions");
    }
}

export async function getFinancialSummary() {
    try {
        const income = await prisma.financialTransaction.aggregate({
            where: { type: "Income" },
            _sum: { amount: true }
        });

        const expenses = await prisma.financialTransaction.aggregate({
            where: { type: "Expense" },
            _sum: { amount: true }
        });

        const totalIncome = income._sum.amount || 0;
        const totalExpenses = expenses._sum.amount || 0;
        const balance = totalIncome - totalExpenses;

        return {
            totalIncome,
            totalExpenses,
            balance
        };
    } catch (error) {
        console.error("Failed to fetch financial summary:", error);
        throw new Error("Failed to fetch financial summary");
    }
}
