"use client";

import { useQuery } from "@tanstack/react-query";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useEnrollmentSelectionReady } from "@/features/internship/use-enrollment-selection-ready";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";

export type InternshipDetailsProgram = {
  id: number;
  title: string;
};

export type InternshipDetailsCohort = {
  id: number;
  name: string;
};

export type InternshipDetails = {
  /** Null when a specialist is previewing a cohort they are not enrolled in. */
  enrollmentId: number | null;
  /**
   * True when the caller is a specialist servicing this cohort rather than an
   * intern in it. The personal fields below are null in that case — they
   * describe an individual intern, and a cohort preview has no single intern.
   */
  isSpecialistPreview?: boolean;
  program: InternshipDetailsProgram;
  cohort: InternshipDetailsCohort;
  skillLevel: string | null;
  location: string | null;
  gender: string | null;
  findOut: string | null;
  decisionInfluenced: string | null;
  sessionInfluenced: string | null;
  hoursPerWeek: string | null;
};

export type InternshipDetailsApiResponse = {
  success: boolean;
  message: string;
  data: InternshipDetails | null;
};

export const INTERNSHIP_DETAILS_QUERY_KEY = [
  "v3",
  "user",
  "internship-details",
] as const;

export type GetInternshipDetailsParams = {
  program_id?: number | string;
  cohort_id?: number | string;
};

export async function getInternshipDetails(
  params?: GetInternshipDetailsParams,
): Promise<InternshipDetails> {
  const { data } = await axiosInstance.get<InternshipDetailsApiResponse>(
    "v3/user/internship-details",
    {
      params: {
        ...(params?.program_id != null ? { program_id: params.program_id } : {}),
        ...(params?.cohort_id != null ? { cohort_id: params.cohort_id } : {}),
      },
    },
  );

  if (data.success === false || !data.data) {
    throw new Error(
      data.message?.trim() || "Failed to load internship details.",
    );
  }

  return data.data;
}

export function useGetInternshipDetails() {
  const { userId, isAuthReady } = useRequireUserId();
  const { isInternshipSpecialist } = useIsInternshipSpecialist();
  const programId = useEnrollmentSelectionStore((s) => s.programId);
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const isSelectionReady = useEnrollmentSelectionReady();

  // Mirrors useGetUserEnrollment: only specialists switch cohorts, so only they
  // send the pair. Everyone else calls it bare and the API resolves their most
  // recent assignment, exactly as before.
  const hasSelection =
    isInternshipSpecialist && programId != null && cohortId != null;

  const query = useQuery({
    // The pair belongs in the key — without it the panel keeps serving the
    // previously selected cohort's details after the switcher moves.
    queryKey: [
      ...INTERNSHIP_DETAILS_QUERY_KEY,
      hasSelection ? String(programId) : "",
      hasSelection ? String(cohortId) : "",
    ],
    queryFn: () =>
      getInternshipDetails(
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
