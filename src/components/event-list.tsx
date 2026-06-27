"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IeeeEvent, EventCategory } from "@/types";
import EventCard from "@/components/event-card";
import PageHeader from "@/components/page-header";
import FilterButton from "@/components/filter-button";
import EmptyState from "@/components/empty-state";
import { FaFilter } from "react-icons/fa";

interface EventListProps {
    events: IeeeEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
    const [filter, setFilter] = useState<EventCategory | "All">("All");
    const [view, setView] = useState<"all" | "upcoming" | "past">(
        "upcoming"
    );

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

    const categories = ["All", ...Object.values(EventCategory)];

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
                        <button
                            onClick={() => setView("all")}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                view === "all"
                                    ? "bg-ieee-cs-orange text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setView("upcoming")}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                view === "upcoming"
                                    ? "bg-ieee-cs-orange text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setView("past")}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                view === "past"
                                    ? "bg-ieee-cs-orange text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Past Events
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
                        <FaFilter
                            size={18}
                            className="text-gray-400 mr-2 flex-shrink-0"
                        />
                        {categories.map((cat) => (
                            <FilterButton
                                key={cat}
                                active={filter === cat}
                                onClick={() => setFilter(cat as EventCategory | "All")}
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
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <EventCard event={event} />
                            </motion.div>
                        ))
                    ) : (
                        <EmptyState
                            className="col-span-full"
                            message="No events found in this category."
                            actionLabel="Clear filters"
                            onAction={() => setFilter("All")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventList;
