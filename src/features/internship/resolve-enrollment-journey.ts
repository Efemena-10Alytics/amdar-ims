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
import {
  buildPracticalWalkthroughHref,
  isPracticalWalkthroughStep,
} from "@/features/pre-diagnostic/practical-walkthrough-steps";
import type {
  OnboardingStepsCompletedState,
  PreDiagnosticStepsCompletedState,
  UserEnrollment,
} from "@/types/user/enrollment";

/** Cohorts starting on or after this date are sent through onboarding/pre-diagnostic. */
export const ENROLLMENT_JOURNEY_COHORT_START_DATE_CUTOFF = "2026-03-07";

function toDateOnlyUtcMs(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoPrefix = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoPrefix) {
    const [, year, month, day] = isoPrefix;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;

  return Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function getEnrollmentCohortStartDate(
  enrollment: UserEnrollment,
): string | null {
  const startDate = enrollment.cohort?.start_date?.trim();
  return startDate || null;
}

/** Journey redirects run for cohorts with a start date on or after the cutoff. */
export function isEnrollmentJourneyCohortEligible(
  enrollment: UserEnrollment,
): boolean {
  const startDate = getEnrollmentCohortStartDate(enrollment);
  if (!startDate) return false;

  const cohortStartMs = toDateOnlyUtcMs(startDate);
  const cutoffMs = toDateOnlyUtcMs(ENROLLMENT_JOURNEY_COHORT_START_DATE_CUTOFF);
  if (cohortStartMs == null || cutoffMs == null) return false;

  return cohortStartMs >= cutoffMs;
}

function getPreDiagnosticStepRoute(step: string): string | null {
  if (isCareerKnowledgeDiscoveryStep(step)) {
    return buildCareerKnowledgeDiscoveryHref(step);
  }

  if (isPracticalWalkthroughStep(step)) {
    return buildPracticalWalkthroughHref(step);
  }

  const routes: Record<string, string> = {
    "welcome-video": "/pre-diagnostic-test?step=welcome-video",
    "career-path-diagnostics": "/pre-diagnostic-test?step=career-path-diagnostics",
    "technology-use-case":
      "/pre-diagnostic-test/technology-readiness?step=technology-use-case",
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
  if (!isEnrollmentJourneyCohortEligible(enrollment)) return null;

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
