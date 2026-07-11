// Pure text layout math shared between the browser (CertificateSvg.tsx) and
// the Node/Bun batch image export script. Only needs a 2D context with
// .font and .measureText() — works with the DOM Canvas API, @napi-rs/canvas,
// or any other CanvasRenderingContext2D-shaped implementation.
import type { TextField } from "./types";

export const LINE_HEIGHT = 1.2;

export interface Measurable {
  font: string;
  measureText(text: string): { width: number };
}

export function anchorX(field: TextField) {
  return field.textAnchor === "start"
    ? field.x
    : field.textAnchor === "end"
      ? field.x + field.width
      : field.x + field.width / 2;
}

function measureWidth(text: string, fontSize: number, fontFamily: string, ctx: Measurable) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

function wrapLines(text: string, maxWidth: number, fontSize: number, fontFamily: string, ctx: Measurable) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines: string[] = [];
  let line = words[0];
  for (const word of words.slice(1)) {
    const next = `${line} ${word}`;
    if (measureWidth(next, fontSize, fontFamily, ctx) <= maxWidth) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
  return lines;
}

export function fitText(text: string, field: TextField, ctx: Measurable) {
  const mode = field.overflow ?? "shrink";
  const minSize = field.minFontSize ?? Math.max(8, Math.round(field.fontSize * 0.5));

  if (mode === "wrap") {
    for (let size = field.fontSize; size >= minSize; size -= 1) {
      const lines = wrapLines(text, field.width, size, field.fontFamily, ctx);
      const blockHeight = lines.length * size * LINE_HEIGHT;
      if (blockHeight <= field.height) return { fontSize: size, lines };
    }
    const fontSize = minSize;
    return { fontSize, lines: wrapLines(text, field.width, fontSize, field.fontFamily, ctx) };
  }

  for (let size = field.fontSize; size >= minSize; size -= 1) {
    if (measureWidth(text, size, field.fontFamily, ctx) <= field.width) {
      return { fontSize: size, lines: [text] };
    }
  }
  return { fontSize: minSize, lines: [text] };
}

// Full layout: fitted lines plus the x/y positions CertificateSvg's <text>/<tspan>
// and the script's ctx.fillText both need, computed once so they can't drift apart.
export function layoutText(text: string, field: TextField, ctx: Measurable) {
  const { fontSize, lines } = fitText(text, field, ctx);
  const x = anchorX(field);
  const blockHeight = lines.length * fontSize * LINE_HEIGHT;
  const startY = field.y + (field.height - blockHeight) / 2 + fontSize * 0.85;
  const singleLineY = field.y + field.height / 2;
  return { fontSize, lines, x, startY, singleLineY, lineHeight: fontSize * LINE_HEIGHT };
}
