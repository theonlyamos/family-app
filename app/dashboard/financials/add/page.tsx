import { getMembers } from "@/app/data/members";
import { TransactionForm } from "@/components/financials/transaction-form";

export default async function AddTransactionPage() {
    const members = await getMembers();

    return <TransactionForm members={members} />;
}
