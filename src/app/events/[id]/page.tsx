import React from "react";
import type { Metadata } from "next";
import { getEventBySlug, getAllEvents } from "@/lib/events.server";
import { getAllPosts } from "@/lib/blogs";
import { plainDescription } from "@/lib/description";
import EventYearPhase from "@/components/event-year-phase";
import ReactMarkdown from "react-markdown";
import { transformPersonMentions } from "@/lib/mentions";
import SmartImage from "@/components/smart-image";
import NotFound from "@/components/not-found";
import Badge from "@/components/badge";
import BackLink from "@/components/back-link";
import RelatedGrid from "@/components/related-grid";
import BlogCard from "@/components/blog-card";
import { GALLERY_ITEMS } from "@/data/gallery";
import type { BlogPost, EventPhase, EventYearDetail } from "@/types";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = getEventBySlug(id);
  const description = plainDescription(event.description as string);

  return {
    title: event.title as string,
    description,
    openGraph: {
      title: event.title as string,
      description,
      type: "article",
      ...(event.thumbnail && {
        images: [{ url: event.thumbnail as string }],
      }),
    },
    twitter: {
      title: event.title as string,
      description,
      ...(event.thumbnail && {
        images: [event.thumbnail as string],
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
  const relatedBlogs: BlogPost[] = getAllPosts()
    .filter((p) => p.event === id)
    .map((post) => ({
      id: post.slug ?? "",
      title: post.title ?? "Untitled",
      excerpt: post.excerpt ?? "",
      date: post.date ?? "",
      category: post.category ?? "General",
      event: post.event,
      imageUrl: post.thumbnail,
      readTime: post.readTime ?? "",
      author: post.author ?? "Contributor",
      authorId: post.authorId,
      authorRole: post.authorRole,
      authorProfilePath: post.authorProfilePath,
      content: "",
    }));
  const relatedGallery = GALLERY_ITEMS.filter((g) => g.event === id);
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

      {(relatedBlogs.length > 0 || relatedGallery.length > 0) && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {relatedBlogs.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-2 h-8 bg-ieee-cs-orange rounded-full mr-3"></span>
                Related Blog Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {relatedGallery.length > 0 && (
            <section className="mt-20 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-2 h-8 bg-ieee-cs-orange rounded-full mr-3"></span>
                Event Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedGallery.map((item) => (
                  <Link
                    key={item.id}
                    href={`/gallery?event=${id}`}
                    className="group relative rounded-xl overflow-hidden bg-gray-100"
                  >
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </article>
  );
}
