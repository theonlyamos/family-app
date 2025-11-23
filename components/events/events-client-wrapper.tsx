"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    getDate
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Event } from "@prisma/client"

interface EventsClientWrapperProps {
    initialEvents: Event[]
}

export function EventsClientWrapper({ initialEvents }: EventsClientWrapperProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [filter, setFilter] = useState("all")

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    const filteredEvents = initialEvents.filter((event) => {
        if (filter !== "all" && event.type?.toLowerCase() !== filter) return false
        if (selectedDate && !isSameDay(new Date(event.date), selectedDate)) return false
        return true
    })

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Helper to get color based on type (mock logic for now)
    const getEventColor = (type: string | null) => {
        switch (type?.toLowerCase()) {
            case 'family': return 'bg-purple-500'
            case 'kids': return 'bg-yellow-400'
            case 'health': return 'bg-blue-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Events</h2>
                    <p className="text-muted-foreground">
                        Organize and view all your family's upcoming events in one place.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select defaultValue="all" onValueChange={setFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Filter by type</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/dashboard/events/new">Create Event</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Calendar Grid */}
                <Card className="md:col-span-8 border-none shadow-sm">
                    <CardContent className="p-6">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <Button variant="ghost" size="icon" onClick={prevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h3 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h3>
                            <Button variant="ghost" size="icon" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Cells */}
                        <div className="grid grid-cols-7 auto-rows-[1fr] border-t border-l">
                            {calendarDays.map((day, dayIdx) => {
                                const isSelected = isSameDay(day, selectedDate)
                                const isCurrentMonth = isSameMonth(day, currentMonth)
                                const isTodayDate = isToday(day)

                                // Find events for this day
                                const dayEvents = initialEvents.filter(e => isSameDay(new Date(e.date), day))

                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={`
                                            min-h-[100px] p-2 border-b border-r cursor-pointer transition-colors relative
                                            ${!isCurrentMonth ? 'bg-gray-50/50 text-muted-foreground' : 'bg-white'}
                                            ${isSelected && !isTodayDate ? 'bg-blue-100/50' : ''}
                                            ${isTodayDate ? 'bg-blue-600 text-white' : ''}
                                            hover:bg-gray-50
                                        `}
                                    >
                                        <span className={`
                                            text-sm font-medium
                                            ${!isCurrentMonth ? 'text-gray-400' : ''}
                                        `}>
                                            {format(day, "d")}
                                        </span>

                                        {/* Event Dots */}
                                        <div className="flex flex-col gap-1 mt-1">
                                            {dayEvents.map((event, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-2 w-2 rounded-full ${getEventColor(event.type)} ${isTodayDate ? 'ring-1 ring-white' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Event List Side Panel */}
                <Card className="md:col-span-4 h-fit border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Events for {format(selectedDate, "MMMM d, yyyy")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <Link href={`/dashboard/events/${event.id}`} key={event.id} className="block group">
                                    <div className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        {/* Colored Bar */}
                                        <div className={`w-1 self-stretch rounded-full ${getEventColor(event.type)}`} />

                                        <div className="flex-1">
                                            <h4 className="font-semibold text-base group-hover:text-blue-600 transition-colors">
                                                {event.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground mb-2">{format(new Date(event.date), "h:mm a")}</p>
                                            <Badge variant="secondary" className="border-none">
                                                {event.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No events scheduled for this day.</p>
                                <Button variant="link" className="mt-2 text-blue-600" asChild>
                                    <Link href="/dashboard/events/new">Create one?</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
