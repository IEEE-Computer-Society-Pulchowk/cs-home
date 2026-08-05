import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const ScholarsInTheMaking: EventRecord = {
  slug: "scholars-in-the-making",
  title: "Scholars in the Making",
  category: EventCategory.COMPETITION,
  description: `
  Ever imagined your name in an international IEEE journal? This is your chance to make that dream real.

  Join “Scholars in the Making” – a year-long journey by IEEE Computer Society, Pulchowk Student Branch Chapter – where your ideas transform into a published research paper in a globally recognized IEEE journal.
  `,
  registrationUrl: "https://forms.gle/Efois1nzDfEPQWfZ9",
  recurrence: "annual",
  years: {
    "2025": {
      title: "Scholars in the Making",
      slogan: "Your research journey begins here.",
      phases: [
        {
          phase: 1,
          title: "Research Paper Discussions",
          startDate: "July 28, 2025",
          endDate: "July 28, 2025",
          startTime: undefined,
          endTime: undefined,
          location: undefined,
          registrationUrl: "https://forms.gle/Efois1nzDfEPQWfZ9",
          duration: undefined,
          body: "",
          bodyFile: "./2025/body.md",
        },
      ],
    },
  },
};