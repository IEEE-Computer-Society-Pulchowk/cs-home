import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const WebScraping101: EventRecord = {
  slug: "web-scraping-101",
  title: "Web Scraping 101",
  category: EventCategory.WORKSHOP,
  description: "Learn the fundamentals of web scraping with Puppeteer.",
  thumbnail: "/events/web-scraping-101.jpg",
  registrationUrl: "#",
  recurrence: "annual",
  years: {
    "2025": {
      title: "Web Scraping 101",
      slogan: "Master the basics of web scraping.",
      phases: [
        {
          phase: 1,
          title: "Introduction to Web Scraping",
          startDate: "Feb 04, 2025",
          endDate: "Feb 05, 2025",
          startTime: "3:30 PM",
          endTime: "5:00 PM",
          location: "DOECE 302, Pulchowk Campus",
          duration: undefined,
          bodyFile: "./2025p1.md",
          registrationUrl: "#",
        },
      ],
    },
  },
};
