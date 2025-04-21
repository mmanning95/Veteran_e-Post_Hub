"use client";

import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
interface PdfViewerProps {
  fileUrl: string;   
  containerHeight?: number;
}

export default function PdfPreview({ fileUrl, containerHeight }: PdfViewerProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const renderPdfThumbnail = async (url: string) => {
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // First page

    const viewport = page.getViewport({ scale: 0.5 }); //scale for image size
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;

      const imageUrl = canvas.toDataURL(); // Get image from canvas
      setThumbnail(imageUrl);
    }
  };

  useEffect(() => {
    renderPdfThumbnail(fileUrl);
  }, [fileUrl]);

  return (
    <div style={{ height: containerHeight || 400, overflow: "hidden" }}>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="PDF Thumbnail"
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}