import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { getEventBySlug, getAllEvents } from "../../../lib/events";
import EventYearPhase from "@/components/event-year-phase";
import ReactMarkdown from "react-markdown";
import { transformPersonMentions } from "@/lib/mentions";
import SmartImage from "@/components/smart-image";
import type { EventPhase, EventYearDetail } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = getEventBySlug(id, ["title", "description", "thumbnail"]);

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
  const events = getAllEvents(["slug"]);
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
  const eventData = getEventBySlug(id, [
    "title",
    "date",
    "displayDate",
    "sortDate",
    "slug",
    "location",
    "category",
    "isUpcoming",
    "description",
    "thumbnail",
    "registrationUrl",
    "content",
    "recurrence",
    "years",
  ]);

  if (!eventData.slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <Link href="/events" className="text-ieee-cs-orange hover:underline">
            Return to Events
          </Link>
        </div>
      </div>
    );
  }

  const allEvents = getAllEvents([
    "slug",
    "title",
    "category",
    "date",
    "description",
  ]);
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
        <Link
          href="/events"
          className="inline-flex items-center text-gray-500 hover:text-ieee-cs-orange transition-colors mb-8 group"
        >
          <FaArrowLeft
            size={16}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Events
        </Link>

        <div className="flex items-center space-x-2 mb-6">
          <span className="bg-amber-50 text-ieee-cs-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            {eventData.category}
          </span>
          {eventData.isUpcoming && (
            <>
              <span className="text-gray-400 text-sm">&bull;</span>
              <span className="bg-green-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Upcoming
              </span>
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

        {relatedEvents.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              More Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedEvents.map((related) => (
                <Link
                  key={related.slug as string}
                  href={`/events/${related.slug}`}
                  className="group block bg-gray-50 p-6 rounded-xl hover:bg-amber-50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                    {related.category}
                  </span>
                  <h4 className="font-bold text-gray-900 group-hover:text-ieee-cs-orange transition-colors mb-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
