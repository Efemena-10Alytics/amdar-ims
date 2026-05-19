import NameYourBuddy from "@/components/_core/setup/name-your-buddy";

const STEP_COMPONENTS = {
  "name-your-buddy": NameYourBuddy,
} as const;

type SetupStep = keyof typeof STEP_COMPONENTS;

const SetupPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) => {
  const params = await searchParams;
  const step = (params.step ?? "name-your-buddy") as SetupStep;
  const ActiveStepComponent =
    STEP_COMPONENTS[step] ?? STEP_COMPONENTS["name-your-buddy"];

  return <ActiveStepComponent />;
};

export default SetupPage;
