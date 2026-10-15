"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import type {
  AnnouncementsData,
  GetAnnouncementsQuery,
  GetAnnouncementsResponse,
} from "@/features/announcement/announcement.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

/** Shared React Query root key for announcement list caches. */
export const announcementsQueryKey = ["v3", "announcements"] as const;

const EMPTY_ANNOUNCEMENTS: AnnouncementsData = {
  count: 0,
  newer: [],
  older: [],
};

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as Record<string, unknown>).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

function getAnnouncementsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to load announcements";
}

function normalizeAnnouncementsData(
  data: GetAnnouncementsResponse["data"],
): AnnouncementsData {
  if (!data || typeof data !== "object") {
    return EMPTY_ANNOUNCEMENTS;
  }

  const newer = Array.isArray(data.newer) ? data.newer : [];
  const older = Array.isArray(data.older) ? data.older : [];

  return {
    count: typeof data.count === "number" ? data.count : newer.length + older.length,
    newer,
    older,
  };
}

/**
 * GET /api/v3/announcements?program_id={id}&cohort_id={id}
 */
export async function fetchAnnouncements(
  query: GetAnnouncementsQuery,
): Promise<AnnouncementsData> {
  const res = await axiosInstance.get<GetAnnouncementsResponse>(
    "v3/announcements",
    {
      params: {
        program_id: query.program_id,
        cohort_id: query.cohort_id,
      },
    },
  );

  const { success, message, data } = res.data;

  if (success) {
    return normalizeAnnouncementsData(data);
  }

  throw new Error(message?.trim() || "Failed to load announcements");
}

export const announcementsListQueryKey = (query: GetAnnouncementsQuery) =>
  [
    ...announcementsQueryKey,
    "list",
    String(query.program_id),
    String(query.cohort_id),
  ] as const;

type UseGetAnnouncementsOptions = {
  /** When false, skips the fetch (default: true). */
  enabled?: boolean;
};

export function useGetAnnouncements(
  query?: Partial<GetAnnouncementsQuery> | null,
  options?: UseGetAnnouncementsOptions,
) {
  const { cohortId, programId } = useSelectedEnrollmentIds();
  const enabled = options?.enabled !== false;

  const resolvedProgramId = query?.program_id ?? programId ?? null;
  const resolvedCohortId = query?.cohort_id ?? cohortId ?? null;

  const resolvedQuery: GetAnnouncementsQuery | null =
    resolvedProgramId != null && resolvedCohortId != null
      ? {
          program_id: resolvedProgramId,
          cohort_id: resolvedCohortId,
        }
      : null;

  const canFetch = enabled && !!apiBaseURL && resolvedQuery != null;

  const queryResult = useQuery({
    queryKey: resolvedQuery
      ? announcementsListQueryKey(resolvedQuery)
      : [...announcementsQueryKey, "disabled"],
    queryFn: () => fetchAnnouncements(resolvedQuery!),
    enabled: canFetch,
  });

  const errorMessage = queryResult.error
    ? getAnnouncementsErrorMessage(queryResult.error)
    : "";

  const data = queryResult.data ?? EMPTY_ANNOUNCEMENTS;

  const refetch = async (): Promise<AnnouncementsData> => {
    if (!canFetch) {
      return EMPTY_ANNOUNCEMENTS;
    }

    const result = await queryResult.refetch();
    return result.data ?? EMPTY_ANNOUNCEMENTS;
  };

  return {
    announcements: data,
    count: data.count,
    newer: data.newer,
    older: data.older,
    isLoading: queryResult.isFetching,
    isError: Boolean(queryResult.error) || Boolean(errorMessage),
    errorMessage,
    refetch,
  };
}
