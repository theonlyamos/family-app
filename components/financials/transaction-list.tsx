import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    date: Date;
    description: string | null;
    member: {
        firstName: string;
        lastName: string;
    } | null;
    documents?: {
        id: string;
        name: string;
        url: string;
    }[];
}

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Docs</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {format(new Date(transaction.date), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>{transaction.description || "-"}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>
                                    {transaction.member
                                        ? `${transaction.member.firstName} ${transaction.member.lastName}`
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={transaction.type === "Income" ? "default" : "destructive"}>
                                        {transaction.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {transaction.documents && transaction.documents.length > 0 && (
                                        <div className="flex gap-1">
                                            {transaction.documents.map((doc) => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title={doc.name}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className={`text-right font-medium ${transaction.type === "Income" ? "text-green-600" : "text-red-600"
                                    }`}>
                                    {transaction.type === "Income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
