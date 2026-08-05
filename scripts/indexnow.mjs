#!/usr/bin/env node
// Submit pages to IndexNow so Bing/Google crawl them promptly.
//   bun run indexnow                   # all URLs from the production sitemap
//   bun run indexnow https://…/blogs/x # a single URL
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://ieeecs.pcampus.edu.np";

const [arg] = process.argv.slice(2);
const key = readKey();
console.log(`IndexNow key: ${key}`);
console.log(`keyLocation: ${SITE}/${key}.txt`);

let urls;
if (arg) {
    if (!arg.startsWith("http")) throw new Error(`URL must be absolute: ${arg}`);
    urls = [arg];
    console.log(`target: single URL -> ${arg}`);
} else {
    console.log(`fetching sitemap: ${SITE}/sitemap.xml`);
    const res = await fetch(`${SITE}/sitemap.xml`);
    if (!res.ok) throw new Error(`sitemap fetch failed: HTTP ${res.status}`);
    urls = [...(await res.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    console.log(`parsed ${urls.length} URL(s) from sitemap`);
}

if (urls.length === 0) throw new Error("no URLs to submit");
urls = urls.slice(0, 10000); // IndexNow per-submission limit
if (urls.length > 5) {
    console.log(`submitting ${urls.length} URL(s): first 5 ->`);
    for (const u of urls.slice(0, 5)) console.log(`  ${u}`);
    console.log(`  ... (${urls.length - 5} more)`);
} else {
    console.log(`submitting ${urls.length} URL(s):`);
    for (const u of urls) console.log(`  ${u}`);
}

const payload = {
    host: new URL(SITE).host,
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList: urls,
};
console.log(`POST https://api.indexnow.org/indexnow`);
console.log(`payload: ${JSON.stringify(payload).slice(0, 500)}${JSON.stringify(payload).length > 500 ? "..." : ""}`);

const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
});
console.log(`response -> HTTP ${res.status}`);
const text = await res.text();
if (text) console.log(`body: ${text}`);
if (res.status === 202) {
    console.log("success: URLs accepted for indexing");
} else {
    console.log(`error: ${res.status}${text ? ` (${text})` : ""} — see https://www.indexnow.org/documentation for status codes`);
}

function readKey() {
    const file = readdirSync("public").find((f) => f.endsWith(".txt"));
    const key = file ? readFileSync(join("public", file), "utf8").trim() : "";
    if (!/^[0-9a-f-]{32,}$/.test(key)) throw new Error("no IndexNow key file (*.txt) found in public/");
    return key;
}
