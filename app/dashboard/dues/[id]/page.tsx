export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getDue } from "@/app/data/dues"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { DueDetailsClientWrapper } from "@/components/dues/due-details-client-wrapper"

export default async function DueDetailsPage({ params }: { params: { id: string } }) {
    const due = await getDue(params.id)

    if (!due) {
        notFound()
    }

    // Mock collections for now as we don't have a Collection model yet
    const collections = [
        { id: "1", member: "John Doe", amount: 50.00, date: "Dec 15, 2024", method: "Card", avatar: "/avatars/01.png" },
        { id: "2", member: "Jane Smith", amount: 50.00, date: "Dec 18, 2024", method: "Cash", avatar: "/avatars/02.png" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Link href="/dashboard/dues" className="hover:text-foreground flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        Dues
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{due.title}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{due.title}</h2>
                        <p className="text-muted-foreground">{due.description || "No description provided."}</p>
                    </div>
                    <DueDetailsClientWrapper due={due} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${due.amount.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{due.status}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Due Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{format(due.dueDate, "MMM d, yyyy")}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex -space-x-2">
                            {/* TODO: Fetch actual assigned members */}
                            <Avatar className="border-2 border-background h-8 w-8">
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Avatar className="border-2 border-background h-8 w-8">
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +2
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Collections Made</h3>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>MEMBER NAME</TableHead>
                                    <TableHead>AMOUNT COLLECTED</TableHead>
                                    <TableHead>COLLECTION DATE</TableHead>
                                    <TableHead>PAYMENT METHOD</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {collections.map((collection) => (
                                    <TableRow key={collection.id}>
                                        <TableCell className="flex items-center gap-2 font-medium">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={collection.avatar} alt={collection.member} />
                                                <AvatarFallback>{collection.member[0]}</AvatarFallback>
                                            </Avatar>
                                            {collection.member}
                                        </TableCell>
                                        <TableCell>${collection.amount.toFixed(2)}</TableCell>
                                        <TableCell>{collection.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={
                                                collection.method === 'Card' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }>
                                                {collection.method}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
