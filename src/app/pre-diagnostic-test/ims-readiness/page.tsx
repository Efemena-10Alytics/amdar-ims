import HowTheImsWorks from "@/components/_core/pre-diagnostic-test/ims-process/how-the-ims-works";
import ImsDiagnostics from "@/components/_core/pre-diagnostic-test/ims-process/ims-diagnostics";

const STEP_COMPONENTS = {
  "how-the-ims-works": HowTheImsWorks,
  "ims-diagnostics": ImsDiagnostics,
} as const;

type ImsReadinessStep = keyof typeof STEP_COMPONENTS;

const ImsReadinessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) => {
  const params = await searchParams;
  const step = (params.step ?? "how-the-ims-works") as ImsReadinessStep;
  const ActiveStepComponent =
    STEP_COMPONENTS[step] ?? STEP_COMPONENTS["how-the-ims-works"];

  return <ActiveStepComponent />;
};

export default ImsReadinessPage;
