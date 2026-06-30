import { JourneyStepper } from "@/components/_core/onboarding/journey-stepper";

type JourneyLayoutHeaderProps = {
  activeStep: 1 | 2 | 3;
  showStepper?: boolean;
};

export function JourneyLayoutHeader({
  activeStep,
  showStepper = true,
}: JourneyLayoutHeaderProps) {
  return (
    <div className="w-full px-4 pt-5 sm:px-0 sm:pt-8">
      <JourneyStepper activeStep={activeStep} showSteps={showStepper} />
    </div>
  );
}
