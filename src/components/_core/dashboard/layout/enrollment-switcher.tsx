"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useEnrollmentOptions } from "@/features/internship/use-enrollment-options";
import { useSeedSelectionFromUrl } from "@/features/internship/use-seed-selection-from-url";
import {
  cohortOptionsOf,
  programOptionsFor,
  resolveSelection,
  selectionMatchesOption,
  toSelection,
} from "@/features/internship/enrollment-options";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SwitcherDropdown({
  label,
  value,
  ariaLabel,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  ariaLabel: string;
  options: { id: string; label: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="flex min-w-0 max-w-56 items-center gap-2 rounded-lg bg-[#E8EFF1] px-3 py-2 text-left hover:bg-[#EEF2F6]"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#092A31]">
              {options.find((option) => option.id === value)?.label ??
                `Select ${label.toLowerCase()}`}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-[#64748B]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuLabel>Select {label.toLowerCase()}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function EnrollmentSwitcher() {
  const { isInternshipSpecialist } = useIsInternshipSpecialist();
  const { options, isLoading } = useEnrollmentOptions();

  const enrollmentId = useEnrollmentSelectionStore((s) => s.enrollmentId);
  const programId = useEnrollmentSelectionStore((s) => s.programId);
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const cohortStartDate = useEnrollmentSelectionStore((s) => s.cohortStartDate);
  const setSelection = useEnrollmentSelectionStore((s) => s.setSelection);

  // Must run before reconciliation so an inbound ?program=&cohort= wins over a
  // selection restored from localStorage.
  useSeedSelectionFromUrl(isInternshipSpecialist);

  const resolved = useMemo(
    () => resolveSelection(options, { programId, cohortId }),
    [cohortId, options, programId],
  );

  /**
   * Keeps the store pointing at a pair this specialist may actually open.
   * Converges: once the store matches `resolved`, this writes nothing.
   *
   * Non-specialists never reach here — `useSyncEnrollmentSelection` owns their
   * selection, and these two must not fight over the store.
   */
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

  const selectedCohortId = resolved?.cohortId ?? cohortId;
  const selectedProgramId = resolved?.programId ?? programId;

  const cohortOptions = useMemo(() => cohortOptionsOf(options), [options]);
  const programOptions = useMemo(
    () => programOptionsFor(options, selectedCohortId),
    [options, selectedCohortId],
  );

  if (!isInternshipSpecialist || isLoading || cohortOptions.length === 0) {
    return null;
  }

  const selectPair = (nextProgramId: number, nextCohortId: number) => {
    const option = options.find(
      (item) =>
        item.programId === nextProgramId && item.cohortId === nextCohortId,
    );
    if (option) setSelection(toSelection(option));
  };

  return (
    <div className="flex items-center gap-2">
      <SwitcherDropdown
        label="Cohort"
        ariaLabel="Switch cohort"
        value={selectedCohortId != null ? String(selectedCohortId) : ""}
        options={cohortOptions.map((option) => ({
          id: String(option.id),
          label: option.label,
        }))}
        onValueChange={(value) => {
          const nextCohortId = Number(value);
          if (!Number.isFinite(nextCohortId)) return;

          // Stay on the same program where that cohort offers it.
          const forCohort = options.filter(
            (item) => item.cohortId === nextCohortId,
          );
          const next =
            forCohort.find((item) => item.programId === selectedProgramId) ??
            forCohort[0];

          if (next) setSelection(toSelection(next));
        }}
      />
      <SwitcherDropdown
        label="Program"
        ariaLabel="Switch program"
        value={selectedProgramId != null ? String(selectedProgramId) : ""}
        options={programOptions.map((option) => ({
          id: String(option.id),
          label: option.label,
        }))}
        onValueChange={(value) => {
          const nextProgramId = Number(value);
          if (!Number.isFinite(nextProgramId) || selectedCohortId == null) {
            return;
          }
          selectPair(nextProgramId, selectedCohortId);
        }}
      />
    </div>
  );
}
