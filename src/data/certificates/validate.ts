import type { RenderableCertField, Template, TextField } from "./types";
import { OVERFLOW_MODES, RENDERABLE_CERT_FIELDS, TEXT_ANCHORS } from "./types";

const TEMPLATE_BG_PATTERN = /^\/certificates\/templates\/[a-z0-9-]+\.(svg|png)$/;

function isRenderableField(key: string): key is RenderableCertField {
  return (RENDERABLE_CERT_FIELDS as readonly string[]).includes(key);
}

export function validateTextField(field: TextField, path: string): string[] {
  const errors: string[] = [];
  if (field.width <= 0) errors.push(`${path}: width must be > 0`);
  if (field.height <= 0) errors.push(`${path}: height must be > 0`);
  if (field.fontSize <= 0) errors.push(`${path}: fontSize must be > 0`);
  if (!(TEXT_ANCHORS as readonly string[]).includes(field.textAnchor)) {
    errors.push(`${path}: textAnchor must be one of ${TEXT_ANCHORS.join(", ")}`);
  }
  if (field.overflow && !(OVERFLOW_MODES as readonly string[]).includes(field.overflow)) {
    errors.push(`${path}: overflow must be one of ${OVERFLOW_MODES.join(", ")}`);
  }
  if (field.minFontSize != null) {
    if (field.minFontSize <= 0) errors.push(`${path}: minFontSize must be > 0`);
    if (field.minFontSize > field.fontSize) errors.push(`${path}: minFontSize must be <= fontSize`);
  }
  return errors;
}

export function validateTemplate(template: Template, registryId?: string): string[] {
  const errors: string[] = [];
  const id = registryId ?? template.templateId;

  if (template.templateId !== registryId && registryId != null) {
    errors.push(`${id}: templateId "${template.templateId}" does not match registry key "${registryId}"`);
  }
  if (template.viewBox.width <= 0 || template.viewBox.height <= 0) {
    errors.push(`${id}: viewBox width and height must be > 0`);
  }
  if (template.background && !TEMPLATE_BG_PATTERN.test(template.background)) {
    errors.push(`${id}: invalid background path "${template.background}"`);
  }

  for (const key of Object.keys(template.fields)) {
    if (!isRenderableField(key)) {
      errors.push(`${id}: unknown field "${key}" (allowed: ${RENDERABLE_CERT_FIELDS.join(", ")})`);
      continue;
    }
    const field = template.fields[key];
    if (field) errors.push(...validateTextField(field, `${id}.fields.${key}`));
  }

  return errors;
}
