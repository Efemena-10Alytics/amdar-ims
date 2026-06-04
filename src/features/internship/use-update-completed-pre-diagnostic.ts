import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
  EnrollmentStepStatus,
  PreDiagnosticCareerReadinessStepKey,
  PreDiagnosticImsProcessStepKey,
  PreDiagnosticStepsCompletedUpdate,
  PreDiagnosticTechnologyReadinessStepKey,
  UpdateEnrollmentStepsPayload,
  UpdateEnrollmentStepsResponse,
} from "@/types/user/enrollment";
import { USER_ENROLLMENT_QUERY_KEY } from "@/features/internship/use-get-user-enrollment";
import { updateEnrollmentOnboardingSteps } from "@/features/internship/use-update-completed-onboarding-step";

export const PRE_DIAGNOSTIC_STEP_KEYS = [
  "welcome-video",
  "career-knowledge-discovery-2",
  "career-path-diagnostics",
  "technology-use-case",
  "practical-walkthrough-2",
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
  "career-knowledge-discovery-2": {
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
  "practical-walkthrough-2": {
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
  step: PreDiagnosticStepKey,
  status: EnrollmentStepStatus = "completed",
): UpdateEnrollmentStepsPayload {
  const { group, step: enrollmentStepKey } = PRE_DIAGNOSTIC_STEP_TO_ENROLLMENT[step];

  return {
    isPreDiagnosticStepsCompleted: {
      [group]: {
        [enrollmentStepKey]: status,
      },
    },
  };
}

export async function updateCompletedPreDiagnosticStep(
  step: PreDiagnosticStepKey,
  status: EnrollmentStepStatus = "completed",
): Promise<UpdateEnrollmentStepsResponse> {
  return updateEnrollmentOnboardingSteps(
    buildPreDiagnosticStepCompletionPayload(step, status),
  );
}

export function useUpdateCompletedPreDiagnostic() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const markPreDiagnosticStepComplete = useCallback(
    async (
      step: PreDiagnosticStepKey,
      status: EnrollmentStepStatus = "completed",
    ) => {
      setIsUpdating(true);
      setErrorMessage("");

      try {
        const result = await updateCompletedPreDiagnosticStep(step, status);
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
