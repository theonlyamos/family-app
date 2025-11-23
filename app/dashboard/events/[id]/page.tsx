export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Edit2, Trash2, CheckCircle2, XCircle, HelpCircle, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getEvent } from "@/app/data/events"
import { notFound } from "next/navigation"
import { format } from "date-fns"

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
    const event = await getEvent(params.id)

    if (!event) {
        notFound()
    }

    // Mock attendees for now
    const attendees = [
        { name: "Michael Anderson", role: "Organizer", avatar: "/avatars/michael.png", status: "going" },
        { name: "Sarah Anderson", role: "", avatar: "/avatars/sarah.png", status: "going" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <Link href="/dashboard/events">Back to Schedule</Link>
            </div>

            <Card>
                <CardContent className="p-8 space-y-8">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                    {event.type}
                                </Badge>
                                <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>{format(event.date, "EEEE, MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                <span>{format(event.date, "h:mm a")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                <span>{event.location || "No location"}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column: Description & RSVP */}
                        <div className="md:col-span-2 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Description</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {event.description || "No description provided."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Your RSVP</h3>
                                <div className="flex gap-4">
                                    <Button className="bg-green-600 hover:bg-green-700 gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Going
                                    </Button>
                                    <Button variant="secondary" className="gap-2">
                                        <XCircle className="h-4 w-4" />
                                        Can't Go
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Attendees */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Attendees ({attendees.length})</h3>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Invite
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {attendees.map((attendee, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={attendee.avatar} />
                                                <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm">{attendee.name}</div>
                                                {attendee.role && (
                                                    <div className="text-xs text-muted-foreground">{attendee.role}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {attendee.status === "going" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                            {attendee.status === "declined" && <XCircle className="h-5 w-5 text-red-600" />}
                                            {attendee.status === "maybe" && <HelpCircle className="h-5 w-5 text-muted-foreground" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
