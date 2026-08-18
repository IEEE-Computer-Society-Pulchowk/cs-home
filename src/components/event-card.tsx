import React from "react";
import Link from "next/link";
import { FaCalendar, FaArrowRight } from "react-icons/fa";
import SmartImage from "@/components/smart-image";
import { IeeeEvent } from "@/types";

interface EventCardProps {
  event: IeeeEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      {/* Image area */}
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {event.imageUrl ? (
          <SmartImage
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200">
            <div className="absolute inset-0 bg-ieee-cs-orange/5 group-hover:bg-ieee-cs-orange/10 transition-colors duration-300" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-ieee-dark uppercase tracking-wide">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col grow">
        {event.date && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <FaCalendar size={14} className="mr-1.5" />
            {event.date}
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ieee-cs-orange transition-colors duration-200">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {event.description}
        </p>

        <div className="mt-auto">
          <span className="inline-flex items-center text-sm font-semibold text-ieee-cs-orange hover:text-ieee-dark transition-colors group-hover:translate-x-1 duration-300">
            View Details <FaArrowRight size={16} className="ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
