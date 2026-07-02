import { createHash } from "node:crypto";

export const CERTIFICATE_COLUMNS = ["name", "email", "event", "eventSlug", "issueYear", "date", "templateId"];

// ponytail: naive split — fine for a flat participant list with no embedded
// commas/quotes. Swap in `csv-parse` only if a real CSV breaks this.
export function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .split("\n")
    .filter((l) => l.trim());
  const header = lines.shift().split(",").map((h) => h.trim());
  for (const col of CERTIFICATE_COLUMNS) {
    if (!header.includes(col)) throw new Error(`CSV missing required column: ${col}`);
  }
  return lines.map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  });
}

export function certHash(eventSlug, templateId, email) {
  return createHash("sha256")
    .update(`${eventSlug}|${templateId}|${email}`)
    .digest("hex")
    .slice(0, 6);
}

export function formatCertId(eventSlug, issueYear, templateId, email) {
  return `${eventSlug}-${issueYear}-${certHash(eventSlug, templateId, email)}`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows, headers) {
  return [headers.map(csvEscape).join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n") + "\n";
}
