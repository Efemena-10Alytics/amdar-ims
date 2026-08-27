import type { EnrollmentSelection } from "@/store/enrollment-selection-store";
import type { SpecialistCohortProgramAssignment } from "@/types/internship-program/specialist-assignment";
import {
  formatCohortLabel,
  getUserProgramTitle,
  pickCohortId,
  pickProgramId,
  type UserCohort,
} from "@/types/internship-program/user-program";

/**
 * One selectable (program, cohort) pair, normalised so the switcher does not
 * care whether it came from the specialist assignments endpoint or from the
 * user's own enrollments.
 *
 * `enrollmentId` is null for assignment-sourced options: a specialist is not a
 * student in a cohort they service, so there is no enrollment row to point at.
 */
export type EnrollmentOption = {
  enrollmentId: number | null;
  programId: number;
  cohortId: number;
  programTitle: string;
  cohortLabel: string;
  cohortStartDate: string | null;
};

function dedupeByPair(options: EnrollmentOption[]): EnrollmentOption[] {
  const seen = new Set<string>();

  return options.filter((option) => {
    const key = `${option.programId}-${option.cohortId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function optionsFromAssignments(
  assignments: SpecialistCohortProgramAssignment[],
): EnrollmentOption[] {
  return dedupeByPair(
    assignments.map((assignment) => ({
      enrollmentId: null,
      programId: assignment.program_id,
      cohortId: assignment.cohort_id,
      programTitle: assignment.program?.title?.trim() || "Program",
      cohortLabel: formatCohortLabel(assignment.cohort ?? {}),
      cohortStartDate: assignment.cohort?.start_date ?? null,
    })),
  );
}

export function optionsFromUserCohorts(
  userCohorts: UserCohort[],
): EnrollmentOption[] {
  return dedupeByPair(
    userCohorts.flatMap((item) => {
      const programId = pickProgramId(item);
      const cohortId = pickCohortId(item);
      if (programId == null || cohortId == null) return [];

      return [
        {
          enrollmentId: item.id ?? null,
          programId,
          cohortId,
          programTitle: getUserProgramTitle(item),
          cohortLabel: formatCohortLabel(item.cohort ?? {}),
          cohortStartDate: item.cohort?.start_date ?? null,
        },
      ];
    }),
  );
}

/** Distinct cohorts across all options, in the order the API returned them. */
export function cohortOptionsOf(
  options: EnrollmentOption[],
): { id: number; label: string }[] {
  const seen = new Set<number>();

  return options.flatMap((option) => {
    if (seen.has(option.cohortId)) return [];
    seen.add(option.cohortId);
    return [{ id: option.cohortId, label: option.cohortLabel }];
  });
}

/** Programs available within one cohort — the switcher cascades cohort first. */
export function programOptionsFor(
  options: EnrollmentOption[],
  cohortId: number | null,
): { id: number; label: string }[] {
  const seen = new Set<number>();

  return options.flatMap((option) => {
    if (cohortId != null && option.cohortId !== cohortId) return [];
    if (seen.has(option.programId)) return [];
    seen.add(option.programId);
    return [{ id: option.programId, label: option.programTitle }];
  });
}

/**
 * Which option a given stored selection should resolve to.
 *
 * Falls back in decreasing order of surprise: the exact pair, then any program
 * within the same cohort (so changing cohort keeps you in that cohort), then
 * the first option. Returns null only when there is nothing to select.
 */
export function resolveSelection(
  options: EnrollmentOption[],
  current: { programId: number | null; cohortId: number | null },
): EnrollmentOption | null {
  if (options.length === 0) return null;

  const exact = options.find(
    (option) =>
      option.programId === current.programId &&
      option.cohortId === current.cohortId,
  );
  if (exact) return exact;

  if (current.cohortId != null) {
    const sameCohort = options.find(
      (option) => option.cohortId === current.cohortId,
    );
    if (sameCohort) return sameCohort;
  }

  return options[0];
}

export function toSelection(option: EnrollmentOption): EnrollmentSelection {
  return {
    enrollmentId: option.enrollmentId,
    programId: option.programId,
    cohortId: option.cohortId,
    cohortStartDate: option.cohortStartDate,
  };
}

/**
 * Whether the store already holds exactly this option. Compares the metadata
 * too, not just the ids — assignment data can load after a selection was
 * restored from localStorage, and the start date has to catch up.
 */
export function selectionMatchesOption(
  option: EnrollmentOption,
  current: {
    enrollmentId: number | null;
    programId: number | null;
    cohortId: number | null;
    cohortStartDate: string | null;
  },
): boolean {
  return (
    current.enrollmentId === option.enrollmentId &&
    current.programId === option.programId &&
    current.cohortId === option.cohortId &&
    current.cohortStartDate === option.cohortStartDate
  );
}
