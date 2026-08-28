"use client";

import { ArrowLeftRight, Loader } from "lucide-react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useSwitchToLegacyPlatform } from "@/features/internship/use-switch-to-legacy-platform";

/**
 * Sends a specialist to the same cohort on the legacy app.
 *
 * Cohorts that started before the platform cutover keep their project structure
 * over there, so a specialist servicing one has to be able to cross over.
 */
export function PlatformSwitchButton() {
  const { isInternshipSpecialist } = useIsInternshipSpecialist();
  const { switchToLegacy, isSwitching } = useSwitchToLegacyPlatform();

  if (!isInternshipSpecialist) return null;

  return (
    <button
      type="button"
      onClick={switchToLegacy}
      disabled={isSwitching}
      aria-label="Switch to the old platform"
      title="Cohorts from before the platform change live on the old app"
      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-medium text-[#092A31] transition-colors hover:bg-[#E8EFF1] disabled:cursor-wait disabled:opacity-60"
    >
      {isSwitching ? (
        <Loader className="size-4 animate-spin" aria-hidden />
      ) : (
        <ArrowLeftRight className="size-4" aria-hidden />
      )}
      <span className="hidden sm:inline">Switch to old</span>
    </button>
  );
}

export default PlatformSwitchButton;
