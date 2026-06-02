import { EVENTS, type EventRecord } from "@/data/events/index";
import type { EventPhase, EventYearDetail } from "@/types";

export interface EventLookupResult
    extends Partial<Pick<
        EventRecord,
        | "slug"
        | "title"
        | "category"
        | "description"
        | "thumbnail"
        | "registrationUrl"
        | "recurrence"
        | "years"
    >> {
    date?: string;
    location?: string;
    displayDate?: string;
    sortDate?: string;
    isUpcoming?: boolean;
}

const parseDateValue = (value: unknown): number | null => {
    if (typeof value !== "string" || !value.trim() || value.trim().toUpperCase() === "TBD") {
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

const getPreferredEventDate = (event: EventRecord): string | undefined => {
    const yearDetailsList = Object.values(event.years) as EventYearDetail[];

    const allPhaseDates = yearDetailsList
        .flatMap((yearDetail) => {
            const dates = (yearDetail.phases ?? []).map(
                (phase: EventPhase) => phase.date
            );
            return dates.filter(
                (date): date is string =>
                    typeof date === "string" && date.trim().length > 0
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

const getDerivedDisplayDate = (event: EventRecord): string | undefined => {
    const preferred = getPreferredEventDate(event);
    if (preferred) {
        return preferred;
    }

    return undefined;
};

const isEventUpcoming = (event: EventRecord): boolean => {
    const yearDetailsList = Object.values(event.years) as EventYearDetail[];

    return yearDetailsList.some((yearDetail) => {
        return (yearDetail.phases ?? []).some((phase: EventPhase) =>
            isDateUpcoming(phase.date)
        );
    });
};

export function getEventSlugs() {
    return EVENTS.map((event) => event.slug);
}

export function getEventBySlug(slug: string, fields: string[] = []): EventLookupResult {
    const realSlug = slug.replace(/\.md$/, "");
    const event = EVENTS.find((item) => item.slug === realSlug);

    if (!event) {
        return { slug: realSlug };
    }

    const preferredDate = getDerivedDisplayDate(event);
    const items: EventLookupResult = {
        slug: event.slug,
        title: event.title,
        category: event.category,
        description: event.description,
        thumbnail: event.thumbnail,
        registrationUrl: event.registrationUrl,
        recurrence: event.recurrence,
        years: event.years,
        isUpcoming: isEventUpcoming(event),
    };

    if (preferredDate) {
        items.displayDate = preferredDate;
        items.sortDate = preferredDate;
        items.date = preferredDate;
    }

    if (fields.length === 0) {
        return items;
    }

    const selected: Record<string, unknown> & EventLookupResult = {
        slug: event.slug,
    };
    fields.forEach((field) => {
        if (field in items) {
            selected[field] = items[field as keyof EventLookupResult] as unknown;
        }
    });

    return selected;
}

export function getAllEvents(fields: string[] = []): EventLookupResult[] {
    return getEventSlugs()
        .map((slug) => getEventBySlug(slug, fields))
        .sort((event1, event2) => {
            const leftTime = parseDateValue(event1.sortDate ?? event1.date) ?? 0;
            const rightTime = parseDateValue(event2.sortDate ?? event2.date) ?? 0;
            return rightTime - leftTime;
        });
}
