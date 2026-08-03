import { EVENTS } from "@/data/events";

export const ALL = "all";
export const NO_EVENT = "none";

export interface FilterOption {
  value: string;
  label: string;
}

const eventTitle = new Map(EVENTS.map((e) => [e.slug, e.title]));

export const eventFilterOptions = (
  assigned: (string | undefined)[],
): FilterOption[] => {
  const present = new Set(assigned.filter((s): s is string => !!s));
  const hasNoEvent = assigned.some((s) => !s);
  const events = EVENTS.filter((e) => present.has(e.slug));
  const extras = [...present].filter((s) => !eventTitle.has(s)).sort();

  const options: FilterOption[] = [{ value: ALL, label: "All Events" }];
  options.push(
    ...events.map((e) => ({ value: e.slug, label: e.title })),
    ...extras.map((s) => ({ value: s, label: s })),
  );
  if (hasNoEvent) options.push({ value: NO_EVENT, label: "No Event" });
  return options;
};

export const yearFromDate = (date?: string): string | undefined => {
  if (!date) return undefined;
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? undefined : String(year);
};

export const yearFilterOptions = (years: string[]): FilterOption[] => [
  { value: ALL, label: "All Years" },
  ...Array.from(new Set(years))
    .filter((y) => y !== undefined && y !== "")
    .sort((a, b) => Number(b) - Number(a))
    .map((y) => ({ value: y, label: y })),
];
