#!/usr/bin/env node
// Converts raster images under public/ (png, jpg, jpeg) to .webp, sized to the
// max each kind of image actually renders at, then deletes the original.
// Which max dimension + webp quality to use is chosen by a controller that
// reads the image's type from its path.
//
//   bun run scripts/convert-images.mjs
//
// Re-tune after changing rules: delete the .webp files, git-restore the
// originals, re-run.
// Never touched: favicon/ (browser+manifest compat), *.svg (vector),
// og-image.png (og:image stays a PNG), and any cert* image (certificates stay
// high-res PNG for print/download).
import { readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC = join(ROOT, "public");
const RASTER = new Set([".png", ".jpg", ".jpeg"]);
const NEVER = new Set(["favicon", "og-image.png"]);

// Path prefix -> { maxDim px (longest edge), webp quality }. Faces keep more
// quality; big photos downscale harder for size.
const RULES = [
  { match: "people", maxDim: 600, quality: 85 },
  { match: "events", maxDim: 1600, quality: 75 },
  { match: "gallery", maxDim: 1600, quality: 75 },
  { match: "blogs", maxDim: 1200, quality: 80 },
];
const DEFAULT_RULE = { maxDim: 1920, quality: 75 };

function ruleFor(rel) {
  if (rel.includes("cert")) return null; // certificates stay high-res PNG
  return RULES.find((r) => rel.startsWith(`${r.match}/`)) ?? DEFAULT_RULE;
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (NEVER.has(entry.name)) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

let converted = 0;
let skipped = 0;
for (const file of walk(PUBLIC)) {
  const ext = extname(file).toLowerCase();
  if (!RASTER.has(ext)) continue;
  const rel = relative(PUBLIC, file);
  if (NEVER.has(rel)) continue;
  const rule = ruleFor(rel);
  if (!rule) continue;
  const webp = file.slice(0, -ext.length) + ".webp";
  if (statSync(webp, { throwIfNoEntry: false })) {
    skipped++;
    continue;
  }

  const image = await loadImage(file);
  let { width, height } = image;
  if (width > rule.maxDim) {
    const scale = rule.maxDim / width;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = createCanvas(width, height);
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);
  writeFileSync(webp, await canvas.encode("webp", rule.quality));
  unlinkSync(file);
  converted++;
  console.log(`webp ${rel} (${width}x${height}, q${rule.quality})`);
}
console.log(`converted ${converted}, skipped ${skipped}`);
