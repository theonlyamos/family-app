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
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock type definition
interface Investment {
    id: string;
    name: string;
    type: string;
    amount: number;
    date: string;
    notes?: string;
    change?: number;
}

const mockInvestments: Investment[] = [
    {
        id: "1",
        name: "Apple Inc.",
        type: "stock",
        amount: 15000.50,
        date: "2023-01-15",
        notes: "Tech sector allocation",
        change: 34.2,
    },
    {
        id: "2",
        name: "Bitcoin",
        type: "crypto",
        amount: 8500.00,
        date: "2023-03-10",
        change: -5.8,
    },
    {
        id: "3",
        name: "Rental Property A",
        type: "real_estate",
        amount: 250000.00,
        date: "2022-06-01",
        change: 12.4,
    },
    {
        id: "4",
        name: "Vanguard ETF",
        type: "stock",
        amount: 45000.00,
        date: "2021-11-20",
        change: 8.7,
    },
]

const getInvestmentTypeVariant = (type: string) => {
    switch (type) {
        case "stock": return "sage";
        case "crypto": return "gold";
        case "real_estate": return "terracotta";
        default: return "secondary";
    }
}

export default function InvestmentsPage() {
    const totalValue = mockInvestments.reduce((acc, curr) => acc + curr.amount, 0)
    const totalChange = mockInvestments.reduce((acc, curr) => acc + (curr.change || 0), 0) / mockInvestments.length

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Investments</h1>
                    <p className="text-muted-foreground">Track and manage your family's financial portfolio</p>
                </div>
                <Button className="shadow-md hover:shadow-lg transition-shadow">
                    <Plus className="mr-2 h-4 w-4" /> Add Investment
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="animate-fade-in-up">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Portfolio Value
                        </CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.94_0.02_145)] text-[oklch(0.35_0.06_145)] flex items-center justify-center">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-medium tracking-tight mb-1">
                            ${totalValue.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="flex items-center text-primary font-medium">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                12.5%
                            </span>
                            <span className="text-muted-foreground">all time</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in-up animation-delay-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Top Performer
                        </CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.95_0.04_85)] text-[oklch(0.40_0.08_85)] flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-medium tracking-tight mb-1">Apple Inc.</div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="flex items-center text-primary font-medium">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                34%
                            </span>
                            <span className="text-muted-foreground">this year</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in-up animation-delay-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Asset Allocation
                        </CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.94_0.06_45)] text-[oklch(0.45_0.12_45)] flex items-center justify-center">
                            <PieChart className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-medium tracking-tight mb-1">Diversified</div>
                        <p className="text-xs text-muted-foreground">
                            3 asset classes
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in-up animation-delay-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Average Return
                        </CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.94_0.02_250)] text-[oklch(0.35_0.06_250)] flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-medium tracking-tight mb-1">
                            +{totalChange.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all investments
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Portfolio Table */}
            <Card className="animate-fade-in-up animation-delay-400">
                <CardHeader>
                    <CardTitle className="font-display text-lg">Portfolio Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-medium">Name</TableHead>
                                <TableHead className="font-medium">Type</TableHead>
                                <TableHead className="font-medium">Date Acquired</TableHead>
                                <TableHead className="font-medium">Performance</TableHead>
                                <TableHead className="text-right font-medium">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockInvestments.map((investment, index) => (
                                <TableRow 
                                    key={investment.id}
                                    className="cursor-pointer transition-colors"
                                    style={{ animationDelay: `${500 + index * 50}ms` }}
                                >
                                    <TableCell className="font-medium">{investment.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={getInvestmentTypeVariant(investment.type) as any} className="capitalize">
                                            {investment.type.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{investment.date}</TableCell>
                                    <TableCell>
                                        {investment.change !== undefined && (
                                            <span className={`flex items-center text-sm ${investment.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                                {investment.change >= 0 ? (
                                                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                                ) : (
                                                    <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                                                )}
                                                {Math.abs(investment.change)}%
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
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
