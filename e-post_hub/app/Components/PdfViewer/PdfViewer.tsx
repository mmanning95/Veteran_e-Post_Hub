"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js"; 

interface PdfViewerProps {
  fileUrl: string;   
  containerHeight?: number;
}

export default function PdfPreview({
    fileUrl,
  }: PdfViewerProps) {
    const [numPages, setNumPages] = useState(0);
  
    return (
      <div>
        <Document file={fileUrl} onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}>
          {/* 
             We'll just display page 1 with some fixed size/scale.
             The container is 100% wide, 400px tall, overflow hidden.
          */}
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