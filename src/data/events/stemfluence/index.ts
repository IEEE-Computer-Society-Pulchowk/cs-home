import type { EventRecord } from "../types";

export const Stemfluence: EventRecord = {
  slug: "stemfluence",
  title: "Stemfluence",
  category: "Workshop",
  description:
    "An interactive outreach workshop introducing young students to the basics of electronics and engineering through hands-on learning.",
  thumbnail: "/events/stemfluence-2.0.jpeg",
  registrationUrl: "#",
  years: {
    "2026": {
      title: "Stemfluence 2.0",
      slogan: "Hands-on electronics for young learners.",
      phases: [
        {
          phase: 1,
          title: "Phase 1 - Outreach and Introduction",
          date: "Jan 10, 2026",
          location: "Shivapuri Secondary School, Kathmandu",
          duration: "Half day",
          body:
            "Teacher coordination, school outreach, and introductory material preparation for the workshop series.",
        },
        {
          phase: 2,
          title: "Phase 2 - Hands-on Workshop",
          date: "Jan 20, 2026",
          location: "Shivapuri Secondary School, Kathmandu",
          duration: "Full day",
          body:
            "The main on-site workshop featuring Transistor 101, circuit simulation, and prototype building.",
        },
        {
          phase: 3,
          title: "Phase 3 - Showcase and Reflection",
          date: "Jan 31, 2026",
          location: "Shivapuri Secondary School, Kathmandu",
          duration: "Closing session",
          body:
            "Student presentations, feedback, recognition, and the closing reflection session.",
        },
      ],
    },
  },
};
