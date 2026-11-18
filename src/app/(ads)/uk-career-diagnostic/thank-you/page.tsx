"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  clearDiagnosticState,
  getDiagnosticStateSnapshot,
  subscribeDiagnosticState,
} from "../data";
import { ResultsView } from "../_components/results-view";

export default function UkCareerDiagnosticThankYouPage() {
  const router = useRouter();
  const stored = useSyncExternalStore(
    subscribeDiagnosticState,
    getDiagnosticStateSnapshot,
    () => undefined,
  );

  useEffect(() => {
    if (stored === null) {
      router.replace("/uk-career-diagnostic");
    }
  }, [router, stored]);

  const handleRetake = () => {
    clearDiagnosticState();
    router.push("/uk-career-diagnostic");
  };

  if (!stored) {
    return (
      <main className="uk-diag-page flex min-h-screen items-center justify-center px-4 text-[#C7D5D6]">
        <p className="text-sm font-medium">Loading your diagnostic report...</p>
      </main>
    );
  }

  return (
    <main className="uk-diag-page has-sticky text-[16px] sm:text-[17px] antialiased selection:bg-[#FFE082] selection:text-[#092A31]">
      <ResultsView
        targetRole={stored.targetRole}
        answers={stored.answers}
        lead={stored.lead}
        onRetake={handleRetake}
      />
    </main>
  );
}
