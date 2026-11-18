"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as fpixel from "@/lib/fpixel";
import {
  CvCheckerView,
  CvEvaluation,
  SCAN_PLAN,
  assessCvDocument,
  extractCvText,
  readFileAsBase64,
  runCvEvaluation,
  sniffCvFileType,
} from "./cv-engine";
import { CvGateView } from "./_components/cv-gate-view";
import { CvParserScripts } from "./_components/cv-parser-scripts";
import { ProcessingView } from "./_components/processing-view";
import { UploadErrorState, UploadView } from "./_components/upload-view";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const INITIAL_PROC_STATUS =
  "Extracting commercial metrics and role positioning from your document.";

export default function UkCvCheckerPage() {
  const router = useRouter();
  const [view, setView] = useState<CvCheckerView>("upload");
  const [selectedFileLabel, setSelectedFileLabel] = useState<string | null>(
    null,
  );
  const [uploadError, setUploadError] = useState<UploadErrorState | null>(null);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [allStepsDone, setAllStepsDone] = useState(false);
  const [procStatus, setProcStatus] = useState(INITIAL_PROC_STATUS);

  const [evaluation, setEvaluation] = useState<CvEvaluation | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; type: string }>({
    name: "",
    type: "",
  });

  const procTokenRef = useRef(0);
  const procTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const base64PromiseRef = useRef<Promise<string>>(Promise.resolve(""));

  const clearTimers = () => {
    procTimersRef.current.forEach(clearTimeout);
    procTimersRef.current = [];
  };

  useEffect(() => {
    return () => {
      procTokenRef.current += 1;
      clearTimers();
    };
  }, []);

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const failUpload = (title: string, msg: string) => {
    clearTimers();
    setUploadError({ title, msg });
    setSelectedFileLabel(null);
    setEvaluation(null);
    setView("upload");
    scrollTop();
  };

  const handleFileSelected = async (file: File) => {
    setUploadError(null);

    const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (ext !== ".pdf" && ext !== ".docx") {
      failUpload(
        "Unsupported file type",
        "Please upload your CV as a PDF or Word document (.pdf, .docx).",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      failUpload(
        "File too large",
        "File size exceeds 5MB limit. Please upload a smaller CV file.",
      );
      return;
    }

    const expectedKind = ext === ".pdf" ? "pdf" : "docx";
    const kind = await sniffCvFileType(file);
    if (kind !== expectedKind) {
      failUpload(
        "We couldn't read this file",
        "The file doesn't match its extension or is corrupted. Please export your CV again as a PDF or DOCX and upload it.",
      );
      return;
    }

    setSelectedFileLabel(`${file.name} (${Math.round(file.size / 1024)} KB)`);
    setFileMeta({
      name: file.name,
      type:
        file.type ||
        (expectedKind === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    });
    base64PromiseRef.current = readFileAsBase64(file);

    fpixel.event("ViewContent", {
      content_name: "CV Upload",
      file_name: file.name,
    });

    const token = ++procTokenRef.current;
    clearTimers();
    setActiveStepIndex(0);
    setAllStepsDone(false);
    setProcStatus(INITIAL_PROC_STATUS);
    setView("processing");
    scrollTop();

    for (const step of SCAN_PLAN) {
      procTimersRef.current.push(
        setTimeout(() => {
          if (procTokenRef.current !== token) return;
          setActiveStepIndex(step.nextIdx);
          setProcStatus(step.msg);
        }, step.ms),
      );
    }

    const t0 = Date.now();
    const extracted = await Promise.race([
      extractCvText(file, expectedKind),
      sleep(15000).then(() => ({ error: "read" as const })),
    ]);

    if (procTokenRef.current !== token) return;

    const verdict = assessCvDocument(extracted);
    if (!verdict.ok) {
      failUpload(verdict.title, verdict.msg);
      return;
    }

    const evalResult = runCvEvaluation(verdict.text, file.name);
    setEvaluation(evalResult);

    await sleep(Math.max(0, 2800 - (Date.now() - t0)));
    if (procTokenRef.current !== token) return;

    setAllStepsDone(true);
    setView("gate");
    scrollTop();
  };

  const handleGateComplete = () => {
    router.push("/uk-cv-checker/thank-you");
  };

  return (
    <>
      <CvParserScripts />
      <main className="uk-diag-page text-[16px] sm:text-[17px] antialiased selection:bg-[#FFE082] selection:text-[#092A31]">
        {view === "upload" ? (
          <UploadView
            selectedFileLabel={selectedFileLabel}
            error={uploadError}
            onFileSelected={handleFileSelected}
          />
        ) : null}

        {view === "processing" ? (
          <ProcessingView
            activeStepIndex={activeStepIndex}
            allDone={allStepsDone}
            statusMessage={procStatus}
          />
        ) : null}

        {view === "gate" && evaluation ? (
          <CvGateView
            evaluation={evaluation}
            cvFileName={fileMeta.name}
            cvFileType={fileMeta.type}
            getCvBase64={() => base64PromiseRef.current}
            onComplete={handleGateComplete}
          />
        ) : null}
      </main>
    </>
  );
}
