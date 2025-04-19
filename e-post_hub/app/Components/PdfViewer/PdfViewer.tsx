"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
interface PdfViewerProps {
  fileUrl: string;   
  containerHeight?: number;
}

export default function PdfPreview({
    fileUrl,
  }: PdfViewerProps) {
  
    return (
      <div>
        <Document file={fileUrl}>
          <div
            style={{
              width: "100%",
              height: "400px",
              overflow: "hidden",
              position: "relative",
              }}
          >
            <Page
              pageNumber={1}
              width={250} 
            />
          </div>
        </Document>
      </div>
    );
  }