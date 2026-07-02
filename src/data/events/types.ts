import type { EventCategory, EventYearDetail } from "@/types";

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
