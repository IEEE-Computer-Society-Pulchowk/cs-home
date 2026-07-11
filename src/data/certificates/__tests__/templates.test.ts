import { expect, test } from "bun:test";
import demo from "@/data/certificates/templates/demo.json";
import linux1012026 from "@/data/certificates/templates/linux-101-2026.json";
import {
  OVERFLOW_MODES,
  RENDERABLE_CERT_FIELDS,
  TEXT_ANCHORS,
  type OverflowMode,
  type RenderableCertField,
  type TextAnchor,
} from "@/data/certificates/types";
import { validateTemplate } from "@/data/certificates/validate";

const TEMPLATES: Record<string, unknown> = {
  demo,
  "linux-101-2026": linux1012026,
};

// Compile-time: const arrays must cover the derived union types.
type AssertEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : never;
const _textAnchor: AssertEqual<TextAnchor, (typeof TEXT_ANCHORS)[number]> = true;
const _overflow: AssertEqual<OverflowMode, (typeof OVERFLOW_MODES)[number]> = true;
const _renderable: AssertEqual<RenderableCertField, (typeof RENDERABLE_CERT_FIELDS)[number]> = true;
void _textAnchor;
void _overflow;
void _renderable;

test("enum arrays cover all union members", () => {
  const anchors: TextAnchor[] = ["start", "middle", "end"];
  const overflows: OverflowMode[] = ["shrink", "wrap"];
  const fields: RenderableCertField[] = ["name", "event", "date"];

  for (const value of anchors) expect(TEXT_ANCHORS).toContain(value);
  for (const value of overflows) expect(OVERFLOW_MODES).toContain(value);
  for (const value of fields) expect(RENDERABLE_CERT_FIELDS).toContain(value);
});

test("registered templates pass validation", () => {
  const failures: string[] = [];
  for (const [id, template] of Object.entries(TEMPLATES)) {
    failures.push(...validateTemplate(template as never, id));
  }
  expect(failures).toEqual([]);
});

test("demo.json fields include full bounding boxes", () => {
  for (const key of RENDERABLE_CERT_FIELDS) {
    const field = demo.fields[key as keyof typeof demo.fields];
    expect(field, `demo.fields.${key}`).toBeDefined();
    expect(field!.width).toBeGreaterThan(0);
    expect(field!.height).toBeGreaterThan(0);
    expect(field!.overflow).toBeOneOf([...OVERFLOW_MODES]);
    expect(field!.minFontSize).toBeGreaterThan(0);
  }
});
