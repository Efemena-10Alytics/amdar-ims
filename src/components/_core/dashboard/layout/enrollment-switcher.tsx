"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useGetUserInternshipPrograms } from "@/features/internship/use-get-user-internship-programs";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";
import {
  getEnrollmentSelection,
  getUserCohortLabel,
  getUserProgramTitle,
  pickCohortId,
  pickProgramId,
  type UserCohort,
} from "@/types/internship-program/user-program";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProgramOption = {
  id: number;
  title: string;
};

type CohortOption = {
  id: number;
  label: string;
};

function uniqueById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

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
          className="flex min-w-0 max-w-[14rem] items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left hover:bg-[#EEF2F6]"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-[#64748B]">
              {label}
            </span>
            <span className="block truncate text-sm font-semibold text-[#092A31]">
              {options.find((option) => option.id === value)?.label ?? `Select ${label.toLowerCase()}`}
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
  const { data, isLoading } = useGetUserInternshipPrograms();
  const enrollmentId = useEnrollmentSelectionStore((s) => s.enrollmentId);
  const programId = useEnrollmentSelectionStore((s) => s.programId);
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const setSelection = useEnrollmentSelectionStore((s) => s.setSelection);

  const userCohorts = data?.userCohorts ?? [];

  const enrollments = useMemo(
    () =>
      userCohorts.filter((item): item is UserCohort => {
        return pickProgramId(item) != null && pickCohortId(item) != null;
      }),
    [userCohorts],
  );

  const cohortOptions = useMemo<CohortOption[]>(() => {
    const seen = new Set<number>();

    return enrollments.flatMap((item) => {
      const id = pickCohortId(item);
      if (id == null || seen.has(id)) return [];
      seen.add(id);
      return [{ id, label: getUserCohortLabel(item) }];
    });
  }, [enrollments]);

  const selectedEnrollment = useMemo(
    () =>
      enrollments.find((item) => item.id === enrollmentId) ??
      enrollments.find(
        (item) =>
          pickProgramId(item) === programId && pickCohortId(item) === cohortId,
      ) ??
      null,
    [cohortId, enrollmentId, enrollments, programId],
  );

  const selectedCohortId = selectedEnrollment
    ? pickCohortId(selectedEnrollment)
    : cohortId;

  const programOptions = useMemo<ProgramOption[]>(() => {
    const source =
      selectedCohortId == null
        ? enrollments
        : enrollments.filter((item) => pickCohortId(item) === selectedCohortId);

    return uniqueById(
      source.flatMap((item) => {
        const id = pickProgramId(item);
        if (id == null) return [];
        return [{ id, title: getUserProgramTitle(item) }];
      }),
    );
  }, [enrollments, selectedCohortId]);

  useEffect(() => {
    if (enrollments.length === 0) return;

    if (selectedEnrollment) {
      const next = getEnrollmentSelection(selectedEnrollment);
      if (
        next.enrollmentId !== enrollmentId ||
        next.programId !== programId ||
        next.cohortId !== cohortId
      ) {
        setSelection(next);
      }
      return;
    }

    const first = enrollments[0];
    setSelection(getEnrollmentSelection(first));
  }, [
    cohortId,
    enrollmentId,
    enrollments,
    programId,
    selectedEnrollment,
    setSelection,
  ]);

  useEffect(() => {
    if (selectedCohortId == null || programOptions.length === 0) return;
    if (programOptions.some((option) => option.id === programId)) return;

    const matchingEnrollment = enrollments.find(
      (item) =>
        pickCohortId(item) === selectedCohortId &&
        pickProgramId(item) === programOptions[0].id,
    );

    if (matchingEnrollment) {
      setSelection(getEnrollmentSelection(matchingEnrollment));
      return;
    }

    setSelection({
      enrollmentId,
      programId: programOptions[0].id,
      cohortId: selectedCohortId,
    });
  }, [
    enrollmentId,
    enrollments,
    programId,
    programOptions,
    selectedCohortId,
    setSelection,
  ]);

  if (isLoading || cohortOptions.length === 0) {
    return null;
  }

  const selectedProgramId =
    programId != null ? String(programId) : "";
  const selectedCohortValue =
    selectedCohortId != null ? String(selectedCohortId) : "";

  return (
    <div className="flex items-center gap-2">
      <SwitcherDropdown
        label="Cohort"
        ariaLabel="Switch cohort"
        value={selectedCohortValue}
        options={cohortOptions.map((option) => ({
          id: String(option.id),
          label: option.label,
        }))}
        onValueChange={(value) => {
          const nextCohortId = Number(value);
          if (!Number.isFinite(nextCohortId)) return;

          const enrollmentsForCohort = enrollments.filter(
            (item) => pickCohortId(item) === nextCohortId,
          );
          const enrollment =
            enrollmentsForCohort.find(
              (item) => pickProgramId(item) === programId,
            ) ?? enrollmentsForCohort[0];

          if (!enrollment) return;

          setSelection(getEnrollmentSelection(enrollment));
        }}
      />
      <SwitcherDropdown
        label="Program"
        ariaLabel="Switch program"
        value={selectedProgramId}
        options={programOptions.map((option) => ({
          id: String(option.id),
          label: option.title,
        }))}
        onValueChange={(value) => {
          const nextProgramId = Number(value);
          if (!Number.isFinite(nextProgramId) || selectedCohortId == null) return;

          const enrollment =
            enrollments.find(
              (item) =>
                pickCohortId(item) === selectedCohortId &&
                pickProgramId(item) === nextProgramId,
            ) ?? null;

          if (enrollment) {
            setSelection(getEnrollmentSelection(enrollment));
            return;
          }

          setSelection({
            enrollmentId,
            programId: nextProgramId,
            cohortId: selectedCohortId,
          });
        }}
      />
    </div>
  );
}
