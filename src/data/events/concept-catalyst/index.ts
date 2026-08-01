import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const ConceptCatalyst: EventRecord = {
  slug: "concept-catalyst",
  title: "Concept Catalyst",
  category: EventCategory.COMPETITION,
  description:
    "An ideathon event organized by IEEE Computer Society Pulchowk SBC to foster creativity and innovation among ambassadors during the chapter inauguration ceremony.",
  thumbnail: "/events/2025/concept-catalyst.jpg",
  registrationUrl: "#",
  recurrence: "one-time",
  years: {
    "2025": {
      title: "Concept Catalyst",
      slogan: "A spark for creativity, innovation, and collaboration.",
      phases: [
        {
          phase: 1,
          title: "Inauguration Ceremony & Ideathon",
          startDate: "Jan 11, 2025",
          endDate: "#",
          startTime: "1:30 PM",
          endTime: "3:00 PM",
          location: "Pulchowk Campus Library Hall",
          duration: "1 hour 30 minutes",
          body:
            "The official inauguration ceremony of the IEEE Computer Society Pulchowk Student Branch Chapter featuring Concept Catalyst, an ideathon designed to foster creativity and innovation within ambassadors.",
        },
      ],
    },
  },
};