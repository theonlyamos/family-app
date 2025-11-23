export const dynamic = "force-dynamic"

import { getEvents } from "@/app/data/events"
import { EventsClientWrapper } from "@/components/events/events-client-wrapper"

export default async function EventsPage() {
    const events = await getEvents()

    return (
        <EventsClientWrapper initialEvents={events} />
    )
}
