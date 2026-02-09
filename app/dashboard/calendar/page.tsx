"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const events = [
    { date: new Date(2024, 11, 15), title: "Soccer Practice", type: "kids" },
    { date: new Date(2024, 11, 20), title: "Family Dinner", type: "family" },
    { date: new Date(2024, 11, 25), title: "Dentist Appt", type: "health" },
]

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        setDate(new Date())
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Family Calendar</h2>
                <Select defaultValue="all" onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-7 md:col-span-5">
                    <CardHeader>
                        <CardTitle>Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border w-full flex justify-center"
                        />
                    </CardContent>
                </Card>
                <Card className="col-span-7 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Events for {date?.toLocaleDateString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {events.map((event, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium">{event.title}</p>
                                        <Badge variant="outline" className="mt-1 capitalize">{event.type}</Badge>
                                    </div>
                                </div>
                            ))}
                            <p className="text-sm text-muted-foreground">No more events for this day.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
