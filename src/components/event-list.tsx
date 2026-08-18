"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IeeeEvent, EventCategory } from "@/types";
import EventCard from "@/components/event-card";
import PageHeader from "@/components/page-header";
import FilterButton from "@/components/filter-button";
import EmptyState from "@/components/empty-state";
import { FaFilter } from "react-icons/fa";

interface EventListProps {
  events: IeeeEvent[];
}

const VIEWS = ["all", "upcoming", "past"] as const;
type View = (typeof VIEWS)[number];

const EventListContent: React.FC<EventListProps> = ({ events }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categories = ["All", ...Object.values(EventCategory)];

  // derived directly from the URL — the URL is the source of truth.
  const view: View = VIEWS.includes(searchParams.get("view") as View)
    ? (searchParams.get("view") as View)
    : "upcoming";
  const filter: EventCategory | "All" = categories.includes(
    searchParams.get("cat") ?? "",
  )
    ? (searchParams.get("cat") as EventCategory | "All")
    : "All";

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(
      params.size ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );
  };

  const handleView = (next: View) => {
    updateParam("view", next, "upcoming");
  };

  const handleCategory = (next: EventCategory | "All") => {
    updateParam("cat", next, "All");
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory = filter === "All" || event.category === filter;
    const matchesView =
      view === "all"
        ? true
        : view === "upcoming"
          ? event.isUpcoming
          : !event.isUpcoming;
    return matchesCategory && matchesView;
  });

  const sortedEvents = [...filteredEvents].sort((left, right) => {
    const leftTime = Date.parse(left.sortDate ?? left.displayDate ?? left.date ?? "");
    const rightTime = Date.parse(right.sortDate ?? right.displayDate ?? right.date ?? "");

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return 0;
    }

    return view === "upcoming" ? leftTime - rightTime : rightTime - leftTime;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Events & Activities"
          subtitle="Discover workshops, seminars, and networking sessions designed to boost your technical skills and professional growth."
        />

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          {/* View Toggle */}
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => handleView(v)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${view === v
                    ? "bg-ieee-cs-orange text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {v === "all" ? "All" : v === "upcoming" ? "Upcoming" : "Past Events"}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
            <FaFilter
              size={18}
              className="text-gray-400 mr-2 shrink-0"
            />
            {categories.map((cat) => (
              <FilterButton
                key={cat}
                active={filter === cat}
                onClick={() => handleCategory(cat as EventCategory | "All")}
              >
                {cat}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <EmptyState
              className="col-span-full"
              message="No events found in this category."
              actionLabel="Clear filters"
              onAction={() => handleCategory("All")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const EventList: React.FC<EventListProps> = ({ events }) => (
  <Suspense fallback={null}>
    <EventListContent events={events} />
  </Suspense>
);

export default EventList;
