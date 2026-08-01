import { EVENTS, eventThumbnail, type EventRecord } from "@/data/events/index";
import type { EventPhase } from "@/types";

// ponytail: metadata-only lookup, no fs — safe to import from client
// components. Full detail (resolved phase bodies, dates) lives in
// events.server.ts; import that instead from server components/routes.
export interface EventMeta
  extends Pick<
    EventRecord,
    | "slug"
    | "title"
    | "category"
    | "description"
    | "thumbnail"
    | "registrationUrl"
    | "recurrence"
  > {
  isUpcoming: boolean;
}

const getPhaseStartDate = (phase: EventPhase): string | undefined =>
  phase.startDate ?? phase.date;

const parseDateValue = (value: unknown): number | null => {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().toUpperCase() === "TBD"
  ) {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? null : timestamp;
};

const todayStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
};

const isDateUpcoming = (value?: string): boolean => {
  if (!value) {
    return false;
  }

  if (value.trim().toUpperCase() === "TBD") {
    return true;
  }

  const timestamp = parseDateValue(value);
  return timestamp !== null ? timestamp >= todayStart() : false;
};

const isEventUpcoming = (event: EventRecord): boolean =>
  Object.values(event.years).some((yearDetail) =>
    (yearDetail.phases ?? []).some((phase: EventPhase) =>
      isDateUpcoming(getPhaseStartDate(phase)),
    ),
  );

export function getEventMetaBySlug(slug: string): EventMeta | undefined {
  const realSlug = slug.replace(/\.md$/, "");
  const event = EVENTS.find((item) => item.slug === realSlug);

  if (!event) {
    return undefined;
  }

  const {
    slug: eventSlug,
    title,
    category,
    description,
    registrationUrl,
    recurrence,
  } = event;

  return {
    slug: eventSlug,
    title,
    category,
    description,
    thumbnail: eventThumbnail(event),
    registrationUrl,
    recurrence,
    isUpcoming: isEventUpcoming(event),
  };
}
