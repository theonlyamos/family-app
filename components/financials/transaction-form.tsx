"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createTransactionOffline } from "@/lib/actions/financial-actions-offline"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { FileUpload } from "@/components/ui/file-upload"

interface TransactionFormProps {
    members: any[]
}

export function TransactionForm({ members }: TransactionFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [type, setType] = useState("Expense")
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        formData.append("memberIds", JSON.stringify(selectedMembers))

        // Append all files
        files.forEach((file) => {
            formData.append("files", file)
        })

        startTransition(async () => {
            try {
                await createTransactionOffline(formData)
                toast.success("Transaction created successfully!")
                router.push("/dashboard/financials")
            } catch (error) {
                // Error toast already shown by offline wrapper
                console.error("Error creating transaction:", error)
            }
        })
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Transaction</h1>
                <p className="text-muted-foreground mt-2">
                    Record a new income or expense.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
                                <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select name="type" value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Income">Income</SelectItem>
                                        <SelectItem value="Expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="type" value={type} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                            <Input id="category" name="category" placeholder="e.g., Groceries, Salary, Rent" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                            <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" placeholder="Optional description" />
                        </div>

                        <div className="grid gap-2">
                            <Label>Associated Members</Label>
                            <MultiSelect
                                options={members.map(m => ({
                                    label: `${m.firstName} ${m.lastName}`,
                                    value: m.id
                                }))}
                                selected={selectedMembers}
                                onChange={setSelectedMembers}
                                placeholder="Select members (optional)"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Attachments</Label>
                            <FileUpload
                                value={files}
                                onChange={setFiles}
                                multiple={true}
                                maxSize={50}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 py-6">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/financials">Cancel</Link>
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Transaction"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
