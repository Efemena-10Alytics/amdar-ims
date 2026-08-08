import type { EnrollmentCohort, UserEnrollment } from "@/types/user/enrollment";

const TEN_ALYTICS_COHORT_NAME_TOKEN = "10alytics";

/**
 * 10Alytics cohorts run a shortened track that starts at the emerging stage,
 * so parts of the UI drop the earlier stages for them.
 */
export function isTenAlyticsCohort(
  cohort: EnrollmentCohort | null | undefined,
): boolean {
  const name = cohort?.name?.trim().toLowerCase();
  if (!name) return false;
  return name.includes(TEN_ALYTICS_COHORT_NAME_TOKEN);
}

export function isTenAlyticsEnrollment(
  enrollment: UserEnrollment | null | undefined,
): boolean {
  return isTenAlyticsCohort(enrollment?.cohort);
}
