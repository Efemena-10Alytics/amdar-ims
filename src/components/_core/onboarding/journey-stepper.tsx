"use client";

import { cn } from "@/lib/utils";

const JOURNEY_STEPS = [
  { id: 1, label: "Onboarding" },
  { id: 2, label: "Pre-entry diagnostics" },
  { id: 3, label: "Profile" },
] as const;

type JourneyStepperProps = {
  activeStep: 1 | 2 | 3;
  className?: string;
};

function StepBadge({
  stepId,
  activeStep,
}: {
  stepId: number;
  activeStep: number;
}) {
  const isActive = stepId === activeStep;
  const isCompleted = stepId < activeStep;

  if (isActive || isCompleted) {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-sm font-semibold text-white">
        {stepId}
      </span>
    );
  }

  if (stepId === 2) {
    return (
      <span className="shrink-0 text-sm font-medium text-[#A9BEC5]">{stepId}</span>
    );
  }

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C5D5DB] text-sm font-semibold text-white">
      {stepId}
    </span>
  );
}

export function JourneyStepper({ activeStep, className }: JourneyStepperProps) {
  return (
    <nav
      aria-label="Onboarding progress"
      className={cn("mb-6 flex w-full max-w-190 items-center gap-3", className)}
    >
      {JOURNEY_STEPS.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = step.id < activeStep;

        return (
          <div key={step.id} className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex shrink-0 items-center gap-2">
              <StepBadge stepId={step.id} activeStep={activeStep} />
              <span
                className={cn(
                  "text-sm whitespace-nowrap sm:text-base",
                  isActive || isCompleted
                    ? "font-semibold text-[#173740]"
                    : "font-medium text-[#A9BEC5]",
                )}
              >
                {step.label}
              </span>
            </div>

            {index < JOURNEY_STEPS.length - 1 && (
              <div
                className="mx-1 hidden min-w-6 flex-1 border-t border-dotted border-[#A9BEC5] sm:block"
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default JourneyStepper;
