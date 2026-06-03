"use client";

import { createContext, useContext } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Onboarding } from "@/features/onboarding/types";
import type { UserEnrollment } from "@/types/user/enrollment";

export type OnboardingContextValue = Pick<
  UseQueryResult<Onboarding>,
  "data" | "isLoading" | "isError" | "error" | "refetch"
> & {
  cohortId: string | number | null;
  programId: string | number | null;
  enrollment?: UserEnrollment;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({
  value,
  children,
}: {
  value: OnboardingContextValue;
  children: React.ReactNode;
}) {
  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboardingData() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingData must be used within OnboardingProvider");
  }
  return context;
}
