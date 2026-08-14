import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type EnrollmentSelection = {
  enrollmentId: number | null;
  programId: number | null;
  cohortId: number | null;
};

type EnrollmentSelectionState = EnrollmentSelection & {
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
      setSelection: ({ enrollmentId, programId, cohortId }) =>
        set({ enrollmentId, programId, cohortId }),
      clearSelection: () =>
        set({ enrollmentId: null, programId: null, cohortId: null }),
    }),
    {
      name: ENROLLMENT_SELECTION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        enrollmentId: state.enrollmentId,
        programId: state.programId,
        cohortId: state.cohortId,
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
