"use client";

// Convenience client-side PNG export of the rendered certificate SVG.
// ponytail: inline external <image> hrefs before serialize — blob URLs can't resolve /public paths.

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

    const inlined = await svgWithInlinedImages(svg);
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
