export const dynamic = "force-dynamic"

import { getMembers } from "@/app/data/members"
import { CreateEventForm } from "@/components/events/create-event-form"

export default async function CreateEventPage() {
    const members = await getMembers()

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Create New Event</h2>
                <p className="text-muted-foreground">
                    Fill in the details below to add a new event to the family calendar.
                </p>
            </div>

            <CreateEventForm members={members} />
        </div>
    )
}
