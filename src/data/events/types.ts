import type { EventCategory } from "@/types";

export interface EventPhase {
  phase?: string | number;
  title: string;
  date?: string;
  location?: string;
  duration?: string;
  body: string;
  registrationUrl?: string;
  isUpcoming?: boolean;
  sort?: number;
}

export interface EventYearDetail {
  title: string;
  slogan?: string;
  isUpcoming?: boolean;
  registrationUrl?: string;
  sort?: number;
  phases?: EventPhase[];
}

export interface EventRecord {
  slug: string;
  title: string;
  category: EventCategory | string;
  description: string;
  thumbnail?: string;
  registrationUrl?: string;
  recurrence?: string;
  isUpcoming?: boolean;
  years: Record<string, EventYearDetail>;
}
