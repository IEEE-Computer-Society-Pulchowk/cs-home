"use client";

// Convenience client-side PNG export of the rendered certificate SVG.
// The live page is the canonical artifact; this is just a "save a copy" helper.
// ponytail: rasterizes vector + inline-data-URL QR, which is taint-free. If a
// template later uses a raster <image> background and canvas export taints,
// add the server-side PNG route (deferred in the plan) instead of fighting this.
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

    const xml = new XMLSerializer().serializeToString(svg);
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
