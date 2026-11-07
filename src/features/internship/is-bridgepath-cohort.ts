import type { EnrollmentCohort, UserEnrollment } from "@/types/user/enrollment";

const BRIDGEPATH_COHORT_NAME_TOKEN = "bridgepath";

/**
 * Bridgepath cohorts are named like "November Cohort - Bridgepath".
 */
export function isBridgepathCohort(
  cohort: EnrollmentCohort | null | undefined,
): boolean {
  const name = cohort?.name?.trim().toLowerCase();
  if (!name) return false;
  return name.includes(BRIDGEPATH_COHORT_NAME_TOKEN);
}

export function isBridgepathEnrollment(
  enrollment: UserEnrollment | null | undefined,
): boolean {
  return isBridgepathCohort(enrollment?.cohort);
}
