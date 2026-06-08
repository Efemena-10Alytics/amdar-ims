import { useQuery, type QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type {
  ReadinessTestLatestSubmissionResponse,
  ReadinessTestSubmitResultData,
} from "@/features/readiness-test/types";

export const READINESS_MY_LATEST_SUBMISSION_QUERY_KEY = (
  formId: string | number,
) => ["v3/forms", formId, "my-latest-submission"] as const;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to load submission result.";
}

/** GET v3/forms/{formId}/my-latest-submission */
export async function getMyLatestSubmission(
  formId: string | number,
): Promise<ReadinessTestSubmitResultData | null> {
  const { data } = await axiosInstance.get<ReadinessTestLatestSubmissionResponse>(
    `v3/forms/${formId}/my-latest-submission`,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to load submission result.");
  }

  return data.data ?? null;
}

export function useGetMyResult(
  formId: string | number | null | undefined,
  options?: { enabled?: boolean },
) {
  const isEnabled =
    (options?.enabled ?? true) &&
    !!apiBaseURL &&
    formId !== null &&
    formId !== undefined &&
    formId !== "";

  return useQuery({
    queryKey: READINESS_MY_LATEST_SUBMISSION_QUERY_KEY(formId ?? ""),
    queryFn: () => getMyLatestSubmission(formId as string | number),
    enabled: isEnabled,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export { getErrorMessage as getMyLatestSubmissionErrorMessage };

export function invalidateReadinessMyLatestSubmission(
  queryClient: QueryClient,
  formId: string | number,
) {
  return queryClient.invalidateQueries({
    queryKey: READINESS_MY_LATEST_SUBMISSION_QUERY_KEY(formId),
  });
}
