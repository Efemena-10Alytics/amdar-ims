"use client";

import { useSearchParams } from "next/navigation";
import CareerKnowledgeDiscovery from "@/components/_core/pre-diagnostic-test/career-readiness/career-knowledge-discovery";
import CareerPathDiagnostic from "@/components/_core/pre-diagnostic-test/career-readiness/career-path-diagnostic";
import WelcomeVideo from "@/components/_core/pre-diagnostic-test/career-readiness/welcome-video";
import { isCareerKnowledgeDiscoveryStep } from "@/features/pre-diagnostic/career-knowledge-discovery-steps";

const STEP_COMPONENTS = {
  "welcome-video": WelcomeVideo,
  "career-path-diagnostics": CareerPathDiagnostic,
} as const;

type CareerReadinessStep = keyof typeof STEP_COMPONENTS;

const CareerReadinessPageContent = () => {
  const searchParams = useSearchParams();
  const step = searchParams.get("step") ?? "welcome-video";

  if (isCareerKnowledgeDiscoveryStep(step)) {
    return <CareerKnowledgeDiscovery />;
  }

  const ActiveStepComponent =
    STEP_COMPONENTS[step as CareerReadinessStep] ?? STEP_COMPONENTS["welcome-video"];

  return <ActiveStepComponent />;
};

export default CareerReadinessPageContent;
