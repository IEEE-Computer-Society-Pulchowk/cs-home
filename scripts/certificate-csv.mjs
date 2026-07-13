export const CERTIFICATE_COLUMNS = ["name", "email", "eventSlug", "templateId"];

// ponytail: naive split — fine for a flat participant list with no embedded
// commas/quotes. Swap in `csv-parse` only if a real CSV breaks this.
export function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .split("\n")
    .filter((l) => l.trim());
  const header = lines
    .shift()
    .split(",")
    .map((h) => h.trim());
  for (const col of CERTIFICATE_COLUMNS) {
    if (!header.includes(col))
      throw new Error(`CSV missing required column: ${col}`);
  }
  return lines.map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  });
}

export function normalizeEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

// Preserves whatever columns the input CSV actually had (in first-seen order),
// so extra columns beyond name/email/eventSlug/templateId survive to stdout
// instead of being silently dropped by a hardcoded header list.
export function inputColumns(rows) {
  const seen = new Set();
  const cols = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        cols.push(key);
      }
    }
  }
  return cols;
}

// Appends new columns after the input's own, skipping any that already exist
// (e.g. an input CSV that already has a "certurl" column).
export function withColumns(rows, ...extra) {
  return [...inputColumns(rows), ...extra.filter((c) => !rows.some((r) => c in r))];
}

export function certificatePath(templateId, email) {
  return `/cert?templateId=${templateId}&email=${normalizeEmail(email)}`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows, headers) {
  return (
    [
      headers.map(csvEscape).join(","),
      ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
    ].join("\n") + "\n"
  );
}
