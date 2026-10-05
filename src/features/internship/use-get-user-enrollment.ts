"use client";

import { useQuery } from "@tanstack/react-query";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useEnrollmentSelectionReady } from "@/features/internship/use-enrollment-selection-ready";
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

export type UseGetUserEnrollmentOptions = {
  programId?: number | string | null;
  cohortId?: number | string | null;
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

export function useGetUserEnrollment(options?: UseGetUserEnrollmentOptions) {
  const { userId, isAuthReady } = useRequireUserId();
  const { isInternshipSpecialist } = useIsInternshipSpecialist();
  const storeProgramId = useEnrollmentSelectionStore((s) => s.programId);
  const storeCohortId = useEnrollmentSelectionStore((s) => s.cohortId);

  // Explicit caller IDs (e.g. switcher) win when both are present.
  const hasExplicitSelection =
    options?.programId != null && options?.cohortId != null;
  const programId = hasExplicitSelection
    ? options.programId
    : storeProgramId;
  const cohortId = hasExplicitSelection
    ? options.cohortId
    : storeCohortId;

  // Fallback: specialists use the selection store; everyone else calls without
  // params so the API resolves their most recent assignment.
  const hasSelection =
    hasExplicitSelection ||
    (isInternshipSpecialist && programId != null && cohortId != null);
  const isSelectionReady = useEnrollmentSelectionReady();

  const query = useQuery({
    queryKey: [
      ...USER_ENROLLMENT_QUERY_KEY,
      hasSelection ? String(programId) : "",
      hasSelection ? String(cohortId) : "",
    ],
    queryFn: () =>
      getUserEnrollment(
        hasSelection
          ? { program_id: programId!, cohort_id: cohortId! }
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
