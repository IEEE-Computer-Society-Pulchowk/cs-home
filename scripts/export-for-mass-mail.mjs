#!/usr/bin/env node
// Input participant CSV → output same columns plus full certificate URL for mass mail.
//
//   bun run scripts/export-for-mass-mail.mjs <input.csv> [...] > mass-mail.csv
import { readFileSync } from "node:fs";
import { CERTIFICATE_COLUMNS, certificatePath, parseCsv, toCsv } from "./certificate-csv.mjs";

const SITE_URL = "https://ieeecs.pcampus.edu.np";

function main() {
  const inputs = process.argv.slice(2);
  if (!inputs.length) {
    console.error("usage: bun run scripts/export-for-mass-mail.mjs <input.csv> [...]");
    process.exit(1);
  }

  const rows = inputs.flatMap((f) => parseCsv(readFileSync(f, "utf8")));
  const output = rows.map((row) => ({
    ...row,
    certurl: `${SITE_URL}${certificatePath(row.templateId, row.email)}`,
  }));

  process.stdout.write(toCsv(output, [...CERTIFICATE_COLUMNS, "certurl"]));
}

main();
