"use client";

import { useMemo } from "react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useGetSpecialistAssignments } from "@/features/internship/use-get-specialist-assignments";
import { useGetUserInternshipPrograms } from "@/features/internship/use-get-user-internship-programs";
import {
  optionsFromAssignments,
  optionsFromUserCohorts,
  type EnrollmentOption,
} from "@/features/internship/enrollment-options";

/**
 * The (program, cohort) pairs a specialist may switch between.
 *
 * Primary source is `v3/specialist/assignments`, which is scoped by the API and
 * is not limited to cohorts the specialist personally enrolled in. If that call
 * fails — most importantly a 403 for a specialist with no assignment row — this
 * falls back to their own enrollments, which is what the switcher used before
 * assignments existed. A degraded switcher beats an empty one.
 */
export function useEnrollmentOptions(): {
  options: EnrollmentOption[];
  isLoading: boolean;
  usedFallback: boolean;
} {
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();

  const assignments = useGetSpecialistAssignments();

  // Only pay for the fallback request once assignments have actually failed.
  const needsFallback = isInternshipSpecialist && assignments.isError;
  const userPrograms = useGetUserInternshipPrograms({
    enabled: needsFallback,
  });

  const options = useMemo<EnrollmentOption[]>(() => {
    if (!isInternshipSpecialist) return [];

    if (!assignments.isError && assignments.data) {
      return optionsFromAssignments(assignments.data);
    }

    if (needsFallback && userPrograms.data) {
      return optionsFromUserCohorts(userPrograms.data.userCohorts ?? []);
    }

    return [];
  }, [
    assignments.data,
    assignments.isError,
    isInternshipSpecialist,
    needsFallback,
    userPrograms.data,
  ]);

  const isLoading =
    !isRoleReady ||
    (isInternshipSpecialist &&
      (assignments.isLoading || (needsFallback && userPrograms.isLoading)));

  return {
    options,
    isLoading,
    usedFallback: needsFallback && !!userPrograms.data,
  };
}
