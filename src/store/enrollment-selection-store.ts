import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type EnrollmentSelection = {
  enrollmentId: number | null;
  programId: number | null;
  cohortId: number | null;
  /**
   * Start date of the selected cohort, kept here so the platform-switch hint
   * can compare it against the cutover date without refetching the cohort.
   * Optional on input: callers that do not know it leave it out.
   */
  cohortStartDate?: string | null;
};

type EnrollmentSelectionState = Omit<EnrollmentSelection, "cohortStartDate"> & {
  cohortStartDate: string | null;
  setSelection: (selection: EnrollmentSelection) => void;
  clearSelection: () => void;
};

export const ENROLLMENT_SELECTION_STORAGE_KEY = "amdari_enrollment_selection";

export const useEnrollmentSelectionStore = create<EnrollmentSelectionState>()(
  persist(
    (set) => ({
      enrollmentId: null,
      programId: null,
      cohortId: null,
      cohortStartDate: null,
      setSelection: ({ enrollmentId, programId, cohortId, cohortStartDate }) =>
        set({
          enrollmentId,
          programId,
          cohortId,
          cohortStartDate: cohortStartDate ?? null,
        }),
      clearSelection: () =>
        set({
          enrollmentId: null,
          programId: null,
          cohortId: null,
          cohortStartDate: null,
        }),
    }),
    {
      name: ENROLLMENT_SELECTION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Selections persisted before cohortStartDate existed rehydrate without
      // it; zustand's shallow merge leaves the initial null in place.
      partialize: (state) => ({
        enrollmentId: state.enrollmentId,
        programId: state.programId,
        cohortId: state.cohortId,
        cohortStartDate: state.cohortStartDate,
      }),
    },
  ),
);

export function useSelectedEnrollmentIds() {
  const cohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const programId = useEnrollmentSelectionStore((s) => s.programId);

  return {
    cohortId,
    programId,
    hasSelection: cohortId != null && programId != null,
  };
}
