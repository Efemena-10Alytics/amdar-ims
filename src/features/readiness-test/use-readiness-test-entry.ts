import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  invalidateReadinessMyLatestSubmission,
  useGetMyResult,
} from "@/features/readiness-test/use-get-my-result";
import type { ReadinessTestSubmitResultData } from "@/features/readiness-test/types";

export function useReadinessTestEntry(
  formId: string | number | null | undefined,
  isStepCompleted: boolean,
) {
  const queryClient = useQueryClient();
  const { data: latestResult, isLoading: isLoadingLatest } = useGetMyResult(
    formId,
    { enabled: isStepCompleted },
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const canViewResults = isStepCompleted;
  const savedResult = isStepCompleted ? (latestResult ?? null) : null;

  const handleSubmitted = useCallback(
    (_result: ReadinessTestSubmitResultData) => {
      if (!isStepCompleted || formId == null || formId === "") return;
      void invalidateReadinessMyLatestSubmission(queryClient, formId);
    },
    [formId, isStepCompleted, queryClient],
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
