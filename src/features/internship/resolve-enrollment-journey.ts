import { buildOnboardingStepHref } from "@/features/onboarding/use-get-onboarding";
import { ONBOARDING_STEP_KEYS } from "@/features/onboarding/types";
import { isOnboardingEnrollmentStepComplete } from "@/features/internship/use-update-completed-onboarding-step";
import {
  isPreDiagnosticEnrollmentStepComplete,
  PRE_DIAGNOSTIC_ASIDE_STEP_KEYS,
  type PreDiagnosticAsideStepKey,
} from "@/features/internship/use-update-completed-pre-diagnostic";
import type {
  EnrollmentCohort,
  OnboardingStepsCompletedState,
  PreDiagnosticStepsCompletedState,
  UserEnrollment,
} from "@/types/user/enrollment";

/** Journey redirects run only when the cohort has a non-null version assigned. */
export function hasEnrollmentJourneyVersion(
  cohort: EnrollmentCohort | undefined,
): boolean {
  return cohort?.version != null;
}

const PRE_DIAGNOSTIC_STEP_ROUTES: Record<PreDiagnosticAsideStepKey, string> = {
  "welcome-video": "/pre-diagnostic-test?step=welcome-video",
  "career-knowledge-discovery-1":
    "/pre-diagnostic-test?step=career-knowledge-discovery-1",
  "career-knowledge-discovery-2":
    "/pre-diagnostic-test?step=career-knowledge-discovery-2",
  "career-path-diagnostics": "/pre-diagnostic-test?step=career-path-diagnostics",
  "technology-use-case":
    "/pre-diagnostic-test/technology-readiness?step=technology-use-case",
  "practical-walkthrough-1":
    "/pre-diagnostic-test/technology-readiness?step=practical-walkthrough-1",
  "practical-walkthrough-2":
    "/pre-diagnostic-test/technology-readiness?step=practical-walkthrough-2",
  "technology-diagnostics":
    "/pre-diagnostic-test/technology-readiness?step=technology-diagnostics",
  "how-the-ims-works": "/pre-diagnostic-test/ims-readiness?step=how-the-ims-works",
  "ims-diagnostics": "/pre-diagnostic-test/ims-readiness?step=ims-diagnostics",
};

export function hasPendingOnboardingSteps(
  steps: OnboardingStepsCompletedState | undefined,
): boolean {
  return ONBOARDING_STEP_KEYS.some(
    (step) => !isOnboardingEnrollmentStepComplete(steps, step),
  );
}

export function hasPendingPreDiagnosticSteps(
  steps: PreDiagnosticStepsCompletedState | undefined,
): boolean {
  return PRE_DIAGNOSTIC_ASIDE_STEP_KEYS.some(
    (step) => !isPreDiagnosticEnrollmentStepComplete(steps, step),
  );
}

export function getFirstPendingOnboardingHref(
  steps: OnboardingStepsCompletedState | undefined,
): string | null {
  for (const step of ONBOARDING_STEP_KEYS) {
    if (!isOnboardingEnrollmentStepComplete(steps, step)) {
      return buildOnboardingStepHref(step);
    }
  }
  return null;
}

export function getFirstPendingPreDiagnosticHref(
  steps: PreDiagnosticStepsCompletedState | undefined,
): string | null {
  for (const step of PRE_DIAGNOSTIC_ASIDE_STEP_KEYS) {
    if (!isPreDiagnosticEnrollmentStepComplete(steps, step)) {
      return PRE_DIAGNOSTIC_STEP_ROUTES[step];
    }
  }
  return null;
}

/** Returns the next journey URL if onboarding or pre-diagnostic work remains. */
export function resolveEnrollmentJourneyRedirect(
  enrollment: UserEnrollment,
): string | null {
  if (!hasEnrollmentJourneyVersion(enrollment.cohort)) return null;

  const onboardingHref = getFirstPendingOnboardingHref(
    enrollment.isOnboardingStepsCompleted,
  );
  if (onboardingHref) return onboardingHref;

  const preDiagnosticHref = getFirstPendingPreDiagnosticHref(
    enrollment.isPreDiagnosticStepsCompleted,
  );
  if (preDiagnosticHref) return preDiagnosticHref;

  return null;
}
