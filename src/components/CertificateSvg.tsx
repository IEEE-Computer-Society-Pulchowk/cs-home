import type { Certificate, Template, TextField } from "@/data/certificates/types";

// Generic certificate renderer. Every template renders through this one
// component; only `template` (coordinates) and `data` (per-person values) differ.
// Fixed viewBox -> uniform scaling, so the design is pixel-stable at any size.

const SITE = "ieeecs.pcampus.edu.np";

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
        // ponytail: drawn fallback so a template renders before real art exists.
        // Real templates set `background` to a flattened PNG and this branch is unused.
        <>
          <rect x={0} y={0} width={width} height={height} fill="#ffffff" />
          <rect
            x={40}
            y={40}
            width={width - 80}
            height={height - 80}
            fill="none"
            stroke="#f87b1b"
            strokeWidth={6}
          />
          <text x={width / 2} y={300} fontSize={56} fontFamily="Georgia, serif" fill="#1a1a1a" textAnchor="middle">
            Certificate of Participation
          </text>
          <text x={width / 2} y={430} fontSize={26} fontFamily="Inter, sans-serif" fill="#888888" textAnchor="middle">
            This certifies that
          </text>
        </>
      )}

      <Text field={f.name}>{data.name}</Text>
      <Text field={f.event}>{data.event}</Text>
      <Text field={f.date}>{data.date}</Text>
      <Text field={f.certId}>{data.certId}</Text>

      <image href={data.qr} x={f.qr.x} y={f.qr.y} width={f.qr.size} height={f.qr.size} />

      {/* Self-context footer — this is seen standalone when embedded elsewhere. */}
      <text
        x={width / 2}
        y={height - 24}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fill="#aaaaaa"
        textAnchor="middle"
      >
        Issued by IEEE CS Pulchowk SBC · Verify at {SITE}/verify
      </text>
    </svg>
  );
}
