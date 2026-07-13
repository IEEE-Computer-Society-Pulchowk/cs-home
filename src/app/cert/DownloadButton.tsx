"use client";

// Convenience client-side PNG export of the rendered certificate SVG.
// ponytail: inline external <image> hrefs before serialize — blob URLs can't resolve /public paths.
//
// Same problem applies to fonts: a standalone (serialized) SVG has no access to
// the page's <style>/@font-face rules (e.g. HandjetBold from globals.css), so
// rasterizing it via `new Image()` silently falls back to a default font —
// the download looked different from the on-page render even though both use
// the same layoutText() math. Fix: embed the actual @font-face rule (as base64)
// for every font-family used in the SVG, same inline-before-serialize pattern
// as the images below.

async function svgWithInlinedImages(svg: SVGSVGElement): Promise<SVGSVGElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const images = clone.querySelectorAll("image");

  await Promise.all(
    [...images].map(async (img) => {
      const href =
        img.getAttribute("href") ??
        img.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href || href.startsWith("data:")) return;

      const blob = await fetch(href).then((r) => r.blob());
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      img.setAttribute("href", dataUrl);
      img.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
    }),
  );

  return clone;
}

function findFontFaceRule(family: string): CSSFontFaceRule | undefined {
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin stylesheet, can't read it — nothing we can inline anyway
    }
    for (const rule of rules) {
      if (rule instanceof CSSFontFaceRule && rule.style.fontFamily.replace(/["']/g, "") === family) {
        return rule;
      }
    }
  }
  return undefined;
}

async function svgWithInlinedFonts(svg: SVGSVGElement): Promise<SVGSVGElement> {
  const families = new Set(
    [...svg.querySelectorAll("text")].map((t) => t.getAttribute("font-family")).filter((f): f is string => !!f),
  );

  const faces = await Promise.all(
    [...families].map(async (family) => {
      const rule = findFontFaceRule(family);
      const url = rule?.style.getPropertyValue("src").match(/url\(["']?([^"')]+)["']?\)/)?.[1];
      if (!url) return null; // web-safe/system font (e.g. Georgia) — nothing to embed

      const blob = await fetch(url).then((r) => r.blob());
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      return `@font-face { font-family: "${family}"; src: url("${dataUrl}"); }`;
    }),
  );

  const css = faces.filter(Boolean).join("\n");
  if (css) {
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = css;
    svg.insertBefore(style, svg.firstChild);
  }
  return svg;
}

export default function DownloadButton({
  svgId,
  filename,
}: {
  svgId: string;
  filename: string;
}) {
  async function download() {
    const svg = document.getElementById(svgId) as unknown as SVGSVGElement | null;
    if (!svg) return;

    const inlined = await svgWithInlinedFonts(await svgWithInlinedImages(svg));
    const xml = new XMLSerializer().serializeToString(inlined);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("svg load failed"));
        img.src = url;
      });

      const { width, height } = svg.viewBox.baseVal;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);

      const a = document.createElement("a");
      a.download = `${filename}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return (
    <button
      onClick={download}
      className="mt-6 inline-flex items-center rounded-lg bg-ieee-cs-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
    >
      Download as image
    </button>
  );
}
