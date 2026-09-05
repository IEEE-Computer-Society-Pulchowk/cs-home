import { IEEEXtreme } from "./ieeextreme";
import { Stemfluence } from "./stemfluence";
import { WebScraping101 } from "./web-scraping-101";
import { Linux101 } from "./linux-101";
import { ConceptCatalyst } from "./concept-catalyst";
import { IEEECubingNepal2025 } from "./ieee-cubing-nepal-2025";
import { ScholarsInTheMaking } from "./scholars-in-the-making";
import { GraphicsDesignWorkshop } from "./graphics-design-workshop";
import { HackAFlag } from "./hack-a-flag";
import { ProfDrMagneJorgensenSession } from "./prof-dr-magne-jorgensen-session";
import { MiniConferenceAndResearchersMeetup } from "./mini-conference-and-researchers-meetup";
import type { EventRecord } from "./types";

export const EVENTS = [IEEEXtreme, Stemfluence, WebScraping101, Linux101, ConceptCatalyst, IEEECubingNepal2025, ScholarsInTheMaking, GraphicsDesignWorkshop, HackAFlag, ProfDrMagneJorgensenSession, MiniConferenceAndResearchersMeetup];

export type { EventRecord } from "./types";

// Thumbnails live at events/<slug>/<slug>-<year>.webp, defaulting to the latest
// year the event ran. An explicit `thumbnail` in the event data overrides it.
export function eventThumbnail(event: EventRecord): string | undefined {
  if (event.thumbnail) return event.thumbnail;
  const latestYear = Object.keys(event.years).sort().at(-1);
  if (!latestYear) return undefined;
  return `/events/${event.slug}/${event.slug}-${latestYear}.webp`;
}
