"use client";

import { useSearchParams } from "next/navigation";
import PracticalWalkthrough from "@/components/_core/pre-diagnostic-test/technology-readiness/practical-walkthrough";
import TechnologyDiagnostic from "@/components/_core/pre-diagnostic-test/technology-readiness/technology-dianostic";
import TechnologyUseCase from "@/components/_core/pre-diagnostic-test/technology-readiness/technology-use-case";
import { isPracticalWalkthroughStep } from "@/features/pre-diagnostic/practical-walkthrough-steps";

const STEP_COMPONENTS = {
  "technology-use-case": TechnologyUseCase,
  "technology-diagnostics": TechnologyDiagnostic,
} as const;

type TechnologyReadinessStep = keyof typeof STEP_COMPONENTS;

const TechnologyReadinessPageContent = () => {
  const searchParams = useSearchParams();
  const step = searchParams.get("step") ?? "technology-use-case";

  if (isPracticalWalkthroughStep(step)) {
    return <PracticalWalkthrough />;
  }

  const ActiveStepComponent =
    STEP_COMPONENTS[step as TechnologyReadinessStep] ??
    STEP_COMPONENTS["technology-use-case"];

  return <ActiveStepComponent />;
};

export default TechnologyReadinessPageContent;
