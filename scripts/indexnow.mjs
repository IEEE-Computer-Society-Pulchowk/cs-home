#!/usr/bin/env node
// Submit pages to IndexNow so Bing/Google crawl them promptly.
//   bun run indexnow                   # all URLs from the production sitemap
//   bun run indexnow https://…/blogs/x # a single URL
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://ieeecs.pcampus.edu.np";

const [arg] = process.argv.slice(2);
const key = readKey();

let urls;
if (arg) {
    if (!arg.startsWith("http")) throw new Error(`URL must be absolute: ${arg}`);
    urls = [arg];
} else {
    const res = await fetch(`${SITE}/sitemap.xml`);
    if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
    urls = [...(await res.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

if (urls.length === 0) throw new Error("no URLs to submit");
urls = urls.slice(0, 10000); // IndexNow per-submission limit

const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
        host: new URL(SITE).host,
        key,
        keyLocation: `${SITE}/${key}.txt`,
        urlList: urls,
    }),
});
console.log(`submitted ${urls.length} URL(s) to IndexNow -> HTTP ${res.status}`);
if (res.status !== 202) console.log(await res.text());

function readKey() {
    const file = readdirSync("public").find((f) => f.endsWith(".txt"));
    const key = file ? readFileSync(join("public", file), "utf8").trim() : "";
    if (!/^[0-9a-f-]{32,}$/.test(key)) throw new Error("no IndexNow key file (*.txt) found in public/");
    return key;
}
