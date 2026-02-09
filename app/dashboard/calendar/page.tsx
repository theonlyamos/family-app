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
import { CalendarDays, Clock } from "lucide-react"

const events = [
    { date: new Date(2024, 11, 15), title: "Soccer Practice", type: "kids", time: "4:00 PM" },
    { date: new Date(2024, 11, 20), title: "Family Dinner", type: "family", time: "6:00 PM" },
    { date: new Date(2024, 11, 25), title: "Dentist Appt", type: "health", time: "2:00 PM" },
    { date: new Date(2024, 11, 28), title: "School Play", type: "kids", time: "7:00 PM" },
]

const getEventTypeVariant = (type: string) => {
    switch (type) {
        case "family": return "sage";
        case "kids": return "gold";
        case "health": return "terracotta";
        default: return "secondary";
    }
}

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        setDate(new Date())
    }, [])

    const filteredEvents = events.filter(event => 
        filter === "all" || event.type === filter
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Family Calendar</h1>
                    <p className="text-muted-foreground">View and manage your family's schedule</p>
                </div>
                <Select defaultValue="all" onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px] rounded-xl">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                {/* Main Calendar */}
                <Card className="lg:col-span-5 animate-fade-in-up">
                    <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-muted-foreground" />
                            Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full flex justify-center rounded-xl"
                        />
                    </CardContent>
                </Card>

                {/* Events for Selected Day */}
                <Card className="lg:col-span-2 animate-fade-in-up animation-delay-100">
                    <CardHeader>
                        <CardTitle className="font-display text-lg">
                            {date ? formatDateHeader(date) : "Select a date"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event, index) => (
                                    <div 
                                        key={index} 
                                        className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-medium text-sm">{event.title}</h4>
                                            <Badge 
                                                variant={getEventTypeVariant(event.type) as any} 
                                                className="capitalize text-xs flex-shrink-0"
                                            >
                                                {event.type}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {event.time}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No events scheduled for this period.
                                </p>
                            )}
                        </div>
                        
                        {/* Legend */}
                        <div className="mt-6 pt-4 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-3">Event Types</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="sage" className="text-xs">Family</Badge>
                                <Badge variant="gold" className="text-xs">Kids</Badge>
                                <Badge variant="terracotta" className="text-xs">Health</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function formatDateHeader(date: Date): string {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
        return "Today's Events"
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow's Events"
    } else {
        return date.toLocaleDateString("en-US", { 
            weekday: "long", 
            month: "short", 
            day: "numeric" 
        })
    }
}
