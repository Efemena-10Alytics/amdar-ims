"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Loader, X } from "lucide-react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { isLegacyPlatformStartDate } from "@/features/internship/platform-switch";
import { useSwitchToLegacyPlatform } from "@/features/internship/use-switch-to-legacy-platform";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";

const DISMISS_KEY_PREFIX = "internship_platform_hint_dismissed_";

/** Dismissals last the session, so the hint returns tomorrow but never nags. */
function readDismissed(cohortId: number | null): boolean {
  if (cohortId == null) return false;
  try {
    return sessionStorage.getItem(`${DISMISS_KEY_PREFIX}${cohortId}`) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(cohortId: number | null): void {
  if (cohortId == null) return;
  try {
    sessionStorage.setItem(`${DISMISS_KEY_PREFIX}${cohortId}`, "1");
  } catch {
    // Private mode / storage disabled — the hint simply reappears.
  }
}

/**
 * Tells a specialist that the cohort they just selected lives on the legacy
 * app.
 *
 * The mirror of the legacy app's hint. This platform can still render a
 * pre-cutover cohort, but its project structure differs, so what it shows is
 * misleading rather than empty. A recommendation rather than a redirect: the
 * specialist may have selected it deliberately.
 */
export function PlatformSwitchHint() {
  const { isInternshipSpecialist } = useIsInternshipSpecialist();
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const cohortStartDate = useEnrollmentSelectionStore((s) => s.cohortStartDate);
  const { switchToLegacy, isSwitching } = useSwitchToLegacyPlatform();

  const [isDismissed, setIsDismissed] = useState(false);

  // Selecting a different cohort is a fresh question, so re-read that cohort's
  // own dismissal rather than carrying the previous one over. Reading in an
  // effect also keeps sessionStorage off the server-render path.
  useEffect(() => {
    setIsDismissed(readDismissed(cohortId));
  }, [cohortId]);

  const belongsToLegacy = isLegacyPlatformStartDate(cohortStartDate);

  if (!isInternshipSpecialist || !belongsToLegacy || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    writeDismissed(cohortId);
    setIsDismissed(true);
  };

  return (
    <div
      role="status"
      className="relative flex flex-col gap-3 rounded-xl border border-[#F5C26B] bg-[#FFF8EC] px-4 py-3"
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 cursor-pointer text-[#8A6D3B] hover:opacity-70"
      >
        <X className="size-4" />
      </button>

      <div className="pr-8">
        <p className="text-sm font-semibold text-[#8A6D3B]">
          This cohort runs on the old platform
        </p>
        <p className="mt-1 text-sm text-[#8A6D3B]">
          Its internship structure is different here, so this page will not show
          the right information. Switch over to see it correctly.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={switchToLegacy}
          disabled={isSwitching}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#092A31] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {isSwitching ? (
            <Loader className="size-4 animate-spin" aria-hidden />
          ) : (
            <ArrowLeftRight className="size-4" aria-hidden />
          )}
          Switch to old platform
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="cursor-pointer text-sm font-medium text-[#8A6D3B] hover:underline"
        >
          Stay here
        </button>
      </div>
    </div>
  );
}

export default PlatformSwitchHint;
