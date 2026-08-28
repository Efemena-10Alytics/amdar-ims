"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  hasPendingOnboardingSteps,
  hasPendingPreDiagnosticSteps,
} from "@/features/internship/resolve-enrollment-journey";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { cn } from "@/lib/utils";
import { ProgramPill } from "@/components/_core/shared/program-pill";

const JOURNEY_STEPS = [
  { id: 1, label: "Onboarding", href: "/onboarding" },
  { id: 2, label: "Pre-entry diagnostics", href: "/pre-diagnostic-test" },
  { id: 3, label: "Profile", href: "/dashboard/portfolio" },
] as const;

type JourneyStepperProps = {
  activeStep: 1 | 2 | 3;
  className?: string;
  showSteps?: boolean;
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

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-medium text-[#A9BEC5]">
      {stepId}
    </span>
  );
}

export function JourneyStepper({
  activeStep,
  className,
  showSteps = true,
}: JourneyStepperProps) {
  const { data: enrollment } = useGetUserEnrollment();
  const programTitle = enrollment?.program?.title?.trim();
  const completedJourneySteps = {
    1:
      enrollment != null &&
      !hasPendingOnboardingSteps(enrollment.isOnboardingStepsCompleted),
    2:
      enrollment != null &&
      !hasPendingPreDiagnosticSteps(enrollment.isPreDiagnosticStepsCompleted, {
        enrollmentId: enrollment.id,
      }),
    3: false,
  } as const;

  if (!showSteps) {
    if (!programTitle) return null;

    return (
      <div className={cn("mb-6 flex w-full justify-end", className)}>
        <ProgramPill title={programTitle} />
      </div>
    );
  }

  return (
    <nav
      aria-label="Onboarding progress"
      className={cn(
        "mb-6 flex w-full items-center gap-2 sm:gap-3",
        className,
      )}
    >
      {JOURNEY_STEPS.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted =
          completedJourneySteps[step.id as keyof typeof completedJourneySteps];
        const isClickable = isCompleted && !isActive;
        const stepContent = (
          <>
            <StepBadge
              stepId={step.id}
              activeStep={isCompleted && !isActive ? step.id + 1 : activeStep}
            />
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
          </>
        );

        return (
          <Fragment key={step.id}>
            {isClickable ? (
              <Link
                href={step.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full transition-opacity hover:opacity-80",
                )}
              >
                {stepContent}
              </Link>
            ) : (
              <div className="flex shrink-0 items-center gap-2">{stepContent}</div>
            )}

            {index < JOURNEY_STEPS.length - 1 && (
              <div
                className="hidden h-px w-6 shrink-0 bg-[#C5D5DB] sm:block"
                aria-hidden
              />
            )}
          </Fragment>
        );
      })}

      {programTitle ? (
        <div className="ml-auto shrink-0 pl-2 sm:pl-4">
          <ProgramPill title={programTitle} />
        </div>
      ) : null}
    </nav>
  );
}

export default JourneyStepper;
