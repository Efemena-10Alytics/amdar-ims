import PracticalWalkthrough1 from "@/components/_core/pre-diagnostic-test/technology-readiness/practical-walkthrough-1";
import PracticalWalkthrough2 from "@/components/_core/pre-diagnostic-test/technology-readiness/practical-walkthrough-2";
import TechnologyDiagnostic from "@/components/_core/pre-diagnostic-test/technology-readiness/technology-dianostic";
import TechnologyUseCase from "@/components/_core/pre-diagnostic-test/technology-readiness/technology-use-case";

const STEP_COMPONENTS = {
  "technology-use-case": TechnologyUseCase,
  "practical-walkthrough-1": PracticalWalkthrough1,
  "practical-walkthrough-2": PracticalWalkthrough2,
  "technology-diagnostics": TechnologyDiagnostic,
} as const;

type TechnologyReadinessStep = keyof typeof STEP_COMPONENTS;

const TechnologyReadinessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) => {
  const params = await searchParams;
  const step = (params.step ?? "technology-use-case") as TechnologyReadinessStep;
  const ActiveStepComponent =
    STEP_COMPONENTS[step] ?? STEP_COMPONENTS["technology-use-case"];

  return <ActiveStepComponent />;
};

export default TechnologyReadinessPage;
