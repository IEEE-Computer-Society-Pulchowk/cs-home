import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const HackAFlag: EventRecord = {
  slug: "hack-a-flag",
  title: "Hack A Flag",
  category: EventCategory.COMPETITION,
  description: `
  Hack a Flag — An All-Nepal CTF Contest.

  Presented by IEEE Computer Society Pulchowk x Logpoint.

  It's time to put your hacking hats on and dive into Nepal's boldest Capture The Flag challenge yet! Crack codes, hunt vulnerabilities, and compete to win.
  `,
  registrationUrl: "https://bit.ly/HackAFlag",
  recurrence: "annual",
  years: {
    "2025": {
      title: "Hack A Flag",
      slogan: "Crack. Capture. Conquer.",
      phases: [
        {
          phase: 1,
          title: "All-Nepal CTF Contest",
          startDate: "July 11, 2025",
          endDate: "July 11, 2025",
          startTime: "9:30 AM",
          endTime: "4:00 PM",
          location: "",
          registrationUrl: "https://bit.ly/HackAFlag",
          duration: "1 day",
          body: "",
          bodyFile: "./2025/body.md",
        },
      ],
    },
  },
};