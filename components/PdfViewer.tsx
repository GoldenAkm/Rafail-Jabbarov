"use client";

import { useEffect, useRef, useState } from "react";

// data: the PDF file, base64-encoded
type Props = { data: string; title: string };

function decodeBase64(data: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Renders each PDF page to a canvas with PDF.js, so the resume shows inline on
// every browser, including mobile ones that would otherwise download the file.
export default function PdfViewer({ data, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let lastWidth = 0;

    const render = async () => {
      const width = container.clientWidth;
      if (!width || width === lastWidth) return;
      lastWidth = width;

      try {
        // Legacy build: polyfilled for browsers older than the latest releases
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        // Fresh bytes each render: PDF.js hands the buffer to its worker and detaches it
        const pdf = await pdfjs.getDocument({ data: decodeBase64(data) }).promise;
        const canvases: HTMLCanvasElement[] = [];
        const ratio = window.devicePixelRatio || 1;

        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / base.width) * ratio });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.setAttribute("aria-label", `${title}, page ${n} of ${pdf.numPages}`);
          canvas.setAttribute("role", "img");

          await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
          canvases.push(canvas);
        }

        if (cancelled) return;
        container.replaceChildren(...canvases);
        setStatus("ready");
      } catch (err) {
        console.error("Resume PDF failed to render:", err);
        if (!cancelled) {
          setErrorDetail(err instanceof Error ? err.message : String(err));
          setStatus("error");
        }
      }
    };

    render();

    // Re-render sharply when the layout width changes (rotation, resize)
    let timer: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(render, 200);
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [data, title]);

  return (
    <div className="pdf-viewer">
      {status !== "ready" && (
        <p className="pdf-viewer__status muted">
          {status === "loading" ? "Decrypting document…" : "Could not render the PDF."}
          {errorDetail && <span className="pdf-viewer__error">{errorDetail}</span>}
        </p>
      )}
      <div ref={containerRef} className="pdf-viewer__pages" />
    </div>
  );
}
