"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { createEvent } from "@/app/actions/events"
import { useRouter } from "next/navigation"
import { Member } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateEventFormProps {
    members: Member[]
}

export function CreateEventForm({ members }: CreateEventFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])

    const handleSubmit = async (formData: FormData) => {
        // Append selected attendees to formData
        // Since we can't directly append array to FormData in a way that server action automatically parses as array of strings easily without custom parsing,
        // we'll handle this by sending multiple 'attendees' entries or a JSON string.
        // For simplicity with standard FormData handling in server actions, let's assume the server action handles 'attendees' as GetAll or we pass it differently.
        // Actually, looking at the server action signature (which I recall takes FormData), I might need to adjust how I pass data or how the server action reads it.
        // Let's rely on the server action to read 'attendees' from formData.getAll('attendees').

        selectedAttendees.forEach(id => formData.append('attendees', id))

        startTransition(async () => {
            try {
                await createEvent(formData)
                router.push("/dashboard/events")
            } catch (error) {
                console.error("Failed to create event:", error)
            }
        })
    }

    const toggleAttendee = (memberId: string) => {
        setSelectedAttendees(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        )
    }

    return (
        <form action={handleSubmit}>
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" name="title" placeholder="e.g., Grandma's Birthday Dinner" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <div className="relative">
                                <Input id="date" name="date" type="date" className="pl-3" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <div className="relative">
                                <Input id="time" name="time" type="time" className="pl-3" required />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="location" name="location" placeholder="e.g., 123 Main St, Anytown" className="pl-9" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Add any additional details about the event..." className="min-h-[100px]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Attendees</Label>
                            <div className="border rounded-md p-2 h-[120px] overflow-y-auto text-sm">
                                <div className="space-y-1">
                                    {members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer"
                                            onClick={() => toggleAttendee(member.id)}
                                        >
                                            <Checkbox
                                                checked={selectedAttendees.includes(member.id)}
                                                onCheckedChange={() => toggleAttendee(member.id)}
                                                id={`member-${member.id}`}
                                            />
                                            <Label htmlFor={`member-${member.id}`} className="cursor-pointer">{member.firstName} {member.lastName}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Event Type</Label>
                            <Select name="type" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="family">Family</SelectItem>
                                    <SelectItem value="kids">Kids</SelectItem>
                                    <SelectItem value="health">Health</SelectItem>
                                    <SelectItem value="work">Work</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/events">Cancel</Link>
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Event"}
                </Button>
            </div>
        </form>
    )
}
