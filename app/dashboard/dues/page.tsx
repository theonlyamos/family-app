export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { CreateDueModal } from "@/components/dues/create-due-modal"
import Link from "next/link"
import { getDues } from "@/app/data/dues"
import { getMembers } from "@/app/data/members"
import { format } from "date-fns"
import { DuesClientWrapper } from "@/components/dues/dues-client-wrapper"

export default async function DuesPage() {
    const dues = await getDues()
    const members = await getMembers()

    // Calculate totals
    const totalCollected = 1250.00 // TODO: Calculate from actual collections
    const outstanding = dues
        .filter((d: { status: string }) => d.status !== 'Paid')
        .reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dues</h2>
                    <p className="text-muted-foreground">
                        Track family dues and financial contributions.
                    </p>
                </div>
                <DuesClientWrapper members={members} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Dues Collected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalCollected.toFixed(2)}</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            +15.2%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Outstanding Dues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${outstanding.toFixed(2)}</div>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            +5.0%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Next Due Date
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Oct 15, 2024</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            in 2 weeks
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Dues Tracker</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by name..." className="pl-8" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>TITLE</TableHead>
                                <TableHead>AMOUNT</TableHead>
                                <TableHead>DUE DATE</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead className="text-right">ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dues.map((due: { id: string; title: string; amount: number; dueDate: Date; status: string }) => (
                                <TableRow
                                    key={due.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium">
                                        <Link href={`/dashboard/dues/${due.id}`} className="block w-full h-full">
                                            {due.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>${due.amount.toFixed(2)}</TableCell>
                                    <TableCell>{format(due.dueDate, "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${due.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                            ${due.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
                                            ${due.status === 'Overdue' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                                        `}>
                                            {due.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/dues/${due.id}`}>View Details</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
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
