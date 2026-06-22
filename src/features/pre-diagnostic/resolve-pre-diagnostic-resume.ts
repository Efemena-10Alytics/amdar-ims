import { isPreDiagnosticEnrollmentStepComplete } from "@/features/internship/use-update-completed-pre-diagnostic";
import { getResumeCareerKnowledgeDiscoveryStep } from "@/features/pre-diagnostic/career-knowledge-discovery-progress";
import { buildCareerKnowledgeDiscoveryHref } from "@/features/pre-diagnostic/career-knowledge-discovery-steps";
import { getResumePracticalWalkthroughStep } from "@/features/pre-diagnostic/practical-walkthrough-progress";
import { buildPracticalWalkthroughHref } from "@/features/pre-diagnostic/practical-walkthrough-steps";
import type { PreDiagnosticStepsCompletedState } from "@/types/user/enrollment";

export type PreDiagnosticResumeOptions = {
  enrollmentId?: number;
  steps?: PreDiagnosticStepsCompletedState;
  careerKnowledgeDiscoveryCount?: number;
  practicalWalkthroughCount?: number;
  currentStep?: string | null;
};

function getStepOptions(
  enrollmentId: number | undefined,
  careerKnowledgeDiscoveryCount: number,
  practicalWalkthroughCount: number,
) {
  return {
    enrollmentId,
    careerKnowledgeDiscoveryCount,
    practicalWalkthroughCount,
  };
}

/** Resume within the career readiness section based on local sub-step progress. */
export function resolveCareerReadinessResumeHref({
  enrollmentId,
  steps,
  careerKnowledgeDiscoveryCount = 2,
  currentStep,
}: PreDiagnosticResumeOptions): string | null {
  const normalizedStep = currentStep?.trim() || "welcome-video";
  const stepOptions = getStepOptions(
    enrollmentId,
    careerKnowledgeDiscoveryCount,
    2,
  );

  const welcomeVideoComplete = isPreDiagnosticEnrollmentStepComplete(
    steps,
    "welcome-video",
    stepOptions,
  );

  if (!welcomeVideoComplete) {
    return normalizedStep === "welcome-video"
      ? null
      : "/pre-diagnostic-test?step=welcome-video";
  }

  const resumeDiscoveryStep = getResumeCareerKnowledgeDiscoveryStep(
    enrollmentId,
    steps,
    careerKnowledgeDiscoveryCount,
    welcomeVideoComplete,
  );

  if (resumeDiscoveryStep) {
    return normalizedStep === resumeDiscoveryStep
      ? null
      : buildCareerKnowledgeDiscoveryHref(resumeDiscoveryStep);
  }

  const careerPathComplete = isPreDiagnosticEnrollmentStepComplete(
    steps,
    "career-path-diagnostics",
    stepOptions,
  );

  if (!careerPathComplete && normalizedStep === "welcome-video") {
    return "/pre-diagnostic-test?step=career-path-diagnostics";
  }

  return null;
}

/** Resume within the technology readiness section based on local sub-step progress. */
export function resolveTechnologyReadinessResumeHref({
  enrollmentId,
  steps,
  practicalWalkthroughCount = 2,
  currentStep,
}: PreDiagnosticResumeOptions): string | null {
  const normalizedStep = currentStep?.trim() || "technology-use-case";
  const stepOptions = getStepOptions(enrollmentId, 2, practicalWalkthroughCount);

  const technologyUseCaseComplete = isPreDiagnosticEnrollmentStepComplete(
    steps,
    "technology-use-case",
    stepOptions,
  );

  if (!technologyUseCaseComplete) {
    return normalizedStep === "technology-use-case"
      ? null
      : "/pre-diagnostic-test/technology-readiness?step=technology-use-case";
  }

  const resumeWalkthroughStep = getResumePracticalWalkthroughStep(
    enrollmentId,
    steps,
    practicalWalkthroughCount,
    technologyUseCaseComplete,
  );

  if (resumeWalkthroughStep) {
    return normalizedStep === resumeWalkthroughStep
      ? null
      : buildPracticalWalkthroughHref(resumeWalkthroughStep);
  }

  const technologyDiagnosticsComplete = isPreDiagnosticEnrollmentStepComplete(
    steps,
    "technology-diagnostics",
    stepOptions,
  );

  if (
    !technologyDiagnosticsComplete &&
    normalizedStep === "technology-use-case"
  ) {
    return "/pre-diagnostic-test/technology-readiness?step=technology-diagnostics";
  }

  return null;
}
