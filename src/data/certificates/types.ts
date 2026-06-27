export interface Certificate {
  certId: string;
  name: string;
  event: string; // human-readable event name, rendered
  eventSlug: string; // must match an existing src/data/events/<slug>/
  issueYear: number;
  date: string; // ISO (YYYY-MM-DD), rendered
  templateId: string; // must match src/data/certificates/templates/<id>.json
  qr: string; // QR data URL encoding the cert URL; baked at generate time
}

export interface TextField {
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  textAnchor: "start" | "middle" | "end";
}

export interface Template {
  templateId: string;
  viewBox: { width: number; height: number };
  background: string | null; // /public path to flattened art, or null for a drawn fallback
  fields: {
    name: TextField;
    event: TextField;
    date: TextField;
    certId: TextField;
    qr: { x: number; y: number; size: number };
  };
}

