"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Investment } from "@/types"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

const mockInvestments: Investment[] = [
    {
        id: "1",
        name: "Apple Inc.",
        type: "stock",
        amount: 15000.50,
        date: "2023-01-15",
        notes: "Tech sector allocation",
    },
    {
        id: "2",
        name: "Bitcoin",
        type: "crypto",
        amount: 8500.00,
        date: "2023-03-10",
    },
    {
        id: "3",
        name: "Rental Property A",
        type: "real_estate",
        amount: 250000.00,
        date: "2022-06-01",
    },
    {
        id: "4",
        name: "Vanguard ETF",
        type: "stock",
        amount: 45000.00,
        date: "2021-11-20",
    },
]

export default function InvestmentsPage() {
    const totalValue = mockInvestments.reduce((acc, curr) => acc + curr.amount, 0)

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Investments</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Portfolio Value
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${totalValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +12.5% all time
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Top Performer
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Apple Inc.</div>
                        <p className="text-xs text-muted-foreground">
                            +34% this year
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Asset Allocation
                        </CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Diversified</div>
                        <p className="text-xs text-muted-foreground">
                            Stocks, Crypto, Real Estate
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date Acquired</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockInvestments.map((investment) => (
                                <TableRow key={investment.id}>
                                    <TableCell className="font-medium">{investment.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            {investment.type.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{investment.date}</TableCell>
                                    <TableCell className="text-right">
                                        ${investment.amount.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
