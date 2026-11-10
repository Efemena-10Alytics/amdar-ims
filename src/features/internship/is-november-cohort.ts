import type { EnrollmentCohort, UserEnrollment } from "@/types/user/enrollment";

const NOVEMBER_TOKEN = "november";

/**
 * November cohorts are named like "November Cohort" or carry month "November".
 */
export function isNovemberCohort(
  cohort: EnrollmentCohort | null | undefined,
): boolean {
  const month = cohort?.month?.trim().toLowerCase();
  if (month?.includes(NOVEMBER_TOKEN)) return true;

  const name = cohort?.name?.trim().toLowerCase();
  if (!name) return false;
  return name.includes(NOVEMBER_TOKEN);
}

export function isNovemberEnrollment(
  enrollment: UserEnrollment | null | undefined,
): boolean {
  return isNovemberCohort(enrollment?.cohort);
}
