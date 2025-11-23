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
import { useState } from "react"

interface CollectDueModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CollectDueModal({ open, onOpenChange }: CollectDueModalProps) {
    const [date, setDate] = useState<Date>()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Collect Dues</DialogTitle>
                    <DialogDescription>
                        Record a payment from a family member.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="member">Member Name</Label>
                        <Input id="member" placeholder="Michael Johnson" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dueItem">Due Item</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select due item" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="annual">Annual Fee (Overdue) - $150.00</SelectItem>
                                <SelectItem value="utilities">Utilities - $50.00</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount Collected</Label>
                        <Input id="amount" placeholder="150.00" type="number" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Collection Date</Label>
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
                    <div className="grid gap-2">
                        <Label htmlFor="method">Payment Method</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" onClick={() => onOpenChange(false)}>Record Payment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
