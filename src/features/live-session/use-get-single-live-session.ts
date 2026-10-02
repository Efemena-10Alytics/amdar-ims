"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { liveSessionsQueryKey } from "@/features/live-session/use-get-live-session";
import type {
  GetLiveSessionResponse,
  LiveSession,
} from "@/features/live-session/live-session.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as Record<string, unknown>).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

function getLiveSessionErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to load live session";
}

/**
 * GET /api/v3/live-sessions/{id}
 */
export async function fetchLiveSessionById(
  id: number | string,
): Promise<LiveSession> {
  const res = await axiosInstance.get<GetLiveSessionResponse>(
    `v3/live-sessions/${id}`,
  );

  const { success, message, data } = res.data;

  if (success && data) {
    return data;
  }

  throw new Error(message?.trim() || "Failed to load live session");
}

export const liveSessionByIdQueryKey = (id: number | string) =>
  [...liveSessionsQueryKey, "detail", String(id)] as const;

type UseGetLiveSessionByIdOptions = {
  /** When false, skips the fetch (default: true). */
  enabled?: boolean;
};

export function useGetLiveSessionById(
  id?: number | string | null,
  options?: UseGetLiveSessionByIdOptions,
) {
  const enabled = options?.enabled !== false;

  const resolvedId =
    id != null && String(id).trim() !== "" ? String(id) : null;

  const canFetch = enabled && !!apiBaseURL && resolvedId != null;

  const query = useQuery({
    queryKey:
      resolvedId != null
        ? liveSessionByIdQueryKey(resolvedId)
        : [...liveSessionsQueryKey, "detail", "disabled"],
    queryFn: () => fetchLiveSessionById(resolvedId!),
    enabled: canFetch,
  });

  const errorMessage =
    resolvedId == null
      ? enabled
        ? "No live session id provided."
        : ""
      : query.error
        ? getLiveSessionErrorMessage(query.error)
        : "";

  const refetch = async (): Promise<LiveSession | null> => {
    if (!canFetch) {
      return null;
    }

    const result = await query.refetch();
    return result.data ?? null;
  };

  return {
    data: query.data ?? null,
    session: query.data ?? null,
    isLoading: query.isFetching,
    isError: Boolean(query.error) || Boolean(errorMessage && !query.data),
    errorMessage,
    id: resolvedId,
    refetch,
  };
}
