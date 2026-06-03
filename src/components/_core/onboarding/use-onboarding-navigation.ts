"use client";

import { useRouter } from "next/navigation";
import { buildOnboardingStepHref } from "@/features/onboarding/use-get-onboarding";
import type { OnboardingStepKey } from "@/features/onboarding/types";
import { useOnboardingData } from "./onboarding-context";

export function useOnboardingNavigation() {
  const router = useRouter();
  const { data: onboarding } = useOnboardingData();

  const goToStep = (step: OnboardingStepKey) => {
    router.push(buildOnboardingStepHref(step));
  };

  return { onboarding, goToStep };
}
