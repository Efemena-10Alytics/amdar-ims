"use client";

import { useRouter } from "next/navigation";
import { buildOnboardingStepHref } from "@/features/onboarding/use-get-onboarding";
import type { Onboarding, OnboardingStepKey } from "@/features/onboarding/types";
import { useOnboardingData } from "./onboarding-context";

export function useOnboardingNavigation() {
  const router = useRouter();
  const { data } = useOnboardingData();

  if (!data) {
    throw new Error("Onboarding data is not available");
  }

  const onboarding: Onboarding = data;

  const goToStep = (step: OnboardingStepKey) => {
    router.push(buildOnboardingStepHref(step));
  };

  return { onboarding, goToStep };
}
