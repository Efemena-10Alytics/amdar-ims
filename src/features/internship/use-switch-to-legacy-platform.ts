"use client";

import { useCallback, useState } from "react";
import { buildLegacyInternshipUrl } from "@/features/internship/platform-switch";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";
import { buildExternalAuthRedirectUrl } from "@/utils/externalAuthLogic";

/**
 * Navigates to the same cohort on the legacy app, carrying the session.
 *
 * Shared by the header button and the recommendation hint so there is one
 * definition of what "switch platforms" does.
 */
export function useSwitchToLegacyPlatform() {
  const programId = useEnrollmentSelectionStore((s) => s.programId);
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const [isSwitching, setIsSwitching] = useState(false);

  const switchToLegacy = useCallback(async () => {
    if (isSwitching) return;
    setIsSwitching(true);

    const destination = buildLegacyInternshipUrl({ programId, cohortId });

    try {
      // Adds the encrypted ?token= so the legacy app picks up the session.
      const url = await buildExternalAuthRedirectUrl(destination);
      window.location.assign(url);
    } catch {
      // Crypto unavailable or no stored token — still cross over; the legacy
      // app will ask them to sign in rather than leaving them stuck here.
      window.location.assign(destination);
    }
  }, [cohortId, isSwitching, programId]);

  return { switchToLegacy, isSwitching };
}
