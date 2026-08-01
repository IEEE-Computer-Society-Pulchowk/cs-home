#!/usr/bin/env node
// Regenerates public/og-image.png: the orange logo on a plain white 1200x630
// card. Must be a raster PNG — Facebook/Discord reject SVG.
//
//   bun run images:og
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const ROOT = new URL("..", import.meta.url).pathname;

const W = 1200;
const H = 630;

const logo = await loadImage(join(ROOT, "public", "logo-orange.svg"));
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, W, H);

const scale = (W - 240) / logo.width;
const lw = W - 240;
const lh = logo.height * scale;
ctx.drawImage(logo, (W - lw) / 2, (H - lh) / 2, lw, lh);

writeFileSync(join(ROOT, "public", "og-image.png"), await canvas.encode("png"));
console.log("wrote public/og-image.png (1200x630)");
