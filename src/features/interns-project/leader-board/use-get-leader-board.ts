"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import type {
  GetProjectLeaderBoardQuery,
  LeaderBoardEntry,
  ProjectLeaderBoardData,
  ProjectLeaderBoardResponse,
} from "./leader-board.types";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore } from "@/store/auth-store";

function useAuthStoreHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setHasHydrated(true));
  }, []);

  return hasHydrated;
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage.trim();
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * GET /api/v3/intern-projects/{projectId}/leaderboard
 * Optional: ?search=
 */
export async function fetchProjectLeaderBoard(
  projectId: number | string,
  query?: GetProjectLeaderBoardQuery,
): Promise<ProjectLeaderBoardData> {
  const search = query?.search?.trim() || undefined;

  const res = await axiosInstance.get<ProjectLeaderBoardResponse>(
    `intern-projects/${projectId}/leaderboard`,
    {
      params: {
        search,
      },
    },
  );

  const { success, message, data } = res.data;

  if (success && data) {
    return {
      podium: Array.isArray(data.podium) ? data.podium : [],
      leaders: Array.isArray(data.leaders) ? data.leaders : [],
    };
  }

  throw new Error(
    message?.trim() || "Failed to load internship project leaderboard",
  );
}

export const projectLeaderBoardQueryKey = (
  projectId: number | string,
  query?: GetProjectLeaderBoardQuery,
) =>
  [
    "intern-project-leaderboard",
    String(projectId),
    query?.search?.trim() || "",
  ] as const;

type UseGetLeaderBoardOptions = {
  /** When false, skips the fetch (default: true). */
  enabled?: boolean;
  /** Optional name search filter. */
  search?: string;
};

export function useGetLeaderBoard(
  projectId?: number | string | null,
  options?: UseGetLeaderBoardOptions,
) {
  const session = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStoreHydrated();
  const isAuthenticated = Boolean(session?.token);
  const enabled = options?.enabled !== false;
  const resolvedProjectId =
    projectId != null && String(projectId).trim() !== ""
      ? String(projectId)
      : null;

  const resolvedQuery: GetProjectLeaderBoardQuery = {
    search: options?.search?.trim() || undefined,
  };

  const canFetch =
    enabled && hasHydrated && isAuthenticated && resolvedProjectId != null;

  const query = useQuery({
    queryKey:
      resolvedProjectId != null
        ? projectLeaderBoardQueryKey(resolvedProjectId, resolvedQuery)
        : ["intern-project-leaderboard", "disabled"],
    queryFn: () => fetchProjectLeaderBoard(resolvedProjectId!, resolvedQuery),
    enabled: canFetch,
  });

  const errorMessage = !enabled
    ? ""
    : !hasHydrated
      ? ""
      : !isAuthenticated
        ? "You must be signed in to view the project leaderboard."
        : resolvedProjectId == null
          ? "No internship project id provided."
          : query.error
            ? getApiErrorMessage(
                query.error,
                "Failed to load internship project leaderboard",
              )
            : "";

  const data = query.data ?? null;
  const podium: LeaderBoardEntry[] = data?.podium ?? [];
  const leaders: LeaderBoardEntry[] = data?.leaders ?? [];

  const refetch = async (): Promise<ProjectLeaderBoardData | null> => {
    if (!canFetch) {
      return null;
    }

    const result = await query.refetch();
    return result.data ?? null;
  };

  const hasLoaded = canFetch && query.isFetched;

  return {
    data,
    podium,
    leaders,
    isLoading: canFetch && query.isFetching,
    hasLoaded,
    isError: Boolean(query.error) || Boolean(errorMessage && data == null),
    errorMessage,
    projectId: resolvedProjectId,
    refetch,
  };
}
