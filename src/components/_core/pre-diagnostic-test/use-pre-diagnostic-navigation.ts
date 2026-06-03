"use client";

import { usePreDiagnosticData } from "./pre-diagnostic-context";

export function usePreDiagnosticNavigation() {
  const { data: preDiagnostic } = usePreDiagnosticData();

  return { preDiagnostic };
}
