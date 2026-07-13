#!/usr/bin/env node
// Input participant CSV → renders each certificate directly from template +
// data (same layoutText math as CertificateSvg.tsx, src/data/certificates/render.ts)
// and writes a PNG per row into cert-exports/ (outside public/, not deployed —
// just a local folder to copy from for mailing attachments), plus an output
// CSV with the certificate link and local image filepath per row.
//
// No browser, no running server — pure data-to-PNG.
//
//   bun run scripts/export-certificate-images.mjs <input.csv> [...] [--out-dir=cert-exports] \
//     > mass-mail-with-images.csv
//
// Requires certificates to already exist in src/data/certificates/index.ts
// (run `bun run cert:generate` first).
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { Resvg } from "@resvg/resvg-js";
import {
  certificatePath,
  normalizeEmail,
  parseCsv,
  toCsv,
  withColumns,
} from "./certificate-csv.mjs";
import { getCertificateByTemplateAndEmail } from "../src/data/certificates/index.ts";
import { getTemplate } from "../src/data/certificates/templates/index.ts";
import { layoutText } from "../src/data/certificates/render.ts";

const SITE_URL = "https://ieeecs.pcampus.edu.np";
const ROOT = new URL("..", import.meta.url).pathname;
const FONTS_DIR = join(ROOT, "public", "fonts");

// ponytail: every .ttf in public/fonts/ is auto-registered under a family name
// equal to its filename (no extension) — e.g. public/fonts/Handjet.ttf ->
// fontFamily: "Handjet" in a template JSON. Keep the same name in the
// matching @font-face in src/app/globals.css so the browser and this script
// render identically. TTF only for now — see README "Add a custom font".
//
// This loop is the same as manually writing, per font:
//   GlobalFonts.registerFromPath(join(FONTS_DIR, "Handjet.ttf"), "Handjet");
// — nothing to add here when a new .ttf shows up in public/fonts/.
function registerFonts() {
  let files;
  try {
    files = readdirSync(FONTS_DIR);
  } catch {
    return; // no public/fonts/ yet — nothing to register
  }
  for (const file of files) {
    if (extname(file).toLowerCase() !== ".ttf") continue;
    const family = file.slice(0, -extname(file).length);
    GlobalFonts.registerFromPath(join(FONTS_DIR, file), family);
  }
}

function parseArgs(argv) {
  const inputs = [];
  let outDir = "cert-exports";
  for (const arg of argv) {
    if (arg.startsWith("--out-dir=")) outDir = arg.slice("--out-dir=".length);
    else inputs.push(arg);
  }
  return { inputs, outDir };
}

// ponytail: mirrors DownloadButton.tsx's filenamePart — keep in sync if that changes.
function filenamePart(email) {
  return email.toLowerCase().replace(/[^a-z0-9._-]/g, "_");
}

// ponytail: rasterized once per templateId, not per row — background is identical
// across every certificate from the same template.
const backgroundCache = new Map();
async function loadBackground(template) {
  if (!template.background) return null;
  if (backgroundCache.has(template.templateId))
    return backgroundCache.get(template.templateId);

  const svg = readFileSync(join(ROOT, "public", template.background));
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: template.viewBox.width },
  })
    .render()
    .asPng();
  const image = await loadImage(png);
  backgroundCache.set(template.templateId, image);
  return image;
}

async function renderCertificatePng(templateId, email) {
  const cert = getCertificateByTemplateAndEmail(templateId, email);
  const template = cert && getTemplate(templateId);
  if (!cert || !template)
    throw new Error(
      "certificate not found — run `bun run cert:generate` first",
    );

  const { width, height } = template.viewBox;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const background = await loadBackground(template);
  if (background) ctx.drawImage(background, 0, 0, width, height);
  else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  for (const [key, field] of Object.entries(template.fields)) {
    const value = cert[key];
    if (!field || value == null || value === "") continue;

    const { fontSize, lines, x, startY, singleLineY, lineHeight, baseline } = layoutText(
      String(value),
      field,
      ctx,
    );
    ctx.fillStyle = field.fill;
    ctx.textAlign = field.textAnchor === "middle" ? "center" : field.textAnchor;
    ctx.textBaseline = baseline;
    lines.forEach((line, i) => {
      ctx.font = `${fontSize}px ${field.fontFamily}`;
      ctx.fillText(
        line,
        x,
        lines.length === 1 ? singleLineY : startY + i * lineHeight,
      );
    });
  }

  return canvas.encode("png");
}

async function main() {
  const { inputs, outDir } = parseArgs(process.argv.slice(2));
  if (!inputs.length) {
    console.error(
      "usage: bun run scripts/export-certificate-images.mjs <input.csv> [...] [--out-dir=path]",
    );
    process.exit(1);
  }

  registerFonts();

  const rows = inputs.flatMap((f) => parseCsv(readFileSync(f, "utf8")));
  mkdirSync(outDir, { recursive: true });

  const output = [];
  for (const row of rows) {
    const email = normalizeEmail(row.email);
    const filename = `${row.templateId}-${filenamePart(email)}.png`;
    const filepath = join(outDir, filename);

    try {
      writeFileSync(
        filepath,
        await renderCertificatePng(row.templateId, email),
      );
      output.push({
        ...row,
        certurl: `${SITE_URL}${certificatePath(row.templateId, email)}`,
        imagepath: filepath,
      });
    } catch (err) {
      console.error(`skipped ${row.templateId}|${email}: ${err.message}`);
    }
  }

  process.stdout.write(
    toCsv(output, withColumns(rows, "certurl", "imagepath")),
  );
  console.error(
    `Rendered ${output.length}/${rows.length} certificate(s) -> ${outDir}`,
  );
}

main();
