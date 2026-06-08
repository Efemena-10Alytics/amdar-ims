import { buildOnboardingStepHref } from "@/features/onboarding/use-get-onboarding";
import { ONBOARDING_STEP_KEYS } from "@/features/onboarding/types";
import { isOnboardingEnrollmentStepComplete } from "@/features/internship/use-update-completed-onboarding-step";
import {
  getPreDiagnosticAsideStepKeys,
  isPreDiagnosticEnrollmentStepComplete,
} from "@/features/internship/use-update-completed-pre-diagnostic";
import {
  buildCareerKnowledgeDiscoveryHref,
  isCareerKnowledgeDiscoveryStep,
} from "@/features/pre-diagnostic/career-knowledge-discovery-steps";
import type {
  OnboardingStepsCompletedState,
  PreDiagnosticStepsCompletedState,
  UserEnrollment,
} from "@/types/user/enrollment";

/** Reads cohort version from nested cohort or enrollment root (API shape varies). */
export function getEnrollmentCohortVersion(
  enrollment: UserEnrollment,
): string | number | null | undefined {
  const fromCohort = enrollment.cohort?.version;
  if (fromCohort != null) return fromCohort;
  return enrollment.version;
}

/** Journey redirects run only when the cohort has a non-null version assigned. */
export function hasEnrollmentJourneyVersion(enrollment: UserEnrollment): boolean {
  return getEnrollmentCohortVersion(enrollment) != null;
}

function getPreDiagnosticStepRoute(step: string): string | null {
  if (isCareerKnowledgeDiscoveryStep(step)) {
    return buildCareerKnowledgeDiscoveryHref(step);
  }

  const routes: Record<string, string> = {
    "welcome-video": "/pre-diagnostic-test?step=welcome-video",
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

  return routes[step] ?? null;
}

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
  return getPreDiagnosticAsideStepKeys().some(
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
  for (const step of getPreDiagnosticAsideStepKeys()) {
    if (!isPreDiagnosticEnrollmentStepComplete(steps, step)) {
      return getPreDiagnosticStepRoute(step);
    }
  }
  return null;
}

/** Returns the next journey URL if onboarding or pre-diagnostic work remains. */
export function resolveEnrollmentJourneyRedirect(
  enrollment: UserEnrollment,
): string | null {
  if (!hasEnrollmentJourneyVersion(enrollment)) return null;

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
