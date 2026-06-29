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

/**
 * Cohort IDs that must complete onboarding/pre-diagnostic before dashboard access.
 */
export const ENROLLMENT_JOURNEY_COHORT_IDS = [38, 43] as const;

const ENROLLMENT_JOURNEY_COHORT_ID_SET = new Set<number>(
  ENROLLMENT_JOURNEY_COHORT_IDS,
);

function pickCohortId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function getEnrollmentCohortId(
  enrollment: UserEnrollment,
): number | null {
  return (
    pickCohortId(enrollment.cohort_id) ?? pickCohortId(enrollment.cohort?.id)
  );
}

/** Journey redirects run only for enrollments in configured cohort IDs. */
export function isEnrollmentJourneyCohortEligible(
  enrollment: UserEnrollment,
): boolean {
  const cohortId = getEnrollmentCohortId(enrollment);
  if (cohortId == null) return false;
  return ENROLLMENT_JOURNEY_COHORT_ID_SET.has(cohortId);
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
  options?: {
    enrollmentId?: number;
    careerKnowledgeDiscoveryCount?: number;
    practicalWalkthroughCount?: number;
  },
): boolean {
  return getPreDiagnosticAsideStepKeys(options).some(
    (step) => !isPreDiagnosticEnrollmentStepComplete(steps, step, options),
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
  options?: {
    enrollmentId?: number;
    careerKnowledgeDiscoveryCount?: number;
    practicalWalkthroughCount?: number;
  },
): string | null {
  for (const step of getPreDiagnosticAsideStepKeys(options)) {
    if (!isPreDiagnosticEnrollmentStepComplete(steps, step, options)) {
      return getPreDiagnosticStepRoute(step);
    }
  }
  return null;
}

/** Returns whether the user has joined the WhatsApp community for their cohort. */
export function isEnrollmentWhatsappVerified(
  enrollment?: Pick<UserEnrollment, "isVerifiedWhatsapp"> | null,
): boolean {
  return enrollment?.isVerifiedWhatsapp === true;
}

export const WHATSAPP_COMMUNITY_TOAST_MESSAGE =
  "Please click Join Our community in the sidebar to continue to pre-diagnostic.";

export function buildWhatsappRequiredOnboardingHref(): string {
  return `${buildOnboardingStepHref("readiness-test")}&whatsapp=required`;
}

/** Returns the next journey URL if onboarding or pre-diagnostic work remains. */
export function resolveEnrollmentJourneyRedirect(
  enrollment: UserEnrollment,
  options?: {
    careerKnowledgeDiscoveryCount?: number;
    practicalWalkthroughCount?: number;
  },
): string | null {
  if (!isEnrollmentJourneyCohortEligible(enrollment)) return null;

  const onboardingHref = getFirstPendingOnboardingHref(
    enrollment.isOnboardingStepsCompleted,
  );
  if (onboardingHref) return onboardingHref;

  if (!isEnrollmentWhatsappVerified(enrollment)) {
    return buildWhatsappRequiredOnboardingHref();
  }

  const preDiagnosticHref = getFirstPendingPreDiagnosticHref(
    enrollment.isPreDiagnosticStepsCompleted,
    {
      enrollmentId: enrollment.id,
      careerKnowledgeDiscoveryCount: options?.careerKnowledgeDiscoveryCount,
      practicalWalkthroughCount: options?.practicalWalkthroughCount,
    },
  );
  if (preDiagnosticHref) return preDiagnosticHref;

  return null;
}
