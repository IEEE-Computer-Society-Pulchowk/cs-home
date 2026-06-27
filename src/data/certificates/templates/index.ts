import type { Template } from "../types";
import linux1012026 from "./linux-101-2026.json";

// Registry of certificate templates. Add one line per new template — importing
// the JSON here gets it bundled (no runtime fs, works on serverless + client).
// ponytail: explicit registry over fs-glob; one line per template is cheaper
// than debugging Next's file tracing for a runtime-constructed path.
const TEMPLATES: Record<string, Template> = {
  "linux-101-2026": linux1012026 as Template,
};

export const getTemplate = (templateId: string): Template | undefined =>
  TEMPLATES[templateId];
