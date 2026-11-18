"use client";

import React from "react";
import Script from "next/script";
import {
  MAMMOTH_SCRIPT_URL,
  PDFJS_SCRIPT_URL,
  PDFJS_WORKER_URL,
} from "../cv-engine";

export function CvParserScripts() {
  return (
    <>
      <Script
        src={PDFJS_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={() => {
          try {
            if (window.pdfjsLib) {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
            }
          } catch {
            // Worker assignment handled defensively during extraction
          }
        }}
      />
      <Script src={MAMMOTH_SCRIPT_URL} strategy="afterInteractive" />
    </>
  );
}
