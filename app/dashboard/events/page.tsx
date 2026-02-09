"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Clock, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Mock type definition
interface Event {
    id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    created_by: string;
    type?: "family" | "kids" | "health" | "work";
}

const mockEvents: Event[] = [
    {
        id: "1",
        title: "Family Dinner",
        description: "Monthly family gathering with grandparents",
        start_time: "2024-12-01T18:00:00Z",
        end_time: "2024-12-01T21:00:00Z",
        location: "Grandma's House",
        created_by: "1",
        type: "family",
    },
    {
        id: "2",
        title: "John's Birthday",
        description: "Celebrate John's 12th birthday",
        start_time: "2024-12-15T14:00:00Z",
        end_time: "2024-12-15T18:00:00Z",
        location: "Our Home",
        created_by: "2",
        type: "family",
    },
    {
        id: "3",
        title: "Soccer Practice",
        start_time: "2024-12-10T16:00:00Z",
        end_time: "2024-12-10T18:00:00Z",
        location: "Community Field",
        created_by: "1",
        type: "kids",
    },
]

const getEventTypeVariant = (type?: string) => {
    switch (type) {
        case "family": return "sage";
        case "kids": return "gold";
        case "health": return "terracotta";
        default: return "secondary";
    }
}

export default function EventsPage() {
    const [date, setDate] = useState<Date | undefined>(undefined)

    useEffect(() => {
        setDate(new Date())
    }, [])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Events</h1>
                    <p className="text-muted-foreground">Keep track of your family's schedule</p>
                </div>
                <Dialog>
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
                        <div className="py-4">
                            <p className="text-muted-foreground text-sm">Event creation form coming soon...</p>
                        </div>
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
                            {mockEvents.map((event, index) => (
                                <div
                                    key={event.id}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group animate-fade-in-up"
                                    style={{ animationDelay: `${200 + index * 100}ms` }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-card flex flex-col items-center justify-center border shadow-sm flex-shrink-0">
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {format(new Date(event.start_time), "MMM")}
                                        </span>
                                        <span className="text-lg font-display font-medium">
                                            {format(new Date(event.start_time), "d")}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium truncate">{event.title}</h3>
                                            {event.type && (
                                                <Badge variant={getEventTypeVariant(event.type) as any} className="capitalize text-xs">
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
                                                {format(new Date(event.start_time), "h:mm a")}
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
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
