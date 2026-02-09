"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Event } from "@/types"
import { format } from "date-fns"

const mockEvents: Event[] = [
    {
        id: "1",
        title: "Family Dinner",
        description: "Monthly family gathering",
        start_time: "2024-12-01T18:00:00Z",
        end_time: "2024-12-01T21:00:00Z",
        location: "Grandma's House",
        created_by: "1",
    },
    {
        id: "2",
        title: "John's Birthday",
        start_time: "2024-12-15T14:00:00Z",
        end_time: "2024-12-15T18:00:00Z",
        created_by: "2",
    },
]

export default function EventsPage() {
    const [date, setDate] = useState<Date | undefined>(undefined)

    useEffect(() => {
        setDate(new Date())
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Events</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium leading-none">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(event.start_time), "PPP")}
                                            {event.location && ` • ${event.location}`}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
