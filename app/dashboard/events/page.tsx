"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MapPin, Clock, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
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
import type { Doc } from "@/convex/_generated/dataModel"

// Define valid variants for Badge component
type ValidBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "sage" | "terracotta" | "gold" | "blue" | "rose" | null | undefined

const getEventTypeVariant = (type?: string): ValidBadgeVariant => {
    switch (type) {
        case "family": return "sage"
        case "kids": return "terracotta"
        case "health": return "rose"
        case "work": return "blue"
        default: return "default"
    }
}

export default function EventsPage() {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        type: "" as string,
    })

    const events = useQuery(api.events.list)
    const members = useQuery(api.members.list)
    const createEvent = useMutation(api.events.create)

    // Delay to avoid SSR hydration mismatch
    useEffect(() => {
        setDate(new Date())
    }, [])

    const handleCreateEvent = async () => {
        if (!eventForm.title || !eventForm.startTime || !eventForm.endTime || !members?.length) return
        await createEvent({
            title: eventForm.title,
            ...(eventForm.description && { description: eventForm.description }),
            startTime: eventForm.startTime,
            endTime: eventForm.endTime,
            ...(eventForm.location && { location: eventForm.location }),
            createdBy: members[0]._id, // TODO: Use authenticated user once auth is fully wired up
            ...(eventForm.type && eventForm.type !== "none" && { type: eventForm.type as "family" | "kids" | "health" | "work" }),
        })
        setEventForm({ title: "", description: "", startTime: "", endTime: "", location: "", type: "" })
        setIsDialogOpen(false)
    }

    if (events === undefined) {
        return (
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Events</h1>
                    <p className="text-muted-foreground">Loading events...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Events</h1>
                    <p className="text-muted-foreground">Keep track of your family's schedule</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-md hover:shadow-lg transition-shadow">
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-display text-xl">Add Event</DialogTitle>
                            <DialogDescription>
                                Create a new event for your family calendar.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Event title" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Event description" className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Time *</Label>
                                    <Input type="datetime-local" value={eventForm.startTime} onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time *</Label>
                                    <Input type="datetime-local" value={eventForm.endTime} onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })} className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Event location" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="family">Family</SelectItem>
                                        <SelectItem value="kids">Kids</SelectItem>
                                        <SelectItem value="health">Health</SelectItem>
                                        <SelectItem value="work">Work</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="rounded-xl" disabled={!eventForm.title || !eventForm.startTime || !eventForm.endTime} onClick={handleCreateEvent}>
                                Create Event
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                {/* Calendar */}
                <Card className="lg:col-span-3 animate-fade-in-up">
                    <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-muted-foreground" />
                            Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-xl"
                        />
                    </CardContent>
                </Card>

                {/* Events List */}
                <Card className="lg:col-span-4 animate-fade-in-up animation-delay-100">
                    <CardHeader>
                        <CardTitle className="font-display text-lg">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {events.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No events yet. Create your first event!</p>
                            ) : (
                                events.map((event, index) => (
                                    <div
                                        key={event._id}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group animate-fade-in-up"
                                        style={{ animationDelay: `${200 + index * 100}ms` }}
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-card flex flex-col items-center justify-center border shadow-sm flex-shrink-0">
                                            <span className="text-xs text-muted-foreground font-medium">
                                                {format(new Date(event.startTime), "MMM")}
                                            </span>
                                            <span className="text-lg font-display font-medium">
                                                {format(new Date(event.startTime), "d")}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium truncate">{event.title}</h3>
                                                {event.type && (
                                                    <Badge variant={getEventTypeVariant(event.type)} className="capitalize font-normal">
                                                        {event.type}
                                                    </Badge>
                                                )}
                                            </div>
                                            {event.description && (
                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                                    {event.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(event.startTime), "h:mm a")}
                                                </span>
                                                {event.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {event.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
