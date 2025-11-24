import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

interface SummaryCardsProps {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
}

export function SummaryCards({ totalIncome, totalExpenses, balance }: SummaryCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Balance
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Current financial standing
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Income
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">+${totalIncome.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total earnings
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Expenses
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">-${totalExpenses.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total spending
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
