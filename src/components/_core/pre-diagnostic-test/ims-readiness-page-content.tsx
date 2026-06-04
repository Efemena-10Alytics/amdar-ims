"use client";

import { useSearchParams } from "next/navigation";
import HowTheImsWorks from "@/components/_core/pre-diagnostic-test/ims-process/how-the-ims-works";
import ImsDiagnostics from "@/components/_core/pre-diagnostic-test/ims-process/ims-diagnostics";

const STEP_COMPONENTS = {
  "how-the-ims-works": HowTheImsWorks,
  "ims-diagnostics": ImsDiagnostics,
} as const;

type ImsReadinessStep = keyof typeof STEP_COMPONENTS;

const ImsReadinessPageContent = () => {
  const searchParams = useSearchParams();
  const step = (searchParams.get("step") ?? "how-the-ims-works") as ImsReadinessStep;
  const ActiveStepComponent =
    STEP_COMPONENTS[step] ?? STEP_COMPONENTS["how-the-ims-works"];

  return <ActiveStepComponent />;
};

export default ImsReadinessPageContent;
