#!/usr/bin/env node
// Exports certificate IDs as CSV from a participant CSV.
//
//   bun run scripts/export-cert-ids.mjs <input.csv> [<input2.csv> ...] > cert-ids.csv
import { readFileSync } from "node:fs";
import { formatCertId, parseCsv, toCsv } from "./certificate-csv.mjs";

function main() {
  const inputs = process.argv.slice(2);
  if (!inputs.length) {
    console.error("usage: bun run scripts/export-cert-ids.mjs <input.csv> [...]");
    process.exit(1);
  }

  const rows = inputs.flatMap((f) => parseCsv(readFileSync(f, "utf8")));
  const output = rows.map((row) => ({
    certId: formatCertId(row.eventSlug, row.issueYear, row.templateId, row.email),
  }));

  process.stdout.write(toCsv(output, ["certId"]));
}

main();
