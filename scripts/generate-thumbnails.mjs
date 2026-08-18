#!/usr/bin/env node
// Generates branded title-card thumbnails for any event/blog whose metadata
// `thumbnail` image is missing from public/. Candidates come from the data
// itself (EVENTS + blog frontmatter), the card text is the metadata title, and
// only paths that don't already have a file are rendered — so this is safe to
// run any time (a placeholder appears exactly when an image is missing).
// Font: JetBrains Mono from public/fonts/ (committed, portable). Writes .webp
// directly, so the webp test stays green.
//
//   bun run images:thumbnails
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { EVENTS, eventThumbnail } from "../src/data/events/index.ts";
import { getAllPosts } from "../src/lib/blogs.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC = join(ROOT, "public");
GlobalFonts.registerFromPath(
  join(ROOT, "public", "fonts", "JetBrainsMono.ttf"),
  "JetBrainsMono",
);

const W = 1200;
const H = 630;

const candidates = [
  ...EVENTS.map((e) => ({ title: e.title, out: eventThumbnail(e) })),
  ...getAllPosts().map((p) => ({ title: p.title, out: p.thumbnail })),
].filter((c) => c.out);

const missing = candidates.filter(
  ({ out }) => !statSync(join(PUBLIC, out.slice(1)), { throwIfNoEntry: false }),
);

if (!missing.length) {
  console.log("all thumbnails exist — nothing to generate");
  process.exit(0);
}

const logo = await loadImage(join(ROOT, "public", "logo-white.svg"));

for (const { title, out } of missing) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#111827");
  grad.addColorStop(1, "#1f2937");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#faa41a";
  ctx.fillRect(0, 0, W, 10);

  // ponytail: landscape lockup (374x114), drawn at natural ratio — og-image is
  // now the 1200x630 card, so the svg is the logo source.
  const scale = 280 / logo.width;
  ctx.drawImage(logo, 60, 60, 280, logo.height * scale);

  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";

  const area = { x: 80, top: 320, bottom: H - 30 };
  const wrap = (font) => {
    ctx.font = font;
    const maxWidth = W - 160;
    const lines = [];
    let line = "";
    for (const word of title.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    lines.push(line);
    return lines;
  };

  // ponytail: shrink font until the wrapped title fits the card; floor at 28
  // so endless-looping is impossible even for absurd titles.
  let size = 56;
  let lines = wrap(`${size}px "JetBrainsMono"`);
  while (
    area.top + lines.length * Math.round(size * 1.25) > area.bottom &&
    size > 28
  ) {
    size -= 4;
    lines = wrap(`${size}px "JetBrainsMono"`);
  }

  let y = area.top;
  for (const ln of lines) {
    ctx.fillText(ln, area.x, y);
    y += Math.round(size * 1.25);
  }

  const outPath = join(PUBLIC, out.slice(1));
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, await canvas.encode("webp", 80));
  console.log(`wrote public${out}`);
}
