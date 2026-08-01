import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const IEEEXtreme: EventRecord = {
  slug: "ieeextreme",
  title: "IEEEXtreme",
  category: EventCategory.COMPETITION,
  description:
    "24 hours of code, caffeine, and chaos. IEEEXtreme 19.0 was an unforgettable marathon of problem-solving and collective breakthroughs.",
  registrationUrl: "#",
  recurrence: "annual",
  years: {
    "2025": {
      title: "IEEEXtreme 19.0",
      slogan: "The 24-hour contest that brought everyone together.",
      phases: [
        {
          phase: 1,
          title: "preXtreme",
          startDate: "Sep 25, 2025",
          endDate: "#",
          startTime: "",
          endTime: "",
          location: "Pulchowk Campus",
          duration: "Open until midnight",
          body: "Team registration opens. Form your squads and submit your entries.",
          registrationUrl: "#",
        },
        {
          phase: 2,
          title: "24-hour Coding Marathon",
          startDate: "Oct 25, 2025",
          endDate: "#",
          startTime: "5:45 AM",
          endTime: "5:45 AM (next day)",
          body: "24 hours of continuous problem solving and collaboration.",
        },
      ],
    },
    "2026": {
      title: "IEEEXtreme 20.0 Preview",
      slogan: "Prep sessions and mentoring are already in motion.",
      phases: [
        {
          phase: 1,
          title: "preXtreme",
          startDate: "TBD",
          endDate: "#",
          startTime: "TBD",
          endTime: "TBD",
          location: "Pulchowk Campus",
          duration: "Open until midnight",
          body: "Team registration opens. Form your squads and submit your entries.",
          registrationUrl: "#",
        },
        {
          phase: 2,
          title: "24-hour Coding Marathon",
          startDate: "TBD",
          endDate: "#",
          startTime: "5:45 AM",
          endTime: "5:45 AM (next day)",
          body: "24 hours of continuous problem solving and collaboration.",
        },
      ],
    },
  },
};
