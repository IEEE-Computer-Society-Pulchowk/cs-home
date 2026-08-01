// Markdown → single-line plain text, truncated for meta descriptions and
// social embeds (Discord cuts embeds at ~256 chars; Google ~160).
export function plainDescription(markdown: string, max = 160): string {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`#>*_~]/g, "")
    .replace(/^\s*[-*+]\s+|\d+\.\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
