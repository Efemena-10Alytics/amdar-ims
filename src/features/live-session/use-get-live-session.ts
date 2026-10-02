"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import type {
  GetLiveSessionsQuery,
  GetLiveSessionsResponse,
  LiveSession,
} from "@/features/live-session/live-session.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

/** Shared React Query root key for live-session list/detail caches. */
export const liveSessionsQueryKey = ["v3", "live-sessions"] as const;

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as Record<string, unknown>).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

function getLiveSessionsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to load live sessions";
}

/**
 * GET /api/v3/live-sessions
 */
export async function fetchLiveSessions(
  query?: GetLiveSessionsQuery,
): Promise<LiveSession[]> {
  const res = await axiosInstance.get<GetLiveSessionsResponse>("v3/live-sessions", {
    params: {
      program_id: query?.program_id,
      cohort_id: query?.cohort_id,
      category: query?.category,
      sessionType: query?.sessionType,
      search: query?.search,
    },
  });

  const { success, message, data } = res.data;

  if (success && Array.isArray(data)) {
    return data;
  }

  if (success && data == null) {
    return [];
  }

  throw new Error(message?.trim() || "Failed to load live sessions");
}

export const liveSessionsListQueryKey = (query?: GetLiveSessionsQuery) =>
  [
    ...liveSessionsQueryKey,
    "list",
    query?.program_id != null ? String(query.program_id) : "all",
    query?.cohort_id != null ? String(query.cohort_id) : "all",
    query?.category ?? "all",
    query?.sessionType ?? "all",
    query?.search ?? "",
  ] as const;

type UseGetLiveSessionsOptions = {
  /** When false, skips the fetch (default: true). */
  enabled?: boolean;
};

export function useGetLiveSessions(
  query?: GetLiveSessionsQuery | null,
  options?: UseGetLiveSessionsOptions,
) {
  const { cohortId, programId } = useSelectedEnrollmentIds();
  const enabled = options?.enabled !== false;

  const resolvedQuery: GetLiveSessionsQuery = {
    program_id: query?.program_id ?? programId ?? undefined,
    cohort_id: query?.cohort_id ?? cohortId ?? undefined,
    category: query?.category,
    sessionType: query?.sessionType,
    search: query?.search,
  };

  const canFetch = enabled && !!apiBaseURL;

  const queryResult = useQuery({
    queryKey: liveSessionsListQueryKey(resolvedQuery),
    queryFn: () => fetchLiveSessions(resolvedQuery),
    enabled: canFetch,
  });

  const errorMessage = queryResult.error
    ? getLiveSessionsErrorMessage(queryResult.error)
    : "";

  const refetch = async (): Promise<LiveSession[]> => {
    if (!canFetch) {
      return [];
    }

    const result = await queryResult.refetch();
    return result.data ?? [];
  };

  return {
    sessions: queryResult.data ?? [],
    isLoading: queryResult.isFetching,
    isError: Boolean(queryResult.error) || Boolean(errorMessage),
    errorMessage,
    refetch,
  };
}
