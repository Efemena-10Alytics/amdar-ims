"use client";

import { useSearchParams } from "next/navigation";
import CohortLead from "@/components/_core/onboarding/cohort-lead";
import InternshipStructureVideo from "@/components/_core/onboarding/internship-structure-video";
import OrientationVideo from "@/components/_core/onboarding/orientation-video";
import IntallationVideo from "@/components/_core/onboarding/intallation-video";
import ReadinessTest from "@/components/_core/onboarding/readiness-test";
import RulesEtiquettes from "@/components/_core/onboarding/rules-etiquettes";
import {
  ONBOARDING_STEP_KEYS,
  type OnboardingStepKey,
} from "@/features/onboarding/types";

const STEP_COMPONENTS: Record<OnboardingStepKey, React.ComponentType> = {
  "orientation-video": OrientationVideo,
  "internship-structure-video": InternshipStructureVideo,
  "cohort-lead": CohortLead,
  "internship-rules": RulesEtiquettes,
  "installation-videos": IntallationVideo,
  "readiness-test": ReadinessTest,
};

function isOnboardingStep(step: string | null): step is OnboardingStepKey {
  return ONBOARDING_STEP_KEYS.includes(step as OnboardingStepKey);
}

const OnboardingPageContent = () => {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const step = isOnboardingStep(stepParam)
    ? stepParam
    : ONBOARDING_STEP_KEYS[0];

  const ActiveStepComponent = STEP_COMPONENTS[step];

  return <ActiveStepComponent />;
};

export default OnboardingPageContent;
