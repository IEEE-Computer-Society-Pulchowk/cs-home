import React from "react";
import type { Metadata } from "next";
import { getAllEvents } from "../../lib/events";
import EventList from "@/components/event-list";
import { IeeeEvent, EventCategory } from "@/types";

export const metadata: Metadata = {
    title: "Events",
    description:
        "Discover upcoming and past workshops, seminars, hackathons, and networking events from IEEE Computer Society Pulchowk SBC.",
    openGraph: {
        title: "Events | IEEE Computer Society Pulchowk SBC",
        description:
            "Discover upcoming and past workshops, seminars, hackathons, and networking events from IEEE Computer Society Pulchowk SBC.",
    },
};

export default function EventsPage() {
    const events = getAllEvents([
        "slug",
        "title",
        "date",
        "displayDate",
        "sortDate",
        "location",
        "description",
        "category",
        "isUpcoming",
        "thumbnail",
        "registrationUrl",
        "recurrence",
        "years",
    ]);

    const formattedEvents: IeeeEvent[] = events.map((event) => ({
        id: event.slug as string,
        title: event.title as string,
        date: (event.displayDate ?? event.date) as string,
        displayDate: event.displayDate as string | undefined,
        sortDate: event.sortDate as string | undefined,
        location: undefined,
        description: event.description as string,
        category: event.category as EventCategory,
        isUpcoming: event.isUpcoming as unknown as boolean, // gray-matter returns boolean
        imageUrl: event.thumbnail as string,
        registrationUrl: event.registrationUrl as string | undefined,
        recurrence: event.recurrence as string | undefined,
        years: event.years as IeeeEvent["years"],
    }));

    return <EventList events={formattedEvents} />;
}
