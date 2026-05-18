import CareerCurriculum from "@/components/_core/pre-diagnostic-test/career-readiness/career-curriculum";
import CareerPathDiagnostic from "@/components/_core/pre-diagnostic-test/career-readiness/career-path-diagnostic";
import WelcomeVideo from "@/components/_core/pre-diagnostic-test/career-readiness/welcome-video";

const STEP_COMPONENTS = {
  "welcome-video": WelcomeVideo,
  "career-curriculum": CareerCurriculum,
  "career-path-diagnostics": CareerPathDiagnostic,
} as const;

type CareerReadinessStep = keyof typeof STEP_COMPONENTS;

const PreDiagnosticTestPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) => {
  const params = await searchParams;
  const step = (params.step ?? "welcome-video") as CareerReadinessStep;
  const ActiveStepComponent =
    STEP_COMPONENTS[step] ?? STEP_COMPONENTS["welcome-video"];

  return <ActiveStepComponent />;
};

export default PreDiagnosticTestPage;
