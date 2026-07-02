#!/usr/bin/env node
// Exports certificate link metadata as CSV and writes PNGs to a separate folder.
//
//   bun run scripts/export-certificate-links.mjs <input.csv> [<input2.csv> ...] [--out <dir>]
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";
import { getTemplate } from "../src/data/certificates/templates/index.ts";
import { formatCertId, parseCsv, toCsv } from "./certificate-csv.mjs";

const SITE_URL = (process.env.SITE_URL || "https://ieeecs.pcampus.edu.np").replace(/\/$/, "");
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEFAULT_OUT_ROOT = process.env.CERT_OUTPUT_ROOT || join(ROOT, "certificate-exports");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function assetToDataUrl(assetPath) {
  if (!assetPath) return null;
  if (assetPath.startsWith("data:")) return assetPath;

  const filePath = join(ROOT, "public", assetPath.replace(/^\//, ""));
  const bytes = readFileSync(filePath);
  const ext = extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".svg"
          ? "image/svg+xml"
          : "application/octet-stream";
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

function renderSvg(template, cert, qrDataUrl) {
  const { width, height } = template.viewBox;
  const f = template.fields;
  const bg = template.background ? assetToDataUrl(template.background) : null;

  const text = (field, value) =>
    field
      ? `<text x="${field.x}" y="${field.y}" font-size="${field.fontSize}" font-family="${escapeXml(field.fontFamily)}" fill="${escapeXml(field.fill)}" text-anchor="${field.textAnchor}">${escapeXml(value)}</text>`
      : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${bg ? `<image href="${bg}" x="0" y="0" width="${width}" height="${height}" />` : `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff" />`}
  ${text(f.name, cert.name)}
  ${text(f.event, cert.event)}
  ${text(f.date, cert.date)}
  ${text(f.certId, cert.certId)}
  ${f.qr ? `<image href="${qrDataUrl}" x="${f.qr.x}" y="${f.qr.y}" width="${f.qr.size}" height="${f.qr.size}" />` : ""}
</svg>`;
}

function parseArgs(argv) {
  const inputs = [];
  let outRoot = DEFAULT_OUT_ROOT;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--out") {
      outRoot = argv[++i];
      if (!outRoot) throw new Error("--out requires a directory");
    } else {
      inputs.push(arg);
    }
  }

  return { inputs, outRoot };
}

async function main() {
  const { inputs, outRoot } = parseArgs(process.argv.slice(2));
  if (!inputs.length) {
    console.error("usage: bun run scripts/export-certificate-links.mjs <input.csv> [...] [--out <dir>]");
    process.exit(1);
  }

  const rows = inputs.flatMap((f) => parseCsv(readFileSync(f, "utf8")));
  const output = [];

  for (const row of rows) {
    const template = getTemplate(row.templateId);
    if (!template) throw new Error(`Unknown certificate template: ${row.templateId}`);

    const certId = formatCertId(row.eventSlug, row.issueYear, row.templateId, row.email);
    const certurl = `${SITE_URL}/cert/${certId}`;
    const certpath = `${row.templateId}/${certId}.png`;
    const outPath = join(outRoot, certpath);
    const qrDataUrl = await QRCode.toDataURL(certurl, { margin: 1, scale: 4 });
    const svg = renderSvg(template, { certId, name: row.name, event: row.event, date: row.date }, qrDataUrl);

    mkdirSync(dirname(outPath), { recursive: true });
    await sharp(Buffer.from(svg)).png().toFile(outPath);

    output.push({
      name: row.name,
      email: row.email,
      certurl,
      certpath,
    });
  }

  process.stdout.write(toCsv(output, ["name", "email", "certurl", "certpath"]));
  console.error(`Wrote ${output.length} certificate image(s) to ${outRoot}`);
}

main();
