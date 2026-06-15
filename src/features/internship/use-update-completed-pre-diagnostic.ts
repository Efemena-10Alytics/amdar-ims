import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
  EnrollmentStepStatus,
  PreDiagnosticCareerReadinessStepKey,
  PreDiagnosticImsProcessStepKey,
  PreDiagnosticStepsCompletedState,
  PreDiagnosticStepsCompletedUpdate,
  PreDiagnosticTechnologyReadinessStepKey,
  UpdateEnrollmentStepsPayload,
  UpdateEnrollmentStepsResponse,
} from "@/types/user/enrollment";
import { USER_ENROLLMENT_QUERY_KEY } from "@/features/internship/use-get-user-enrollment";
import { updateEnrollmentOnboardingSteps } from "@/features/internship/use-update-completed-onboarding-step";
import {
  isCareerKnowledgeDiscoveryAsideStepComplete,
  isCareerKnowledgeDiscoveryAsideStepLocked,
} from "@/features/pre-diagnostic/career-knowledge-discovery-progress";
import {
  buildCareerKnowledgeDiscoveryStepKey,
  CAREER_KNOWLEDGE_DISCOVERY_ENROLLMENT_STEP_KEY,
  getCareerKnowledgeDiscoveryStepKeys,
  getLastCareerKnowledgeDiscoveryStepKey,
  isCareerKnowledgeDiscoveryStep,
  parseCareerKnowledgeDiscoveryStepNumber,
} from "@/features/pre-diagnostic/career-knowledge-discovery-steps";
import {
  isPracticalWalkthroughAsideStepComplete,
  isPracticalWalkthroughAsideStepLocked,
} from "@/features/pre-diagnostic/practical-walkthrough-progress";
import {
  buildPracticalWalkthroughStepKey,
  getLastPracticalWalkthroughStepKey,
  getPracticalWalkthroughStepKeys,
  isPracticalWalkthroughStep,
  parsePracticalWalkthroughStepNumber,
  PRACTICAL_WALKTHROUGH_ENROLLMENT_STEP_KEY,
} from "@/features/pre-diagnostic/practical-walkthrough-steps";

export const PRE_DIAGNOSTIC_STEP_KEYS = [
  "welcome-video",
  CAREER_KNOWLEDGE_DISCOVERY_ENROLLMENT_STEP_KEY,
  "career-path-diagnostics",
  "technology-use-case",
  PRACTICAL_WALKTHROUGH_ENROLLMENT_STEP_KEY,
  "technology-diagnostics",
  "how-the-ims-works",
  "ims-diagnostics",
] as const;

export type PreDiagnosticStepKey = (typeof PRE_DIAGNOSTIC_STEP_KEYS)[number];

type PreDiagnosticGroupKey = keyof PreDiagnosticStepsCompletedUpdate;

type PreDiagnosticStepMapping = {
  group: PreDiagnosticGroupKey;
  step:
    | PreDiagnosticCareerReadinessStepKey
    | PreDiagnosticTechnologyReadinessStepKey
    | PreDiagnosticImsProcessStepKey;
};

export const PRE_DIAGNOSTIC_STEP_TO_ENROLLMENT: Record<
  PreDiagnosticStepKey,
  PreDiagnosticStepMapping
> = {
  "welcome-video": { group: "carrerReadiness", step: "welcomeVideo" },
  [CAREER_KNOWLEDGE_DISCOVERY_ENROLLMENT_STEP_KEY]: {
    group: "carrerReadiness",
    step: "careerKnowledgeDiscovery",
  },
  "career-path-diagnostics": {
    group: "carrerReadiness",
    step: "CareerPathDiagnostic",
  },
  "technology-use-case": {
    group: "TechnologyDiagnostic",
    step: "technologyUseCase",
  },
  [PRACTICAL_WALKTHROUGH_ENROLLMENT_STEP_KEY]: {
    group: "TechnologyDiagnostic",
    step: "practicalWalkthrough",
  },
  "technology-diagnostics": {
    group: "TechnologyDiagnostic",
    step: "TechnologyDiagnostic",
  },
  "how-the-ims-works": { group: "imsProcess", step: "HowTheImsWorks" },
  "ims-diagnostics": { group: "imsProcess", step: "imsProcessDiagnostic" },
};

export type PreDiagnosticAsideStepKey =
  | "welcome-video"
  | `career-knowledge-discovery-${number}`
  | "career-path-diagnostics"
  | "technology-use-case"
  | `practical-walkthrough-${number}`
  | "technology-diagnostics"
  | "how-the-ims-works"
  | "ims-diagnostics";

export type PreDiagnosticAsideStepOptions = {
  careerKnowledgeDiscoveryCount?: number;
  practicalWalkthroughCount?: number;
  enrollmentId?: number;
};

