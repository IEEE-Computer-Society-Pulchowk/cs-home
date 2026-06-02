import type { EventRecord } from "../types";

export const IEEEXtreme: EventRecord = {
  slug: "ieeextreme",
  title: "IEEEXtreme",
  category: "Competition",
  description:
    "24 hours of code, caffeine, and chaos. IEEEXtreme 19.0 was an unforgettable marathon of problem-solving and collective breakthroughs.",
  thumbnail: "/events/ieeextreme-19.0.jpg",
  registrationUrl: "#",
  recurrence: "annual",
  years: {
    "2025": {
      title: "IEEEXtreme 19.0",
      slogan: "The 24-hour contest that brought everyone together.",
      phases: [
        {
          phase: 1,
          title: "Registration",
          date: "Sep 25, 2025",
          location: "Pulchowk Campus",
          duration: "Open until midnight",
          body:
            "Team registration opens. Form your squads and submit your entries.",
          registrationUrl: "#",
        },
        {
          phase: 2,
          title: "Main Contest",
          date: "Oct 25, 2025",
          body: "24 hours of continuous problem solving and collaboration.",
        },
      ],
    },
    "2026": {
      title: "IEEEXtreme 20.0 Preview",
      slogan: "Prep sessions and mentoring are already in motion.",
    },
  },
};
