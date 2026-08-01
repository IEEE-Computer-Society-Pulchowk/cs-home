import { expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { EVENTS, eventThumbnail } from "@/data/events/index";
import { getAllPosts } from "@/lib/blogs";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC = join(ROOT, "public");
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const ALLOWED_RASTER = new Set(["favicon", "og-image.png"]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "favicon") continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

const rasters = [...walk(PUBLIC)]
  .filter((f) => RASTER.has(extname(f).toLowerCase()))
  .map((f) => relative(PUBLIC, f));

test("every raster image under public/ is webp", () => {
  const nonWebp = rasters.filter(
    (f) => extname(f) !== ".webp" && !ALLOWED_RASTER.has(f) && !f.includes("cert"),
  );
  if (nonWebp.length) {
    console.log(
      `\nFound ${nonWebp.length} non-webp image(s):\n  ${nonWebp.join("\n  ")}\nRun \`bun run images:convert\` to convert them.`,
    );
  }
  expect(nonWebp).toEqual([]);
});

test("every thumbnail referenced in event/blog metadata exists as webp", () => {
  const refs = [
    ...EVENTS.map((e) => eventThumbnail(e)),
    ...getAllPosts().map((p) => p.thumbnail),
  ].filter((r): r is string => !!r);
  expect(refs.length).toBeGreaterThan(0);
  for (const ref of refs) {
    expect(ref.endsWith(".webp")).toBe(true);
    expect(rasters).toContain(ref.slice(1));
  }
});
