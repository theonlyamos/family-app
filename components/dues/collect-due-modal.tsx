"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState, useTransition, useEffect } from "react"
import { createDuePayment } from "@/app/actions/due-payments"
import { Due, Member } from "@prisma/client"
import { toast } from "sonner"

interface CollectDueModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    due: Due
    members: Member[]
}

export function CollectDueModal({ open, onOpenChange, due, members = [] }: CollectDueModalProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [amount, setAmount] = useState(due.amount.toString())
    const [selectedMember, setSelectedMember] = useState(due.memberId || "")
    const [paymentMethod, setPaymentMethod] = useState("Cash")
    const [notes, setNotes] = useState("")

    const [isPending, startTransition] = useTransition()

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setDate(new Date())
            setAmount(due.amount.toString())
            setSelectedMember(due.memberId || "")
            setPaymentMethod("Cash")
            setNotes("")
        }
    }, [open, due])

    const handleSubmit = async () => {
        if (!date || !amount || !selectedMember || !paymentMethod) return

        const formData = new FormData()
        formData.append("dueId", due.id)
        formData.append("memberId", selectedMember)
        formData.append("amount", amount)
        formData.append("paymentDate", date.toISOString())
        formData.append("paymentMethod", paymentMethod)
        formData.append("notes", notes)

        startTransition(async () => {
            try {
                await createDuePayment(formData)
                toast.success("Payment collected successfully!")
                onOpenChange(false)
            } catch (error) {
                console.error("Failed to collect payment:", error)
                toast.error("Failed to collect payment")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Collect Due Payment</DialogTitle>
                    <DialogDescription>
                        Record a payment for "{due.title}".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="member">Member</Label>
                        <Select value={selectedMember} onValueChange={setSelectedMember} disabled={!!due.memberId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map(member => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.firstName} {member.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount Collected</Label>
                            <Input
                                id="amount"
                                placeholder="0.00"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Payment Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="method">Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Card">Card</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Check">Check</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            placeholder="Additional details..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Recording..." : "Record Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
