"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  clearCvCheckerState,
  getCvCheckerStateSnapshot,
  subscribeCvCheckerState,
} from "../cv-engine";
import { CvResultsView } from "../_components/cv-results-view";

export default function UkCvCheckerThankYouPage() {
  const router = useRouter();
  const stored = useSyncExternalStore(
    subscribeCvCheckerState,
    getCvCheckerStateSnapshot,
    () => undefined,
  );

  useEffect(() => {
    if (stored === null) {
      router.replace("/uk-cv-checker");
    }
  }, [router, stored]);

  const handleUploadAnother = () => {
    clearCvCheckerState();
    router.push("/uk-cv-checker");
  };

  if (!stored) {
    return (
      <main className="uk-diag-page flex min-h-screen items-center justify-center px-4 text-[#C7D5D6]">
        <p className="text-sm font-medium">Loading your CV audit report...</p>
      </main>
    );
  }

  return (
    <main className="uk-diag-page has-sticky text-[16px] sm:text-[17px] antialiased selection:bg-[#FFE082] selection:text-[#092A31]">
      <CvResultsView state={stored} onUploadAnother={handleUploadAnother} />
    </main>
  );
}
