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
 * Primary source is programs the user is actually enrolled in
 * (`internships/user-programs`). Specialist assignments are only a fallback
 * when they have no enrollment rows — e.g. a pure specialist preview account —
 * so the switcher is not empty.
 */
export function useEnrollmentOptions(): {
  options: EnrollmentOption[];
  isLoading: boolean;
  usedFallback: boolean;
} {
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();

  const userPrograms = useGetUserInternshipPrograms({
    enabled: isInternshipSpecialist,
  });

  const enrollmentOptions = useMemo(
    () => optionsFromUserCohorts(userPrograms.data?.userCohorts ?? []),
    [userPrograms.data],
  );

  // Assignments only when enrollments loaded empty (or failed) — avoid the
  // full team-lead catalog when the user already has programs they're on.
  const needsAssignmentFallback =
    isInternshipSpecialist &&
    !userPrograms.isLoading &&
    (userPrograms.isError || enrollmentOptions.length === 0);

  const assignments = useGetSpecialistAssignments({
    enabled: needsAssignmentFallback,
  });

  const options = useMemo<EnrollmentOption[]>(() => {
    if (!isInternshipSpecialist) return [];

    if (enrollmentOptions.length > 0) {
      return enrollmentOptions;
    }

    if (needsAssignmentFallback && !assignments.isError && assignments.data) {
      return optionsFromAssignments(assignments.data);
    }

    return [];
  }, [
    assignments.data,
    assignments.isError,
    enrollmentOptions,
    isInternshipSpecialist,
    needsAssignmentFallback,
  ]);

  const isLoading =
    !isRoleReady ||
    (isInternshipSpecialist &&
      (userPrograms.isLoading ||
        (needsAssignmentFallback && assignments.isLoading)));

  return {
    options,
    isLoading,
    usedFallback:
      needsAssignmentFallback &&
      enrollmentOptions.length === 0 &&
      !!assignments.data &&
      !assignments.isError,
  };
}
