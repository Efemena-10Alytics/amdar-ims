"use client";

import React, { useRef, useState } from "react";
import { DiagnosticHeader } from "../../_diagnostic-shared/diagnostic-header";

export interface UploadErrorState {
  title: string;
  msg: string;
}

interface UploadViewProps {
  selectedFileLabel: string | null;
  error: UploadErrorState | null;
  onFileSelected: (file: File) => void;
}

const FEATURES = [
  {
    title: "UK ATS Scoring",
    body: "Flags non-UK phrasing, missing technical tools, and layout parsing blockers.",
  },
  {
    title: "SOC Code Mapping",
    body: "Matches your experience to eligible UK Skilled Worker sponsorship classifications.",
  },
  {
    title: "£41,700 Sponsorship & ILR",
    body: "Audits deliverables against the £41,700 visa threshold and 5-Year ILR alignment.",
  },
] as const;

export function UploadView({
  selectedFileLabel,
  error,
  onFileSelected,
}: UploadViewProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelected(file);
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-12">
      <DiagnosticHeader
        subtag="UK CV Sponsorship Checker"
        rightSlot={
          <span className="text-[0.85rem] font-semibold text-[#C7D5D6]">
            Free Audit &bull; 30 Seconds
          </span>
        }
      />

      <div className="pt-2.5 text-center">
        <span className="mb-3 inline-block text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#FFE082]">
          UK Skilled Worker &amp; ILR Audit
        </span>
        <h1 className="text-[clamp(1.65rem,5.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.015em] text-white">
          Can Your CV Land You a{" "}
          <span className="text-[#FFE082]">UK Sponsored Job?</span>
        </h1>
        <p className="mx-auto mt-3.5 max-w-[38em] text-[1.05rem] text-[#C7D5D6]">
          Upload your CV to check it against UK ATS screeners, Home Office
          Skilled Worker SOC codes, and the £41,700 sponsorship threshold in 30
          seconds.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative my-6 cursor-pointer rounded-[28px] border-2 border-dashed px-5 py-10 text-center transition-all duration-200 ${
          error
            ? "border-[#FF8F78] bg-[#FF8F78]/[0.06]"
            : isDragOver
              ? "-translate-y-0.5 border-[#FFE082] bg-[#FFE082]/12"
              : "border-[#FFE082]/50 bg-gradient-to-b from-[#FFE082]/[0.07] to-[#0C3640]/70 hover:-translate-y-0.5 hover:border-[#FFE082] hover:bg-[#FFE082]/12"
        }`}
      >
        <input
          ref={fileInputRef}
          id="cv-file"
          type="file"
          accept=".pdf,.docx"
          aria-label="Upload your CV"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div className="mx-auto mb-4 grid h-[72px] w-[72px] place-items-center rounded-full bg-[#FFE082] text-[#092A31] shadow-[0_0_0_10px_rgba(255,224,130,0.14)]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h3 className="mb-1.5 text-[1.2rem] font-bold text-white">
          Tap to Upload Your CV or Drag &amp; Drop
        </h3>
        <p className="text-[0.92rem] text-[#C7D5D6]">
          Supports PDF or DOCX (Max 5MB)
        </p>

        {selectedFileLabel ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#156374] bg-[#092A31] px-4 py-2 text-[0.88rem] text-[#F2F7F7]">
            <span>{selectedFileLabel}</span>
          </div>
        ) : null}
      </div>

      {/* Inline Upload Error */}
      {error ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-[18px] border-[1.5px] border-[#FF8F78] bg-[#FF8F78]/10 px-4 py-4 text-left"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 flex-none text-[#FF8F78]"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong className="mb-0.5 block text-[#FF8F78]">
              {error.title}
            </strong>
            <p className="text-[0.92rem] text-[#FFD9D0]">{error.msg}</p>
          </div>
        </div>
      ) : null}

      {/* Feature Cards */}
      <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-[20px] border border-[#156374]/55 bg-[#0C3640]/85 p-4"
          >
            <h4 className="mb-1.5 text-[0.92rem] font-bold text-[#FFE082]">
              {f.title}
            </h4>
            <p className="text-[0.84rem] leading-[1.45] text-[#C7D5D6]">
              {f.body}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[0.82rem] text-[#8EB7BE]">
        &copy; Amdari. Your CV is parsed securely in your browser and used
        strictly for career evaluation.
      </p>
    </div>
  );
}
