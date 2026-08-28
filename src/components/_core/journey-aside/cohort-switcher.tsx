"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import {
  cohortOptionsOf,
  resolveSelection,
  selectionMatchesOption,
  toSelection,
} from "@/features/internship/enrollment-options";
import { useEnrollmentOptions } from "@/features/internship/use-enrollment-options";
import { useSeedSelectionFromUrl } from "@/features/internship/use-seed-selection-from-url";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CohortSwitcher() {
  const { isInternshipSpecialist } = useIsInternshipSpecialist();
  const { options, isLoading } = useEnrollmentOptions();

  const enrollmentId = useEnrollmentSelectionStore((s) => s.enrollmentId);
  const programId = useEnrollmentSelectionStore((s) => s.programId);
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const cohortStartDate = useEnrollmentSelectionStore((s) => s.cohortStartDate);
  const setSelection = useEnrollmentSelectionStore((s) => s.setSelection);

  useSeedSelectionFromUrl(isInternshipSpecialist);

  const resolved = useMemo(
    () => resolveSelection(options, { programId, cohortId }),
    [cohortId, options, programId],
  );

  useEffect(() => {
    if (!isInternshipSpecialist || !resolved) return;

    if (
      selectionMatchesOption(resolved, {
        enrollmentId,
        programId,
        cohortId,
        cohortStartDate,
      })
    ) {
      return;
    }

    setSelection(toSelection(resolved));
  }, [
    cohortId,
    cohortStartDate,
    enrollmentId,
    isInternshipSpecialist,
    programId,
    resolved,
    setSelection,
  ]);

  const cohortOptions = useMemo(() => cohortOptionsOf(options), [options]);
  const currentLabel = resolved?.cohortLabel ?? "Cohort";

  if (!isInternshipSpecialist || isLoading || cohortOptions.length === 0) {
    return null;
  }

  if (cohortOptions.length <= 1) {
    return (
      <span
        className="inline-flex max-w-36 items-center truncate rounded-full bg-[#0C5A66] px-3 py-1.5 text-xs font-medium text-[#E8F4F6]"
        title={currentLabel}
      >
        {currentLabel}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch cohort"
          className="inline-flex max-w-36 items-center gap-1 rounded-full bg-[#0C5A66] px-3 py-1.5 text-left text-xs font-medium text-[#E8F4F6] hover:bg-[#0A4E58]"
        >
          <span className="min-w-0 flex-1 truncate">{currentLabel}</span>
          <ChevronDown className="size-3.5 shrink-0 text-[#C4DEE3]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup
          value={resolved?.cohortId != null ? String(resolved.cohortId) : ""}
          onValueChange={(value) => {
            const nextCohortId = Number(value);
            if (!Number.isFinite(nextCohortId)) return;

            const next =
              options.find((option) => option.cohortId === nextCohortId) ??
              options[0];

            if (next) setSelection(toSelection(next));
          }}
        >
          {cohortOptions.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={String(option.id)}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
