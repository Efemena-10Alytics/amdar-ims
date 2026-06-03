"use client";

import { useSearchParams } from "next/navigation";
import CareerKnowledgeDiscovery1 from "@/components/_core/pre-diagnostic-test/career-readiness/career-knowledge-discovery-1";
import CareerKnowledgeDiscovery2 from "@/components/_core/pre-diagnostic-test/career-readiness/career-knowledge-discovery-2";
import CareerPathDiagnostic from "@/components/_core/pre-diagnostic-test/career-readiness/career-path-diagnostic";
import WelcomeVideo from "@/components/_core/pre-diagnostic-test/career-readiness/welcome-video";

const STEP_COMPONENTS = {
  "welcome-video": WelcomeVideo,
  "career-knowledge-discovery-1": CareerKnowledgeDiscovery1,
  "career-knowledge-discovery-2": CareerKnowledgeDiscovery2,
  "career-path-diagnostics": CareerPathDiagnostic,
} as const;

type CareerReadinessStep = keyof typeof STEP_COMPONENTS;

const CareerReadinessPageContent = () => {
  const searchParams = useSearchParams();
  const step = (searchParams.get("step") ?? "welcome-video") as CareerReadinessStep;
  const ActiveStepComponent =
    STEP_COMPONENTS[step] ?? STEP_COMPONENTS["welcome-video"];

  return <ActiveStepComponent />;
};

export default CareerReadinessPageContent;
