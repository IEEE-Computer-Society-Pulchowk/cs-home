"use client";

import { useLayoutEffect, useState } from "react";
import { layoutText } from "@/data/certificates/render";
import type { Certificate, RenderableCertField, Template, TextField } from "@/data/certificates/types";

function FittedText({ field, text }: { field: TextField; text: string }) {
  const [layout, setLayout] = useState(() => layoutText(text, field, { font: "", measureText: () => ({ width: 0 }) }));

  useLayoutEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLayout(layoutText(text, field, ctx));
  }, [field, text]);

  return (
    <text
      x={layout.x}
      y={layout.lines.length === 1 ? layout.singleLineY : layout.startY}
      fontSize={layout.fontSize}
      fontFamily={field.fontFamily}
      fill={field.fill}
      textAnchor={field.textAnchor}
      dominantBaseline={layout.lines.length === 1 ? "middle" : "auto"}
    >
      {layout.lines.map((line, i) => (
        <tspan key={i} x={layout.x} dy={i === 0 ? 0 : layout.lineHeight}>
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
