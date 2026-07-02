import type { Certificate, Template, TextField } from "@/data/certificates/types";

// Generic certificate renderer. Background art carries the full design; this only
// overlays per-recipient values at template coordinates.

function Text({ field, children }: { field: TextField; children: string }) {
  return (
    <text
      x={field.x}
      y={field.y}
      fontSize={field.fontSize}
      fontFamily={field.fontFamily}
      fill={field.fill}
      textAnchor={field.textAnchor}
    >
      {children}
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
  const f = template.fields;

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
        // ponytail: blank canvas until real background PNG is wired in the template JSON.
        <rect x={0} y={0} width={width} height={height} fill="#ffffff" />
      )}

      {f.name && <Text field={f.name}>{data.name}</Text>}
      {f.event && <Text field={f.event}>{data.event}</Text>}
      {f.date && <Text field={f.date}>{data.date}</Text>}
      {f.certId && <Text field={f.certId}>{data.certId}</Text>}

      {f.qr && (
        <image href={data.qr} x={f.qr.x} y={f.qr.y} width={f.qr.size} height={f.qr.size} />
      )}
    </svg>
  );
}
