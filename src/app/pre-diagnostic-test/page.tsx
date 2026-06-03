import CareerCohortLead from "@/components/_core/pre-diagnostic-test/career-readiness/career-cohort-lead";
import CareerInternshipStructureVideo from "@/components/_core/pre-diagnostic-test/career-readiness/career-internship-structure-video";
import CareerPathDiagnostic from "@/components/_core/pre-diagnostic-test/career-readiness/career-path-diagnostic";
import WelcomeVideo from "@/components/_core/pre-diagnostic-test/career-readiness/welcome-video";

const STEP_COMPONENTS = {
  "welcome-video": WelcomeVideo,
  "internship-structure-video": CareerInternshipStructureVideo,
  "cohort-lead": CareerCohortLead,
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
