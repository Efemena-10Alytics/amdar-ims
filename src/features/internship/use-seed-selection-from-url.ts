"use client";

import { useEffect, useRef } from "react";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";

export const SELECTION_URL_PARAMS = {
  PROGRAM: "program",
  COHORT: "cohort",
} as const;

function parseId(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Seeds the selection store from `?program=&cohort=` so a specialist arriving
 * from the legacy app lands on the cohort they were already looking at.
 *
 * Runs once per mount, before the switcher's own reconciliation — if the pair
 * turns out not to be one this specialist may open, the switcher replaces it.
 * The params are stripped afterwards so a later in-app switch is not undone by
 * a stale URL on refresh.
 *
 * Reads `window.location` rather than `useSearchParams` deliberately: the
 * latter would force a Suspense boundary around the dashboard header.
 */
export function useSeedSelectionFromUrl(enabled: boolean) {
  const setSelection = useEnrollmentSelectionStore((s) => s.setSelection);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled || hasRun.current) return;
    if (typeof window === "undefined") return;

    hasRun.current = true;

    const url = new URL(window.location.href);
    const programId = parseId(url.searchParams.get(SELECTION_URL_PARAMS.PROGRAM));
    const cohortId = parseId(url.searchParams.get(SELECTION_URL_PARAMS.COHORT));

    if (programId == null || cohortId == null) return;

    setSelection({
      enrollmentId: null,
      programId,
      cohortId,
      // Unknown until the assignments list resolves; the switcher fills it in.
      cohortStartDate: null,
    });

    url.searchParams.delete(SELECTION_URL_PARAMS.PROGRAM);
    url.searchParams.delete(SELECTION_URL_PARAMS.COHORT);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [enabled, setSelection]);
}
