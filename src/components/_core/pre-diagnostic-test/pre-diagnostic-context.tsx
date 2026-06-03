"use client";

import { createContext, useContext } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { PreDiagnostic } from "@/features/pre-diagnostic/types";
import type { UserEnrollment } from "@/types/user/enrollment";

export type PreDiagnosticContextValue = Pick<
  UseQueryResult<PreDiagnostic>,
  "data" | "isLoading" | "isError" | "error" | "refetch"
> & {
  cohortId: string | number | null;
  programId: string | number | null;
  enrollment?: UserEnrollment;
};

const PreDiagnosticContext = createContext<PreDiagnosticContextValue | null>(null);

export function PreDiagnosticProvider({
  value,
  children,
}: {
  value: PreDiagnosticContextValue;
  children: React.ReactNode;
}) {
  return (
    <PreDiagnosticContext.Provider value={value}>
      {children}
    </PreDiagnosticContext.Provider>
  );
}

export function usePreDiagnosticData() {
  const context = useContext(PreDiagnosticContext);
  if (!context) {
    throw new Error("usePreDiagnosticData must be used within PreDiagnosticProvider");
  }
  return context;
}
