"use client";

import { useEffect } from "react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";
import type { UserEnrollment } from "@/types/user/enrollment";

function pickId(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

/**
 * Non-specialists get no enrollment switcher, so nothing else writes the
 * selection store — yet the project, progress and schedule queries are gated on
 * it. Mirror the enrollment the API resolved (the most recently assigned one)
 * into the store, overwriting any selection persisted by an earlier session.
 */
export function useSyncEnrollmentSelection(
  enrollment: UserEnrollment | null | undefined,
) {
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();
  const setSelection = useEnrollmentSelectionStore((s) => s.setSelection);

  useEffect(() => {
    if (!isRoleReady || isInternshipSpecialist || !enrollment) return;

    const next = {
      enrollmentId: pickId(enrollment.id),
      programId: pickId(enrollment.program_id, enrollment.program?.id),
      cohortId: pickId(enrollment.cohort_id, enrollment.cohort?.id),
    };

    if (next.programId == null || next.cohortId == null) return;

    const current = useEnrollmentSelectionStore.getState();
    if (
      current.enrollmentId === next.enrollmentId &&
      current.programId === next.programId &&
      current.cohortId === next.cohortId
    ) {
      return;
    }

    setSelection(next);
  }, [enrollment, isInternshipSpecialist, isRoleReady, setSelection]);
}
