import { getTransactions } from "@/app/data/financials";
import { TransactionList } from "@/components/financials/transaction-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TransactionHistoryPage() {
    const transactions = await getTransactions();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/financials">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
            </div>

            <TransactionList transactions={transactions} />
        </div>
    );
}
