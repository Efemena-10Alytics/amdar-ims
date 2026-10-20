"use client";

import { useEffect, useRef } from "react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import {
  buildLegacyInternshipUrl,
  isLegacyPlatformStartDate,
} from "@/features/internship/platform-switch";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { buildExternalAuthRedirectUrl } from "@/utils/externalAuthLogic";

export function LegacyCohortRedirect() {
  const { data: enrollment, isAuthReady, isLoading, isFetching } =
    useGetUserEnrollment();
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (
      !isAuthReady ||
      !isRoleReady ||
      isLoading ||
      isFetching ||
      !enrollment ||
      isRedirectingRef.current
    ) {
      return;
    }

    if (isInternshipSpecialist || enrollment.is_specialist_preview) {
      return;
    }

    if (!isLegacyPlatformStartDate(enrollment.cohort?.start_date)) {
      return;
    }

    isRedirectingRef.current = true;

    const programId = enrollment.program_id ?? enrollment.program?.id ?? null;
    const cohortId = enrollment.cohort_id ?? enrollment.cohort?.id ?? null;
    const destination = buildLegacyInternshipUrl({ programId, cohortId });

    void (async () => {
      try {
        const url = await buildExternalAuthRedirectUrl(destination);
        window.location.replace(url);
      } catch {
        window.location.replace(destination);
      }
    })();
  }, [
    enrollment,
    isAuthReady,
    isFetching,
    isInternshipSpecialist,
    isLoading,
    isRoleReady,
  ]);

  return null;
}
