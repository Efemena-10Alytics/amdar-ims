import CohortLead from "@/components/_core/onboarding/cohort-lead";
import InternshipStructureVideo from "@/components/_core/onboarding/internship-structure-video";
import OrientationVideo from "@/components/_core/onboarding/orientation-video";
import IntallationVideo from "@/components/_core/onboarding/intallation-video";
import ReadinessTest from "@/components/_core/onboarding/readiness-test";
import RulesEtiquettes from "@/components/_core/onboarding/rules-etiquettes";

const STEP_COMPONENTS = {
  "orientation-video": OrientationVideo,
  "internship-structure-video": InternshipStructureVideo,
  "cohort-lead": CohortLead,
  "internship-rules": RulesEtiquettes,
  "installation-videos": IntallationVideo,
  "readiness-test": ReadinessTest,
} as const;

type OnboardingStep = keyof typeof STEP_COMPONENTS;

const OnboardingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) => {
  const params = await searchParams;
  const step = (params.step ?? "orientation-video") as OnboardingStep;
  const ActiveStepComponent =
    STEP_COMPONENTS[step] ?? STEP_COMPONENTS["orientation-video"];

  return (
    <div>
      <ActiveStepComponent />
    </div>
  );
};

export default OnboardingPage;
