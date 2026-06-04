"use client";

import type { PreDiagnostic } from "@/features/pre-diagnostic/types";
import { usePreDiagnosticData } from "./pre-diagnostic-context";

export function usePreDiagnosticNavigation() {
  const { data } = usePreDiagnosticData();

  if (!data) {
    throw new Error("Pre-diagnostic data is not available");
  }

  const preDiagnostic: PreDiagnostic = data;

  return { preDiagnostic };
}
