import "server-only";
import fs from "fs";
import path from "path";
import { EVENTS, eventThumbnail, type EventRecord } from "@/data/events/index";
import type { EventPhase, EventYearDetail } from "@/types";

const eventsDirectory = path.join(process.cwd(), "src/data/events");

export interface EventLookupResult extends Partial<
  Pick<
    EventRecord,
    | "slug"
    | "title"
    | "category"
    | "description"
    | "thumbnail"
    | "registrationUrl"
    | "recurrence"
    | "years"
  >
> {
  date?: string;
  location?: string;
  displayDate?: string;
  sortDate?: string;
  isUpcoming?: boolean;
}

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

const getPhaseStartDate = (phase: EventPhase): string | undefined =>
  phase.startDate ?? phase.date;

const readEventFile = (
  eventSlug: string,
  file: string,
  field: string,
): string => {
  const fullPath = path.join(
    eventsDirectory,
    eventSlug,
    file.replace(/^\.\//, ""),
  );

  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `Missing event ${field} file: ${fullPath} (event: ${eventSlug})`,
    );
  }

  return fs.readFileSync(fullPath, "utf8");
};

const readEventPhaseBody = (eventSlug: string, phase: EventPhase): string => {
  if (phase.bodyFile) {
    return readEventFile(eventSlug, phase.bodyFile, "phase body");
  }

  return phase.body ?? "";
};

const resolveEventYears = (
  event: EventRecord,
): Record<string, EventYearDetail> => {
  return Object.entries(event.years).reduce<Record<string, EventYearDetail>>(
    (accumulator, [year, detail]) => {
      accumulator[year] = {
        ...detail,
        description: detail.descriptionFile
          ? readEventFile(
              event.slug,
              detail.descriptionFile,
              "year description",
            )
          : detail.description,
        phases: (detail.phases ?? []).map((phase) => ({
          ...phase,
          body: readEventPhaseBody(event.slug, phase),
        })),
      };

      return accumulator;
    },
    {},
  );
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

const getPreferredEventDate = (event: EventRecord): string | undefined => {
  const yearDetailsList = Object.values(event.years) as EventYearDetail[];

  const allPhaseDates = yearDetailsList
    .flatMap((yearDetail) => {
      const dates = (yearDetail.phases ?? []).map((phase: EventPhase) =>
        getPhaseStartDate(phase),
      );
      return dates.filter(
        (date): date is string =>
          typeof date === "string" && date.trim().length > 0,
      );
    })
    .filter((date) => parseDateValue(date) !== null);

  const upcomingDates = allPhaseDates.filter((date) => isDateUpcoming(date));
  const pastDates = allPhaseDates.filter((date) => !isDateUpcoming(date));

  if (upcomingDates.length > 0) {
    return upcomingDates.sort((left, right) => {
      const leftTime = parseDateValue(left) ?? 0;
      const rightTime = parseDateValue(right) ?? 0;
      return leftTime - rightTime;
    })[0];
  }

  if (pastDates.length === 0) {
    return undefined;
  }

  return pastDates.sort((left, right) => {
    const leftTime = parseDateValue(left) ?? 0;
    const rightTime = parseDateValue(right) ?? 0;
    return rightTime - leftTime;
  })[0];
};

const isEventUpcoming = (event: EventRecord): boolean => {
  const yearDetailsList = Object.values(event.years) as EventYearDetail[];

  return yearDetailsList.some((yearDetail) => {
    return (yearDetail.phases ?? []).some((phase: EventPhase) =>
      isDateUpcoming(getPhaseStartDate(phase)),
    );
  });
};

export function getEventBySlug(slug: string): EventLookupResult {
  const realSlug = slug.replace(/\.md$/, "");
  const event = EVENTS.find((item) => item.slug === realSlug);

  if (!event) {
    return { slug: realSlug };
  }

  const preferredDate = getPreferredEventDate(event);
  const items: EventLookupResult = {
    slug: event.slug,
    title: event.title,
    category: event.category,
    description: event.descriptionFile
      ? readEventFile(event.slug, event.descriptionFile, "description")
      : event.description,
    thumbnail: eventThumbnail(event),
    registrationUrl: event.registrationUrl,
    recurrence: event.recurrence,
    years: resolveEventYears(event),
    isUpcoming: isEventUpcoming(event),
  };

  if (preferredDate) {
    items.displayDate = preferredDate;
    items.sortDate = preferredDate;
    items.date = preferredDate;
  }

  return items;
}

export function getAllEvents(): EventLookupResult[] {
  return EVENTS.map((event) => getEventBySlug(event.slug)).sort((a, b) => {
    const leftTime = parseDateValue(a.sortDate ?? a.date) ?? 0;
    const rightTime = parseDateValue(b.sortDate ?? b.date) ?? 0;
    return rightTime - leftTime;
  });
}
