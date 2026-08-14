"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";
import type {
  UserEnrollment,
  UserEnrollmentApiResponse,
} from "@/types/user/enrollment";

export const USER_ENROLLMENT_QUERY_KEY = ["v3", "user", "enrollment"] as const;

export type GetUserEnrollmentParams = {
  program_id?: number | string;
  cohort_id?: number | string;
};

export async function getUserEnrollment(
  params?: GetUserEnrollmentParams,
): Promise<UserEnrollment> {
  const { data } = await axiosInstance.get<UserEnrollmentApiResponse>(
    "v3/user/enrollment",
    {
      params: {
        ...(params?.program_id != null ? { program_id: params.program_id } : {}),
        ...(params?.cohort_id != null ? { cohort_id: params.cohort_id } : {}),
      },
    },
  );

  if (data.success === false || !data.data) {
    throw new Error(data.message?.trim() || "Failed to load enrollment.");
  }

  return data.data;
}

export function useGetUserEnrollment() {
  const { userId, isAuthReady } = useRequireUserId();
  const programId = useEnrollmentSelectionStore((s) => s.programId);
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const hasSelection = programId != null && cohortId != null;
  const [isSelectionReady, setIsSelectionReady] = useState(() =>
    useEnrollmentSelectionStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (useEnrollmentSelectionStore.persist.hasHydrated()) {
      setIsSelectionReady(true);
      return;
    }

    return useEnrollmentSelectionStore.persist.onFinishHydration(() => {
      setIsSelectionReady(true);
    });
  }, []);

  const query = useQuery({
    queryKey: [
      ...USER_ENROLLMENT_QUERY_KEY,
      hasSelection ? String(programId) : "",
      hasSelection ? String(cohortId) : "",
    ],
    queryFn: () =>
      getUserEnrollment(
        hasSelection
          ? { program_id: programId, cohort_id: cohortId }
          : undefined,
      ),
    enabled:
      !!apiBaseURL &&
      isAuthReady &&
      isSelectionReady &&
      userId != null &&
      userId !== "",
  });

  return {
    ...query,
    isAuthReady,
  };
}

/** @deprecated Use `useGetUserEnrollment` */
export const useGetUserPrograms = useGetUserEnrollment;
