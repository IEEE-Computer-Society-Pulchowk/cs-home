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
