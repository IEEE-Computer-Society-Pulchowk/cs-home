import type { EventCategory } from "@/types";

export interface EventPhase {
  phase?: string | number;
  title: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  duration?: string;
  body?: string;
  bodyFile?: string;
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
  category: EventCategory;
  description: string;
  thumbnail?: string;
  registrationUrl?: string;
  recurrence?: string;
  isUpcoming?: boolean;
  years: Record<string, EventYearDetail>;
}
