import { EVENTS } from "@/data/events";

export const ALL = "all";
export const NO_EVENT = "none";

export interface FilterOption {
  value: string;
  label: string;
}

export const eventFilterOptions = (): FilterOption[] => [
  { value: ALL, label: "All Events" },
  { value: NO_EVENT, label: "No Event" },
  ...EVENTS.map((e) => ({ value: e.slug, label: e.title })),
];

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
