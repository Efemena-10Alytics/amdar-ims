import {
  LEGACY_DEFERMENT_COHORT_CUTOFF,
  LEGACY_DEFERMENT_FETCH_COHORT_ID,
} from "@/constants/internship-deferment";

export type DefermentCohortFetchParams = {
  cohortId: number;
  limit: number;
};

/**
 * Legacy cohorts (start before Feb 2026) only expose one next cohort via a
 * fixed anchor id on the API. Newer cohorts use the user's real selection.
 */
export function resolveDefermentCohortFetchParams(
  cohortStartDate: string | null | undefined,
  selectedCohortId: number | null | undefined,
): DefermentCohortFetchParams | null {
  if (selectedCohortId == null) return null;

  const trimmed = String(cohortStartDate ?? "").trim();
  const isLegacy =
    trimmed.length > 0 && trimmed < LEGACY_DEFERMENT_COHORT_CUTOFF;

  return {
    cohortId: isLegacy ? LEGACY_DEFERMENT_FETCH_COHORT_ID : selectedCohortId,
    limit: isLegacy ? 1 : 6,
  };
}
