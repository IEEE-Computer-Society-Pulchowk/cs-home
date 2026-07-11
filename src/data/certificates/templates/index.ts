import type { Template } from "../types";
import demo from "./demo.json";
import linux1012026 from "./linux-101-2026.json";
import { validateTemplate } from "../validate";

const TEMPLATES: Record<string, Template> = {
  demo: demo as Template,
  "linux-101-2026": linux1012026 as Template,
};

for (const [templateId, template] of Object.entries(TEMPLATES)) {
  const errors = validateTemplate(template, templateId);
  if (errors.length) throw new Error(errors.join("\n"));
}

export const getTemplate = (templateId: string): Template | undefined =>
  TEMPLATES[templateId];
