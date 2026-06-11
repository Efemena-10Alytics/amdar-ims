import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  invalidateReadinessMyLatestSubmission,
  useGetMyResult,
} from "@/features/readiness-test/use-get-my-result";
import type { ReadinessTestSubmitResultData } from "@/features/readiness-test/types";

type UseReadinessTestEntryOptions = {
  markStepComplete?: () => Promise<unknown>;
};

export function useReadinessTestEntry(
  formId: string | number | null | undefined,
  isStepCompleted: boolean,
  options: UseReadinessTestEntryOptions = {},
) {
  const { markStepComplete } = options;
  const queryClient = useQueryClient();
  const { data: latestResult, isLoading: isLoadingLatest } = useGetMyResult(
    formId,
    { enabled: isStepCompleted },
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const canViewResults = isStepCompleted;
  const savedResult = isStepCompleted ? (latestResult ?? null) : null;

  const handleSubmitted = useCallback(
    async (_result: ReadinessTestSubmitResultData) => {
      if (formId == null || formId === "") return;

      if (!isStepCompleted && markStepComplete) {
        await markStepComplete();
      }

      await invalidateReadinessMyLatestSubmission(queryClient, formId);
    },
    [formId, isStepCompleted, markStepComplete, queryClient],
  );

  return {
    savedResult,
    isLoadingLatest: isStepCompleted && isLoadingLatest,
    canViewResults,
    isDrawerOpen,
    setIsDrawerOpen,
    handleSubmitted,
  };
}
