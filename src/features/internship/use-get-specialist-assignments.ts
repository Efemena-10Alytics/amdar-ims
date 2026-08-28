"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type {
  SpecialistAssignmentsApiResponse,
  SpecialistCohortProgramAssignment,
} from "@/types/internship-program/specialist-assignment";
import { normalizeSpecialistAssignments } from "@/types/internship-program/specialist-assignment";

export const SPECIALIST_ASSIGNMENTS_QUERY_KEY = [
  "v3",
  "specialist",
  "assignments",
] as const;

export async function getSpecialistAssignments(): Promise<
  SpecialistCohortProgramAssignment[]
> {
  const { data } = await axiosInstance.get<SpecialistAssignmentsApiResponse>(
    "v3/specialist/assignments",
  );

  if (data.success === false) {
    throw new Error(
      data.message?.trim() || "Failed to load specialist assignments.",
    );
  }

  return normalizeSpecialistAssignments(data.data);
}

/**
 * The endpoint sits behind `specialist.active`, which requires an assignment
 * row. A user carrying the `internship-specialist` staff slug with no such row
 * gets a 403 — a configuration state, not a transient failure, so callers fall
 * back to the enrollment-derived list rather than showing an empty switcher.
 */
export function isSpecialistAssignmentsForbidden(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403;
}

export function useGetSpecialistAssignments() {
  const { userId, isAuthReady } = useRequireUserId();
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();

  const query = useQuery({
    queryKey: SPECIALIST_ASSIGNMENTS_QUERY_KEY,
    queryFn: getSpecialistAssignments,
    enabled:
      !!apiBaseURL &&
      isAuthReady &&
      isRoleReady &&
      isInternshipSpecialist &&
      userId != null &&
      userId !== "",
    // Retrying a 403 just delays the fallback.
    retry: (failureCount, error) =>
      !isSpecialistAssignmentsForbidden(error) && failureCount < 2,
  });

  return {
    ...query,
    isForbidden: isSpecialistAssignmentsForbidden(query.error),
  };
}
