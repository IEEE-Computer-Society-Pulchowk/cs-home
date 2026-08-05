import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const ProfDrMagneJorgensenSession: EventRecord = {
  slug: "prof-dr-magne-jorgensen-session",
  title: "Prof. Dr. Magne Jørgensen’s Session",
  category: EventCategory.SEMINAR,
  description: `
  Ready to learn what makes a great developer?

  Join us for an insightful session with Prof. Dr. Magne Jørgensen as he shares research-backed insights on software development.

  This session will explore what research says about successful software development and how developers can create real impact.
  `,
  registrationUrl: "",
  recurrence: "annual",
  years: {
    "2025": {
      title: "Prof. Dr. Magne Jørgensen’s Session",
      slogan: "What Research Says About Great Software Developers",
      phases: [
        {
          phase: 1,
          title: "Session",
          startDate: "December 18, 2025",
          endDate: "December 18, 2025",
          startTime: "10:00 AM",
          endTime: "",
          location: "Pulchowk Library Hall",
          registrationUrl: "",
          duration: "",
          body: "",
          bodyFile: "./2025/body.md",
        },
      ],
    },
  },
};