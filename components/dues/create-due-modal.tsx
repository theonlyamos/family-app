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
import { useState, useTransition } from "react"
import { createDueOffline, updateDueOffline } from "@/lib/actions/due-actions-offline"
import { Member } from "@prisma/client"
import { toast } from "sonner"

export interface DueFormData {
    id?: string
    name: string
    amount: string
    date: Date | undefined
    members: string
    recurrence: string
    description?: string
}

interface CreateDueModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: DueFormData
    members?: Member[]
}

export function CreateDueModal({ open, onOpenChange, initialData, members = [] }: CreateDueModalProps) {
    const [date, setDate] = useState<Date | undefined>(initialData?.date)
    const [name, setName] = useState(initialData?.name || "")
    const [amount, setAmount] = useState(initialData?.amount || "")
    const [selectedMember, setSelectedMember] = useState(initialData?.members || "")
    const [recurrence, setRecurrence] = useState(initialData?.recurrence || "")
    const [description, setDescription] = useState(initialData?.description || "")

    const [isPending, startTransition] = useTransition()

    const isEditing = !!initialData

    const handleSubmit = async () => {
        if (!date || !name || !amount) return

        const formData = new FormData()
        formData.append("title", name)
        formData.append("amount", amount)
        formData.append("dueDate", date.toISOString())
        formData.append("description", description)
        if (selectedMember) {
            formData.append("assignedToId", selectedMember === "all" ? "" : selectedMember)
        }

        startTransition(async () => {
            try {
                if (isEditing && initialData.id) {
                    formData.append("status", "Pending")
                    await updateDueOffline(initialData.id, formData)
                    toast.success("Due updated successfully!")
                } else {
                    await createDueOffline(formData)
                    toast.success("Due created successfully!")
                }
                onOpenChange(false)
                // Reset form if creating
                if (!isEditing) {
                    setName("")
                    setAmount("")
                    setDate(undefined)
                    setDescription("")
                }
            } catch (error) {
                // Error toast already shown by offline wrapper
                console.error("Failed to save due:", error)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Due" : "Create New Due"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the details of this due." : "Create a new due for family members."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Due Name / Title</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Annual Family Contribution"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Optional description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                placeholder="150.00"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Due Date</Label>
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
                        <Label htmlFor="members">Assign to Member</Label>
                        <Select value={selectedMember} onValueChange={setSelectedMember}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Members</SelectItem>
                                {members.map(member => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.firstName} {member.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Saving..." : (isEditing ? "Update Due" : "Save Due")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
