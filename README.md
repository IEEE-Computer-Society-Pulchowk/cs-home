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
          startDate: "June 15, 2026",
          endDate: undefined, // Use `undefined` when the phase ends on the same date
          startTime: "3:00 PM",
          endTime: "5:00 PM",
          location: "Seminar Hall, Pulchowk Campus",
          bodyFile: "./body.md", // Optional: keep long markdown outside the TS file
        }
      ]
    }
  }
};
```

If you prefer, you can still keep short phase content inline in `body`, but for longer content `bodyFile` is cleaner and easier to maintain.
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

---

## 🎓 Certificates

Each certificate gets a permanent, verifiable URL (`/cert/<templateId>/<email>`).
`/verify` looks them up by email. Certificate data is static and
git-committed, like every other content type here.

### Issue a batch

1. Fill a CSV with these columns (order matters):

   ```csv
   name,email,event,eventSlug,issueYear,date,templateId
   Sajiya Aryal,sajiya@example.com,Linux 101,linux-101,2026,2026-07-03,linux-101-2026
   ```

   | Column | Notes |
   |---|---|
   | `name` | Exactly as it should appear on the certificate |
   | `email` | Certificate identity key (normalized lowercase), used in URL lookup |
   | `event` | Human-readable name, rendered |
   | `eventSlug` | Must match an existing `src/data/events/<slug>/` |
   | `issueYear` | Rendered/event metadata only |
   | `date` | ISO `YYYY-MM-DD`, rendered |
   | `templateId` | Must match a `src/data/certificates/templates/<id>.json` |

   Certificate identity is `(templateId + normalized email)`. Re-running keeps the
   same URL for the same template/email pair. The same person may appear on multiple
   rows with different `templateId` values (e.g. participation and achievement).

2. Append new certificates to the typed data file:

   ```bash
   bun run scripts/generate-certificates.mjs path/to/list.csv
   # appends to src/data/certificates/index.ts (commit it)
   ```

   Existing template/email pairs are left unchanged; only new pairs are added.

3. Export a mass-mail CSV (input columns + certificate URL):

   ```bash
   bun run scripts/export-for-mass-mail.mjs path/to/list.csv > mass-mail.csv
   ```

   Adds a `certurl` column with `https://ieeecs.pcampus.edu.np/cert?...` links.

### Add a new template

A template is a fixed-`viewBox` SVG: a flattened background image plus per-field
bounding boxes (`x`, `y`, `width`, `height`) measured against that canvas.

1. Export the background art (SVG or PNG) to
   `public/certificates/templates/<year>-<event>-<cert-type>.(svg|png)`.
2. Write `src/data/certificates/templates/<id>.json` (copy `linux-101-2026.json`,
   set `displayName`, set `background` to `/certificates/templates/<file>.(svg|png)`, and adjust field bounding boxes).
3. Register it: add one line to
   `src/data/certificates/templates/index.ts`.

Templates are **locked once issued** — a new design for a future event gets a new
`templateId`, so old certificates never change.