/** Aside step keys shown in the pre-diagnostic UI (includes sub-steps without their own API field). */
export function getPreDiagnosticAsideStepKeys({
  careerKnowledgeDiscoveryCount = 2,
  practicalWalkthroughCount = 2,
}: PreDiagnosticAsideStepOptions = {}): PreDiagnosticAsideStepKey[] {
  const discoverySteps = getCareerKnowledgeDiscoveryStepKeys(
    careerKnowledgeDiscoveryCount,
  ) as PreDiagnosticAsideStepKey[];
  const walkthroughSteps = getPracticalWalkthroughStepKeys(
    practicalWalkthroughCount,
  ) as PreDiagnosticAsideStepKey[];

  return [
    "welcome-video",
    ...discoverySteps,
    "career-path-diagnostics",
    "technology-use-case",
    ...walkthroughSteps,
    "technology-diagnostics",
    "how-the-ims-works",
    "ims-diagnostics",
  ];
}

/** @deprecated Use `getPreDiagnosticAsideStepKeys()` */
export const PRE_DIAGNOSTIC_ASIDE_STEP_KEYS = getPreDiagnosticAsideStepKeys();

type PreDiagnosticAsideStepMapping = {
  group: PreDiagnosticGroupKey;
  step:
    | PreDiagnosticCareerReadinessStepKey
    | PreDiagnosticTechnologyReadinessStepKey
    | PreDiagnosticImsProcessStepKey;
};

function getPreDiagnosticAsideStepEnrollmentMapping(
  asideStepKey: string,
  careerKnowledgeDiscoveryCount = 2,
  practicalWalkthroughCount = 2,
): PreDiagnosticAsideStepMapping | null {
  if (asideStepKey === "welcome-video") {
    return { group: "carrerReadiness", step: "welcomeVideo" };
  }

  const discoveryStepNumber =
    parseCareerKnowledgeDiscoveryStepNumber(asideStepKey);
  if (discoveryStepNumber != null) {
    if (discoveryStepNumber === Math.max(careerKnowledgeDiscoveryCount, 1)) {
      return { group: "carrerReadiness", step: "careerKnowledgeDiscovery" };
    }
    return null;
  }

  if (asideStepKey === "career-path-diagnostics") {
    return { group: "carrerReadiness", step: "CareerPathDiagnostic" };
  }

  if (asideStepKey === "technology-use-case") {
    return { group: "TechnologyDiagnostic", step: "technologyUseCase" };
  }

  const walkthroughStepNumber = parsePracticalWalkthroughStepNumber(asideStepKey);
  if (walkthroughStepNumber != null) {
    if (walkthroughStepNumber === Math.max(practicalWalkthroughCount, 1)) {
      return { group: "TechnologyDiagnostic", step: "practicalWalkthrough" };
    }
    return null;
  }

  if (asideStepKey === "technology-diagnostics") {
    return { group: "TechnologyDiagnostic", step: "TechnologyDiagnostic" };
  }

  if (asideStepKey === "how-the-ims-works") {
    return { group: "imsProcess", step: "HowTheImsWorks" };
  }

  if (asideStepKey === "ims-diagnostics") {
    return { group: "imsProcess", step: "imsProcessDiagnostic" };
  }

  return null;
}

function getPreDiagnosticEnrollmentStepStatus(
  steps: PreDiagnosticStepsCompletedState | undefined,
  mapping: PreDiagnosticAsideStepMapping,
): EnrollmentStepStatus | undefined {
  const groupSteps = steps?.[mapping.group];
  if (!groupSteps) return undefined;
  return groupSteps[mapping.step as keyof typeof groupSteps];
}

function getPreDiagnosticStepUnlockAfter(
  asideStepKey: string,
  careerKnowledgeDiscoveryCount = 2,
  practicalWalkthroughCount = 2,
): string[] {
  const discoveryStepNumber =
    parseCareerKnowledgeDiscoveryStepNumber(asideStepKey);
  if (discoveryStepNumber != null) {
    if (discoveryStepNumber === 1) return ["welcome-video"];
    return [buildCareerKnowledgeDiscoveryStepKey(discoveryStepNumber - 2)];
  }

  if (asideStepKey === "career-path-diagnostics") {
    return [getLastCareerKnowledgeDiscoveryStepKey(careerKnowledgeDiscoveryCount)];
  }

  if (asideStepKey === "welcome-video") return [];
  if (asideStepKey === "technology-use-case") return ["career-path-diagnostics"];

  const walkthroughStepNumber = parsePracticalWalkthroughStepNumber(asideStepKey);
  if (walkthroughStepNumber != null) {
    if (walkthroughStepNumber === 1) return ["technology-use-case"];
    return [buildPracticalWalkthroughStepKey(walkthroughStepNumber - 2)];
  }

  if (asideStepKey === "technology-diagnostics") {
    return [getLastPracticalWalkthroughStepKey(practicalWalkthroughCount)];
  }
  if (asideStepKey === "how-the-ims-works") return ["technology-diagnostics"];
  if (asideStepKey === "ims-diagnostics") return ["how-the-ims-works"];

  return [];
}

