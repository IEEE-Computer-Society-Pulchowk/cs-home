import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const IEEECubingNepal2025: EventRecord = {
  slug: "ieee-cubing-nepal-2025",
  title: "IEEE Cubing Nepal 2025",
  category: EventCategory.COMPETITION,
  description:
    "IEEE Cubing Nepal 2025, organized by IEEE Computer Society Pulchowk SBC, is a speedcubing competition featuring cubers and official cubing partners.",
  registrationUrl: "https://bit.ly/IEEECubing2025",
  recurrence: "annual",
  years: {
    "2025": {
      title: "IEEE Cubing Nepal 2025",
      slogan: "An exciting speedcubing experience powered by top cubing brands.",

      phases: [
        {
          phase: 1,
          title: "Official Cubing Partner Announcement",
          startDate: "June 06, 2025",
          endDate: undefined,
          startTime: undefined,
          endTime: undefined,
          location: "Pulchowk Campus",
          body: "",
          bodyFile: "./body.md",
          registrationUrl: "https://bit.ly/IEEECubing2025",
        },
      ],
    },
  },
};