import React from "react";
import type { Metadata } from "next";
import { getEventBySlug, getAllEvents } from "../../../lib/events";
import EventYearPhase from "@/components/event-year-phase";
import ReactMarkdown from "react-markdown";
import { transformPersonMentions } from "@/lib/mentions";
import SmartImage from "@/components/smart-image";
import NotFound from "@/components/not-found";
import Badge from "@/components/badge";
import BackLink from "@/components/back-link";
import RelatedGrid from "@/components/related-grid";
import type { EventPhase, EventYearDetail } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = getEventBySlug(id);

  return {
    title: event.title as string,
    description: event.description as string,
    openGraph: {
      title: event.title as string,
      description: event.description as string,
      type: "article",
      ...(event.thumbnail && {
        images: [{ url: event.thumbnail as string }],
      }),
    },
  };
}

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    id: event.slug,
  }));
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventData = getEventBySlug(id);

  if (!eventData.slug) {
    return (
      <NotFound
        title="Event Not Found"
        backHref="/events"
        backLabel="Return to Events"
      />
    );
  }

  const allEvents = getAllEvents();
  const relatedEvents = allEvents.filter((e) => e.slug !== id).slice(0, 2);
  const transformedDescription = eventData.description
    ? transformPersonMentions(eventData.description as string)
    : undefined;
  const transformedYears = Object.entries(
    (eventData.years as Record<string, EventYearDetail>) ?? {},
  ).reduce<Record<string, EventYearDetail>>((accumulator, [year, detail]) => {
    accumulator[year] = {
      ...detail,
      phases: (detail.phases ?? []).map((phase: EventPhase) => ({
        ...phase,
        body: transformPersonMentions(phase.body ?? ""),
      })),
    };

    return accumulator;
  }, {});

  return (
    <article className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <BackLink href="/events" label="Back to Events" />

        <div className="flex items-center space-x-2 mb-6">
          <Badge>{eventData.category}</Badge>
          {eventData.isUpcoming && (
            <>
              <span className="text-gray-400 text-sm">&bull;</span>
              <Badge tone="green">Upcoming</Badge>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
          {eventData.title}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {eventData.thumbnail && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg bg-gray-50 p-4">
            <div className="relative aspect-[16/9] w-full">
              <SmartImage
                src={eventData.thumbnail as string}
                alt={eventData.title as string}
                href={eventData.thumbnail as string}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        )}

        {eventData.description && (
          <div className="prose prose-lg prose-amber max-w-none text-gray-700 leading-relaxed mb-12">
            <ReactMarkdown>{transformedDescription}</ReactMarkdown>
          </div>
        )}

        <EventYearPhase
          years={transformedYears}
          topDescription={transformedDescription}
        />

        <RelatedGrid
          title="More Events"
          items={relatedEvents.map((related) => ({
            href: `/events/${related.slug}`,
            eyebrow: related.category as string,
            title: related.title as string,
            body: related.description as string,
          }))}
        />
      </div>
    </article>
  );
}
