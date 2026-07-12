export interface Certificate {
  email: string;
  name: string;
  eventSlug: string;
  templateId: string;
}

export const OVERFLOW_MODES = ["shrink", "wrap"] as const;
export const TEXT_ANCHORS = ["start", "middle", "end"] as const;
export const RENDERABLE_CERT_FIELDS = ["name", "event", "date"] as const;

export type OverflowMode = (typeof OVERFLOW_MODES)[number];
export type TextAnchor = (typeof TEXT_ANCHORS)[number];
export type RenderableCertField = (typeof RENDERABLE_CERT_FIELDS)[number];

export interface TextField {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  textAnchor: TextAnchor;
  // shrink: one line, reduce font size. wrap: word-wrap to multiple lines, shrink if needed.
  overflow?: OverflowMode;
  minFontSize?: number;
}

export interface Template {
  templateId: string;
  displayName: string;
  viewBox: { width: number; height: number };
  background: string | null;
  fields: Partial<Record<RenderableCertField, TextField>>;
}
