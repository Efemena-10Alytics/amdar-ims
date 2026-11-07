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
import { isBridgepathEnrollment } from "@/features/internship/is-bridgepath-cohort";
import { isTenAlyticsEnrollment } from "@/features/internship/is-10alytics-cohort";
import type {
  OnboardingStepsCompletedState,
  PreDiagnosticStepsCompletedState,
  UserEnrollment,
} from "@/types/user/enrollment";

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

/** Date-only UTC milliseconds so the viewer's timezone does not shift the day. */
function toDateOnlyUtcMs(value: string | null | undefined): number | null {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  const isoPrefix = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoPrefix) {
    const [, year, month, day] = isoPrefix;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;

  return Date.UTC(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
    parsed.getUTCDate(),
  );
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function todayUtcMs(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/**
 * Journey redirects open the calendar day before the cohort starts.
 * The date comes from `cohort.start_date` on GET /v3/user/enrollment.
 */
export function isEnrollmentJourneyCohortEligible(
  enrollment: UserEnrollment,
): boolean {
  const startDate = enrollment.cohort?.start_date;
  const startMs = toDateOnlyUtcMs(startDate);
  if (startMs == null) return false;
  return todayUtcMs() >= startMs - ONE_DAY_MS;
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
    "career-path-diagnostics":
      "/pre-diagnostic-test?step=career-path-diagnostics",
    "technology-use-case":
      "/pre-diagnostic-test/technology-readiness?step=technology-use-case",
    "technology-diagnostics":
      "/pre-diagnostic-test/technology-readiness?step=technology-diagnostics",
    "how-the-ims-works":
      "/pre-diagnostic-test/ims-readiness?step=how-the-ims-works",
    "ims-diagnostics":
      "/pre-diagnostic-test/ims-readiness?step=ims-diagnostics",
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

/** Whether this enrollment is a specialist looking at someone else's cohort. */
export function isSpecialistPreviewEnrollment(
  enrollment: Pick<UserEnrollment, "is_specialist_preview"> | null | undefined,
): boolean {
  return enrollment?.is_specialist_preview === true;
}

/** Returns the next journey URL if onboarding or pre-diagnostic work remains. */
export function resolveEnrollmentJourneyRedirect(
  enrollment: UserEnrollment,
  options?: {
    careerKnowledgeDiscoveryCount?: number;
    practicalWalkthroughCount?: number;
  },
): string | null {
  // Previewing a serviced cohort: no personal onboarding/pre-diagnostic to finish.
  // Specialists on their own enrollment are not preview and still get redirected.
  if (isSpecialistPreviewEnrollment(enrollment)) return null;

  // 10Alytics cohorts join at the emerging stage, so they skip onboarding
  // and the pre-diagnostic journey.
  if (isTenAlyticsEnrollment(enrollment)) return null;

  // Bridgepath cohorts do not go through entry setup.
  if (isBridgepathEnrollment(enrollment)) return null;

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
