import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const GraphicsDesignWorkshop: EventRecord = {
  slug: "graphics-design-workshop",
  title: "Graphics Design Workshop",
  category: EventCategory.WORKSHOP,
  description: `
  Stop using default templates and start creating your own masterpieces! Join the IEEE CS Pulchowk SBC Graphics Design Workshop.

  Three days of learning, thinking, and designing with people who build real products.
  `,
  registrationUrl: "https://bit.ly/csgraphicsworkshop",
  recurrence: "annual",
  years: {
    "2026": {
      title: "Graphics Design Workshop",
      slogan: "Where Ideas Turn Real",
      phases: [
        {
          phase: 1,
          title: "3-days Workshop",
          startDate: "January 12, 2026",
          endDate: "January 14, 2026",
          startTime: "3:45 PM",
          endTime: "5:00 PM",
          location: "Room 302, DoECE, Pulchowk Campus",
          registrationUrl: "https://bit.ly/csgraphicsworkshop",
          duration: "3 days",
          body: "",
          bodyFile: "./2026/body.md",
        },
      ],
    },
  },
};