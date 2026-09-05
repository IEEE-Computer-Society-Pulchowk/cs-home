import type { Template } from "../types";
import { validateTemplate } from "../validate";

import demo from "./demo.json";
import y2026linux101achievement from "./2026-linux101-achievement.json";
import y2026linux101mentor from "./2026-linux101-mentor.json";
import y2026linux101participation from "./2026-linux101-participation.json";
import y2026miniconfReviewers from "./2026-mini-conference-and-researchers-meetup-reviewers.json";

const TEMPLATES: Record<string, Template> = {
  demo: demo as Template,
  "2026-linux101-achievement": y2026linux101achievement as Template,
  "2026-linux101-mentor": y2026linux101mentor as Template,
  "2026-linux101-participation": y2026linux101participation as Template,
  "2026-mini-conference-and-researchers-meetup-reviewers": y2026miniconfReviewers as Template,
};

for (const [templateId, template] of Object.entries(TEMPLATES)) {
  const errors = validateTemplate(template, templateId);
  if (errors.length) throw new Error(errors.join("\n"));
}

export const getTemplate = (templateId: string): Template | undefined =>
  TEMPLATES[templateId];
