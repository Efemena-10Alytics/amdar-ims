"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  GetResourcesQuery,
  GetResourcesResponse,
  ResourcesData,
} from "@/features/interns-project/resources/resources.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

/**
 * GET /api/v3/intern-projects/{projectId}/resources?search=&category=&format=&per_page=&page=
 */
export async function fetchResources(
  query: GetResourcesQuery,
): Promise<ResourcesData> {
  const res = await axiosInstance.get<GetResourcesResponse>(
    `v3/intern-projects/${query.project_id}/resources`,
    {
      params: {
        search: query.search,
        category: query.category,
        format: query.format,
        per_page: query.per_page,
        page: query.page,
      },
    },
  );

  const { success, message, data } = res.data;

  if (success && data) {
    return {
      stats: data.stats ?? {
        total: 0,
        videos: 0,
        links: 0,
        materials: 0,
      },
      resources: Array.isArray(data.resources) ? data.resources : [],
    };
  }

  throw new Error(message?.trim() || "Failed to load resources");
}

export const resourcesListQueryKey = (query: GetResourcesQuery) =>
  [
    "v3",
    "intern-projects",
    String(query.project_id),
    "resources",
    query.search ?? "",
    query.category ?? "all",
    query.format ?? "all",
    query.per_page ?? 15,
    query.page ?? 1,
  ] as const;

type UseGetResourcesOptions = {
  enabled?: boolean;
};

export function useGetResources(
  query?: Partial<GetResourcesQuery> | null,
  options?: UseGetResourcesOptions,
) {
  const projectId =
    query?.project_id != null && String(query.project_id).trim() !== ""
      ? query.project_id
      : null;

  const resolvedQuery: GetResourcesQuery | null =
    projectId != null
      ? {
          project_id: projectId,
          search: query?.search,
          category: query?.category,
          format: query?.format,
          per_page: query?.per_page ?? 50,
          page: query?.page ?? 1,
        }
      : null;

  const enabled = options?.enabled !== false;
  const canFetch = enabled && !!apiBaseURL && resolvedQuery != null;

  return useQuery({
    queryKey: resolvedQuery
      ? resourcesListQueryKey(resolvedQuery)
      : ["v3", "intern-projects", "resources", "disabled"],
    queryFn: () => fetchResources(resolvedQuery!),
    enabled: canFetch,
  });
}
