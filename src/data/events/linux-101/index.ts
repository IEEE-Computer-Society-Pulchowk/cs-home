import { EventCategory } from "@/types";
import type { EventRecord } from "../types";

export const Linux101: EventRecord = {
  slug: "linux-101",
  title: "Linux 101",
  category: EventCategory.WORKSHOP,
  description: `
  A hands-on Linux workshop that takes you from "never touched a terminal" to confidently navigating, managing, and administering a Linux system. Through daily sessions, you'll build practical skills in terminal usage, file management, permissions, networking, process handling, and basic system administration — everything you need to stop fearing the command line and start using it.
  `,
  thumbnail: "/events/2026/linux-101/linux-101.jpg",
  registrationUrl: "https://forms.gle/4WAWPffeE7Uf7URL8",
  recurrence: "annual",
  years: {
    "2026": {
      title: "Linux 101",
      slogan: "Windows Close, Terminal Open",
      phases: [
        {
          phase: 1,
          title: "5-days Workshop",
          startDate: "June 29, 2026",
          endDate: "July 3, 2026",
          startTime: "7:00 AM",
          endTime: "8:30 AM",
          location: "DoECE Pulchowk Campus",
          registrationUrl: "https://forms.gle/4WAWPffeE7Uf7URL8",
          duration: "5 days",
          body: "",
          bodyFile: "./2026/body.md",
        },
      ],
    },
  },
};
