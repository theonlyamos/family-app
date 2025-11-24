import { getFinancialSummary, getTransactions } from "@/app/data/financials";
import { SummaryCards } from "@/components/financials/summary-cards";
import { TransactionList } from "@/components/financials/transaction-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function FinancialsPage() {
    const summary = await getFinancialSummary();
    const transactions = await getTransactions(10);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
                <Button asChild>
                    <Link href="/dashboard/financials/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Link>
                </Button>
            </div>

            <SummaryCards
                totalIncome={summary.totalIncome}
                totalExpenses={summary.totalExpenses}
                balance={summary.balance}
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Transactions</h2>
                    <Button variant="link" asChild>
                        <Link href="/dashboard/financials/history">
                            View All
                        </Link>
                    </Button>
                </div>
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
}
