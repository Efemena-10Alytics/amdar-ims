"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import { USER_ENROLLMENT_QUERY_KEY } from "@/features/internship/use-get-user-enrollment";
import type { UserEnrollment } from "@/types/user/enrollment";

type CompleteAllEnrollmentResponse = {
  success: boolean;
  message: string;
  data: UserEnrollment | null;
};

export type CompleteAllEnrollmentParams = {
  programId: number | string;
  cohortId: number | string;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to complete entry setup.";
}

/**
 * PUT /api/v3/user/enrollment/complete-all?programId=&cohortId=
 */
export async function completeAllEnrollmentSteps(
  params: CompleteAllEnrollmentParams,
): Promise<CompleteAllEnrollmentResponse> {
  const { data } = await axiosInstance.put<CompleteAllEnrollmentResponse>(
    "v3/user/enrollment/complete-all",
    undefined,
    {
      params: {
        programId: params.programId,
        cohortId: params.cohortId,
      },
    },
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to complete entry setup.");
  }

  return data;
}

export function useSkipEntrySetup() {
  const queryClient = useQueryClient();
  const [isSkipping, setIsSkipping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const skipEntrySetup = useCallback(
    async (params: CompleteAllEnrollmentParams) => {
      setIsSkipping(true);
      setErrorMessage("");

      try {
        const result = await completeAllEnrollmentSteps(params);
        await queryClient.invalidateQueries({
          queryKey: USER_ENROLLMENT_QUERY_KEY,
        });
        return result;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsSkipping(false);
      }
    },
    [queryClient],
  );

  return {
    skipEntrySetup,
    isSkipping,
    errorMessage,
  };
}
