export interface Certificate {
  email: string;
  name: string;
  eventSlug: string;
  templateId: string;
  date?: string;
}

export const OVERFLOW_MODES = ["shrink", "wrap", "fill"] as const;
export const TEXT_ANCHORS = ["start", "middle", "end"] as const;

export const RENDERABLE_CERT_FIELDS = ["name", "date"] as const satisfies readonly (keyof Certificate)[];
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
  // shrink: one line, reduce font size if it overflows width. wrap: word-wrap
  // to multiple lines, shrink if needed. fill: one line, scale font size up
  // or down so it exactly spans width (height is ignored); anchored to the
  // field's bottom edge instead of vertically centered.
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
