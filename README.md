# IEEE Computer Society Pulchowk SBC Website

Official website of the IEEE Computer Society Student Branch Chapter Pulchowk at IOE Pulchowk Campus.

---

## 🚀 How to Run the Project

This project is built using **Next.js** (App Router) and **Tailwind CSS**, optimized to run with **Bun** or **npm**.

### 1. Install Dependencies
```bash
bun install
# or
npm install
```

### 2. Run the Development Server
```bash
bun dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the local deployment.

### 3. Build for Production
```bash
bun run build
# or
npm run build
```

---

## ✍️ How to Manage Content

All user-facing content (people, teams, blogs, events, gallery items) is statically structured or written in markdown. Below is a guide on how to add and edit content.

### 1. Adding/Editing a Person (Member Profiles)
Individual profile records are stored centrally and shared between blogs, team committees, and lookup paths.

* **File to edit:** [src/data/people.ts](file:///home/asp/Projects/cs-home/src/data/people.ts)
* **Image Assets:** Drop portrait photos in `public/people/` (named `<person-slug>.png` or `<person-slug>.jpg`, lowercase slug).

To add a person, append an entry to the `PEOPLE` object:
```typescript
"PUL081BCT013": person("PUL081BCT013", "Abishek Parajuli", 101478591, {
  imageUrl: "/people/abishek-parajuli.png", // Optional: Custom image path. If omitted, falls back to /people/<slug>.png
  linkedin: "https://www.linkedin.com/in/abishek-parajuli-866b89370", // Optional
  github: "https://github.com/abishekparajuli-np",                     // Optional
  instagram: "https://www.instagram.com/abishekparajuli_17",           // Optional
}),
```
* **Parameters for `person` helper:** `person(id, name, membershipId, socialDetails)`
  * Use the person's unique identifier (e.g., Roll number or hyphenated name `Aarbid-Bhattarai`) as the key and first parameter.
  * If the person doesn't have an IEEE membership ID, pass `0`.

---

### 2. Adding a Committee / Team Assignment
Members are assigned to specific roles and committees for a particular tenure year.

* **File to edit:** [src/data/team.ts](file:///home/asp/Projects/cs-home/src/data/team.ts)

To assign a registered person (from `people.ts`) to a committee in a given year, add a `member` call inside `TEAM_YEARS`:
```typescript
{
  year: "2026",
  sort: 2026,
  committees: [
    committee("officers", "Officers", 10, [
      member("PUL080BCT049", "Chair", 10),
      member("PUL080BCT003", "Web Master", 50),
    ]),
    committee("activity", "Activity Committee", 20, [
      member("PUL081BCT013", "Executive Member", 20),
    ]),
  ]
}
```
* **Parameters for `member` helper:** `member(personId, roleTitle, sortOrder)`
  * `sortOrder` controls the display order of the member card inside their committee. Lower numbers display first.

---

### 3. Adding a Blog Post
Blog posts are written as standard Markdown files.

* **Folder to add files:** [src/content/blogs/](file:///home/asp/Projects/cs-home/src/content/blogs)
* **Image Assets:** Drop thumbnails in `public/blogs/`.

Create a new file named `your-slug-here.md` with YAML frontmatter:
```markdown
---
title: "Launch of the IEEE Computer Society Website"
excerpt: "A brief summary of what the article talks about, shown on cards."
date: "May 20, 2026"
author: "PUL080BCT003"              # Resolves to the person's ID in people.ts
category: "Technology"
readTime: "5 min read"
thumbnail: "/blogs/website-launch.jpg"
---

Your markdown article content goes here.

You can mention team members inside the text using `@{personId}` (e.g., `@{PUL080BCT003}`) which automatically renders their name as a link to their profile!
```

---

### 4. Adding/Editing an Event
Events can be single occurrences or span multiple years/phases.

* **Directory:** [src/data/events/](file:///home/asp/Projects/cs-home/src/data/events)
* **Image Assets:** Drop thumbnails and banner graphics in `public/events/`.

To add a new event:
1. Create a folder named after your event slug (e.g., `src/data/events/my-new-event`).
2. Create an `index.ts` file inside it:
```typescript
import type { EventRecord } from "../types";

export const MyNewEvent: EventRecord = {
  slug: "my-new-event",
  title: "Artificial Intelligence Workshop",
  category: "Workshop", // Workshop, Seminar, Competition, Social
  description: "A short preview text for the event list cards.",
  thumbnail: "/events/ai-workshop.jpg",
  registrationUrl: "https://example.com/register", // Optional
  recurrence: "one-time", // one-time, annual
  years: {
    "2026": {
      title: "AI Workshop 2026",
      slogan: "Getting started with deep learning.",
      phases: [
        {
          phase: 1,
          title: "Introduction to Neural Networks",
          date: "June 15, 2026",
          location: "Seminar Hall, Pulchowk Campus",
          body: "Learn the fundamentals of deep neural nets.",
        }
      ]
    }
  }
};
```
3. Register the event in [src/data/events/index.ts](file:///home/asp/Projects/cs-home/src/data/events/index.ts):
```typescript
import { IEEEXtreme } from "./ieeextreme";
import { Stemfluence } from "./stemfluence";
import { MyNewEvent } from "./my-new-event"; // Import here

export const EVENTS = [IEEEXtreme, Stemfluence, MyNewEvent]; // Add to array
```

---

### 5. Adding a Gallery Item
The gallery showcases photos of past meetups, events, and workshops.

* **File to edit:** [src/data/gallery.ts](file:///home/asp/Projects/cs-home/src/data/gallery.ts)
* **Image Assets:** Drop gallery images in `public/gallery/` (or reference images elsewhere under `public/`, e.g. event thumbnails).

To add a photo, append an entry to the `GALLERY_ITEMS` array in `gallery.ts`:
```typescript
import { GalleryItem, GalleryCategory } from "@/types";

export const GALLERY_ITEMS: GalleryItem[] = [
  // ...existing items
  {
    id: "g8",
    title: "AI Workshop Group Photo",
    date: "2026",
    category: GalleryCategory.WORKSHOP,
    imageUrl: "/gallery/ai-workshop-group.jpg",
  },
];
```
* **Categories:** Use the `GalleryCategory` enum from [src/types.ts](file:///home/asp/Projects/cs-home/src/types.ts) — `MEETUP`, `EVENT`, `WORKSHOP`, `COMPETITION`, `TALK` (display labels: Meetup, Event, Workshop, Competition, Talk). Do not use raw strings; this keeps filters and types in sync.
