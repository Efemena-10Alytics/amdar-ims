import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import type { OnboardingStepKey } from "@/features/onboarding/types";
import {
  USER_ENROLLMENT_QUERY_KEY,
} from "@/features/internship/use-get-user-enrollment";
import type {
  EnrollmentStepStatus,
  OnboardingEnrollmentStepKey,
  OnboardingStepsCompleted,
  UpdateEnrollmentStepsPayload,
  UpdateEnrollmentStepsResponse,
} from "@/types/user/enrollment";

export const ONBOARDING_STEP_TO_ENROLLMENT_KEY: Record<
  OnboardingStepKey,
  OnboardingEnrollmentStepKey
> = {
  "orientation-video": "orientationVideo",
  "internship-structure-video": "internshipStructureVideo",
  "cohort-lead": "meetCohortLead",
  "internship-rules": "rulesAndEtiquettes",
  "installation-videos": "installationVideo",
  "readiness-test": "readinessTest",
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to update onboarding step.";
}

export function buildOnboardingStepCompletionPayload(
  step: OnboardingStepKey,
  status: EnrollmentStepStatus = "completed",
): UpdateEnrollmentStepsPayload {
  const enrollmentStepKey = ONBOARDING_STEP_TO_ENROLLMENT_KEY[step];

  return {
    isOnboardingStepsCompleted: {
      [enrollmentStepKey]: status,
    },
  };
}

export async function updateEnrollmentOnboardingSteps(
  payload: UpdateEnrollmentStepsPayload,
): Promise<UpdateEnrollmentStepsResponse> {
  const { data } = await axiosInstance.put<UpdateEnrollmentStepsResponse>(
    "v3/user/enrollment/steps",
    payload,
  );

  if (data.success === false || !data.data) {
    throw new Error(data.message?.trim() || "Failed to update onboarding step.");
  }

  return data;
}

export async function updateCompletedOnboardingStep(
  step: OnboardingStepKey,
  status: EnrollmentStepStatus = "completed",
): Promise<UpdateEnrollmentStepsResponse> {
  return updateEnrollmentOnboardingSteps(
    buildOnboardingStepCompletionPayload(step, status),
  );
}

export function useUpdateCompletedOnboardingStep() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const markOnboardingStepComplete = useCallback(
    async (
      step: OnboardingStepKey,
      status: EnrollmentStepStatus = "completed",
    ) => {
      setIsUpdating(true);
      setErrorMessage("");

      try {
        const result = await updateCompletedOnboardingStep(step, status);
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

  const updateOnboardingSteps = useCallback(
    async (steps: OnboardingStepsCompleted) => {
      setIsUpdating(true);
      setErrorMessage("");

      try {
        const result = await updateEnrollmentOnboardingSteps({
          isOnboardingStepsCompleted: steps,
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
    markOnboardingStepComplete,
    updateOnboardingSteps,
    isUpdating,
    errorMessage,
  };
}
