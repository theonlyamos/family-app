import prisma from "@/lib/prisma";
import { offlineFetch } from "@/lib/data/offline-wrapper";

export async function getTransactions(limit?: number) {
    const result = await offlineFetch(
        async () => {
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
        },
        { storeName: 'financials' }
    );

    return result.data;
}

export async function getFinancialSummary() {
    const result = await offlineFetch(
        async () => {
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
        },
        { storeName: 'financials', key: 'summary' }
    );

    return result.data;
}

