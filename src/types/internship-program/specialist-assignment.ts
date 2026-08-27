/**
 * Shape of `GET /api/v3/specialist/assignments` — the (program, cohort) pairs an
 * internship specialist may act on. The API decides the scope: specialists get
 * their assignments, `internship-team-lead` staff get everything.
 *
 * `year` is a varchar in the database, so it can arrive as either type.
 */
export type SpecialistAssignmentCohort = {
  id: number;
  name: string;
  year: string | number | null;
  start_date: string | null;
};

export type SpecialistAssignmentProgram = {
  id: number;
  title: string;
};

export type SpecialistCohortProgramAssignment = {
  cohort_id: number;
  program_id: number;
  cohort: SpecialistAssignmentCohort;
  program: SpecialistAssignmentProgram;
  is_program_lead: boolean;
  is_team_lead: boolean;
};

export type SpecialistAssignmentsApiResponse = {
  success: boolean;
  message: string;
  data: SpecialistCohortProgramAssignment[] | null;
};

function isUsableAssignment(
  value: unknown,
): value is SpecialistCohortProgramAssignment {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<SpecialistCohortProgramAssignment>;

  return (
    typeof item.cohort_id === "number" &&
    Number.isFinite(item.cohort_id) &&
    typeof item.program_id === "number" &&
    Number.isFinite(item.program_id)
  );
}

/** Drops rows without both ids — they could never be selected anyway. */
export function normalizeSpecialistAssignments(
  data: SpecialistCohortProgramAssignment[] | null | undefined,
): SpecialistCohortProgramAssignment[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isUsableAssignment);
}
