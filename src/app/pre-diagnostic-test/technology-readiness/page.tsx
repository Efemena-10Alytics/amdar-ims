import PracticalWalkthrough from "@/components/_core/pre-diagnostic-test/technology-readiness/practical-walkthrough";
import TechnologyDiagnostic from "@/components/_core/pre-diagnostic-test/technology-readiness/technology-dianostic";
import TechnologyUseCase from "@/components/_core/pre-diagnostic-test/technology-readiness/technology-use-case";

const STEP_COMPONENTS = {
  "technology-use-case": TechnologyUseCase,
  "practical-walkthrough": PracticalWalkthrough,
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
