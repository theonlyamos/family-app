"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Define valid variants for Badge component
type ValidBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "sage" | "terracotta" | "gold" | "blue" | "rose" | null | undefined

const getInvestmentTypeVariant = (type: string): ValidBadgeVariant => {
    switch (type) {
        case "stock": return "blue"
        case "crypto": return "gold"
        case "real_estate": return "sage"
        case "bond": return "secondary"
        default: return "default"
    }
}

export default function InvestmentsPage() {
    const investments = useQuery(api.investments.list)
    const createInvestment = useMutation(api.investments.create)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [form, setForm] = useState({
        name: "",
        type: "",
        amount: "",
        date: "",
        notes: "",
        change: "",
    })

    const handleCreate = async () => {
        if (!form.name || !form.type || !form.amount || !form.date) return
        await createInvestment({
            name: form.name,
            type: form.type as "stock" | "crypto" | "real_estate" | "bond" | "other",
            amount: parseFloat(form.amount),
            date: form.date,
            ...(form.notes && { notes: form.notes }),
            ...(form.change && { change: parseFloat(form.change) }),
        })
        setForm({ name: "", type: "", amount: "", date: "", notes: "", change: "" })
        setIsDialogOpen(false)
    }

    if (investments === undefined) {
        return (
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Investments</h1>
                    <p className="text-muted-foreground">Loading investments...</p>
                </div>
            </div>
        )
    }

    const totalValue = investments.reduce((acc, curr) => acc + curr.amount, 0)
    const totalChange = investments.length > 0
        ? investments.reduce((acc, curr) => acc + (curr.change || 0), 0) / investments.length
        : 0

    // Find top performer
    const topPerformer = investments.length > 0
        ? investments.reduce((best, curr) => (curr.change || 0) > (best.change || 0) ? curr : best, investments[0])
        : null

    // Count unique types
    const uniqueTypes = new Set(investments.map(i => i.type)).size

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Investments</h1>
                    <p className="text-muted-foreground">Track and manage your family's financial portfolio</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-md hover:shadow-lg transition-shadow">
                            <Plus className="mr-2 h-4 w-4" /> Add Investment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-display text-xl">Add Investment</DialogTitle>
                            <DialogDescription>Add a new investment to your portfolio.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Name *</Label>
                                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Apple Inc." className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type *</Label>
                                    <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="stock">Stock</SelectItem>
                                            <SelectItem value="crypto">Crypto</SelectItem>
                                            <SelectItem value="real_estate">Real Estate</SelectItem>
                                            <SelectItem value="bond">Bond</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount ($) *</Label>
                                    <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="15000" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date Acquired *</Label>
                                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Change (%)</Label>
                                    <Input type="number" step="0.1" value={form.change} onChange={(e) => setForm({ ...form, change: e.target.value })} placeholder="12.5" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." className="rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="rounded-xl" disabled={!form.name || !form.type || !form.amount || !form.date} onClick={handleCreate}>
                                Add Investment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                            <span className={`flex items-center ${totalChange >= 0 ? "text-primary" : "text-destructive"} font-medium`}>
                                {totalChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                {Math.abs(totalChange).toFixed(1)}%
                            </span>
                            <span className="text-muted-foreground">avg return</span>
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
                        <div className="text-3xl font-display font-medium tracking-tight mb-1">{topPerformer?.name || "—"}</div>
                        <div className="flex items-center gap-1.5 text-xs">
                            {topPerformer?.change !== undefined && (
                                <span className="flex items-center text-primary font-medium">
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    {topPerformer.change}%
                                </span>
                            )}
                            <span className="text-muted-foreground">return</span>
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
                            {uniqueTypes} asset {uniqueTypes === 1 ? "class" : "classes"}
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
                            {totalChange >= 0 ? "+" : ""}{totalChange.toFixed(1)}%
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
                            {investments.map((investment, index) => (
                                <TableRow
                                    key={investment._id}
                                    className="cursor-pointer transition-colors"
                                    style={{ animationDelay: `${500 + index * 50}ms` }}
                                >
                                    <TableCell className="font-medium">{investment.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={getInvestmentTypeVariant(investment.type)} className="capitalize font-normal">
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