export function isPreDiagnosticEnrollmentStepComplete(
  steps: PreDiagnosticStepsCompletedState | undefined,
  asideStepKey: string,
  options?: PreDiagnosticAsideStepOptions,
): boolean {
  const careerKnowledgeDiscoveryCount = options?.careerKnowledgeDiscoveryCount ?? 2;
  const practicalWalkthroughCount = options?.practicalWalkthroughCount ?? 2;
  const mapping = getPreDiagnosticAsideStepEnrollmentMapping(
    asideStepKey,
    careerKnowledgeDiscoveryCount,
    practicalWalkthroughCount,
  );

  if (mapping === null) {
    if (isCareerKnowledgeDiscoveryStep(asideStepKey)) {
      return isCareerKnowledgeDiscoveryAsideStepComplete(
        options?.enrollmentId,
        asideStepKey,
        steps,
      );
    }
    if (isPracticalWalkthroughStep(asideStepKey)) {
      return isPracticalWalkthroughAsideStepComplete(
        options?.enrollmentId,
        asideStepKey,
        steps,
      );
    }
    return false;
  }

  return getPreDiagnosticEnrollmentStepStatus(steps, mapping) === "completed";
}

export function isPreDiagnosticAsideStepLocked(
  steps: PreDiagnosticStepsCompletedState | undefined,
  asideStepKey: string,
  options?: PreDiagnosticAsideStepOptions,
): boolean {
  if (isCareerKnowledgeDiscoveryStep(asideStepKey)) {
    return isCareerKnowledgeDiscoveryAsideStepLocked(
      options?.enrollmentId,
      asideStepKey,
      steps,
      isPreDiagnosticEnrollmentStepComplete(steps, "welcome-video", options),
    );
  }

  if (isPracticalWalkthroughStep(asideStepKey)) {
    return isPracticalWalkthroughAsideStepLocked(
      options?.enrollmentId,
      asideStepKey,
      steps,
      isPreDiagnosticEnrollmentStepComplete(steps, "technology-use-case", options),
    );
  }

  const prerequisites = getPreDiagnosticStepUnlockAfter(
    asideStepKey,
    options?.careerKnowledgeDiscoveryCount ?? 2,
    options?.practicalWalkthroughCount ?? 2,
  );

  return prerequisites.some(
    (requiredStep) =>
      !isPreDiagnosticEnrollmentStepComplete(steps, requiredStep, options),
  );
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to update pre-diagnostic step.";
}

export function buildPreDiagnosticStepCompletionPayload(
  step: PreDiagnosticStepKey | string,
  status: EnrollmentStepStatus = "completed",
  options?: PreDiagnosticAsideStepOptions,
): UpdateEnrollmentStepsPayload {
  const asideMapping = getPreDiagnosticAsideStepEnrollmentMapping(
    step,
    options?.careerKnowledgeDiscoveryCount ?? 2,
    options?.practicalWalkthroughCount ?? 2,
  );
  const mapping =
    asideMapping ??
    PRE_DIAGNOSTIC_STEP_TO_ENROLLMENT[step as PreDiagnosticStepKey];

  if (!mapping) {
    throw new Error(`Unknown pre-diagnostic step: ${step}`);
  }

  const { group, step: enrollmentStepKey } = mapping;

  return {
    isPreDiagnosticStepsCompleted: {
      [group]: {
        [enrollmentStepKey]: status,
      },
    },
  };
}

export async function updateCompletedPreDiagnosticStep(
  step: PreDiagnosticStepKey | string,
  status: EnrollmentStepStatus = "completed",
  options?: PreDiagnosticAsideStepOptions,
): Promise<UpdateEnrollmentStepsResponse> {
  return updateEnrollmentOnboardingSteps(
    buildPreDiagnosticStepCompletionPayload(step, status, options),
  );
}

export function useUpdateCompletedPreDiagnostic() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const markPreDiagnosticStepComplete = useCallback(
    async (
      step: PreDiagnosticStepKey | string,
      status: EnrollmentStepStatus = "completed",
      options?: PreDiagnosticAsideStepOptions,
    ) => {
      setIsUpdating(true);
      setErrorMessage("");

      try {
        const result = await updateCompletedPreDiagnosticStep(
          step,
          status,
          options,
        );
        await queryClient.invalidateQueries({ queryKey: USER_ENROLLMENT_QUERY_KEY });
        return result;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [queryClient],
  );

  const updatePreDiagnosticSteps = useCallback(
    async (steps: PreDiagnosticStepsCompletedUpdate) => {
      setIsUpdating(true);
      setErrorMessage("");

      try {
        const result = await updateEnrollmentOnboardingSteps({
          isPreDiagnosticStepsCompleted: steps,
        });
        await queryClient.invalidateQueries({ queryKey: USER_ENROLLMENT_QUERY_KEY });
        return result;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [queryClient],
  );

  return {
    markPreDiagnosticStepComplete,
    updatePreDiagnosticSteps,
    isUpdating,
    errorMessage,
  };
}
