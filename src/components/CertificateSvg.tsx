"use client";

import { useLayoutEffect, useState } from "react";
import type { Certificate, RenderableCertField, Template, TextField } from "@/data/certificates/types";

const LINE_HEIGHT = 1.2;

function anchorX(field: TextField) {
  return field.textAnchor === "start"
    ? field.x
    : field.textAnchor === "end"
      ? field.x + field.width
      : field.x + field.width / 2;
}

function measureWidth(text: string, fontSize: number, fontFamily: string, ctx: CanvasRenderingContext2D) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

function wrapLines(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
  ctx: CanvasRenderingContext2D,
) {
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

function fitText(text: string, field: TextField, ctx: CanvasRenderingContext2D) {
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

function FittedText({ field, text }: { field: TextField; text: string }) {
  const [layout, setLayout] = useState(() => ({ fontSize: field.fontSize, lines: [text] as string[] }));

  useLayoutEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLayout(fitText(text, field, ctx));
  }, [field, text]);

  const x = anchorX(field);
  const blockHeight = layout.lines.length * layout.fontSize * LINE_HEIGHT;
  const startY = field.y + (field.height - blockHeight) / 2 + layout.fontSize * 0.85;

  return (
    <text
      x={x}
      y={layout.lines.length === 1 ? field.y + field.height / 2 : startY}
      fontSize={layout.fontSize}
      fontFamily={field.fontFamily}
      fill={field.fill}
      textAnchor={field.textAnchor}
      dominantBaseline={layout.lines.length === 1 ? "middle" : "auto"}
    >
      {layout.lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : layout.fontSize * LINE_HEIGHT}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function CertificateSvg({
  template,
  data,
  svgId,
}: {
  template: Template;
  data: Certificate;
  svgId?: string;
}) {
  const { width, height } = template.viewBox;

  return (
    <svg
      id={svgId}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", maxWidth: "100%", height: "auto" }}
    >
      {template.background ? (
        <image href={template.background} x={0} y={0} width={width} height={height} />
      ) : (
        <rect x={0} y={0} width={width} height={height} fill="#ffffff" />
      )}

      {(Object.keys(template.fields) as RenderableCertField[]).map((key) => {
        const field = template.fields[key];
        const value = data[key];
        if (!field || value == null || value === "") return null;
        return <FittedText key={key} field={field} text={String(value)} />;
      })}
    </svg>
  );
}
