"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  GetProjectResourcesByCategoryQuery,
  GetProjectResourcesByCategoryResponse,
  ProjectResourcesByCategoryGroup,
  ProjectResourcesByCategoryProject,
} from "@/features/interns-project/resources/resources.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

/**
 * GET /api/v3/intern-project-resources/by-category
 * ?program_id=&cohort_id=&category=
 */
export async function fetchProjectResourcesByCategory(
  query: GetProjectResourcesByCategoryQuery,
): Promise<ProjectResourcesByCategoryGroup[]> {
  const res = await axiosInstance.get<GetProjectResourcesByCategoryResponse>(
    "v3/intern-project-resources/by-category",
    {
      params: {
        program_id: query.program_id,
        cohort_id: query.cohort_id,
        category: query.category,
        search: query.search,
        format: query.format,
        per_page: query.per_page,
        page: query.page,
      },
    },
  );

  const { success, message, data } = res.data;

  if (success && Array.isArray(data)) {
    return data.map((group) => ({
      category: group.category,
      projects: Array.isArray(group.projects)
        ? group.projects.map((project) => {
            const raw = project as ProjectResourcesByCategoryProject & {
              week?: string | null;
              weekLabel?: string | null;
              start_week?: number | null;
              end_week?: number | null;
            };

            return {
              projectId: project.projectId,
              projectTitle: project.projectTitle,
              projectSlug: project.projectSlug,
              weeks:
                project.weeks ??
                raw.weekLabel ??
                raw.week ??
                null,
              startWeek: project.startWeek ?? raw.start_week ?? null,
              endWeek: project.endWeek ?? raw.end_week ?? null,
              materials: Array.isArray(project.materials)
                ? project.materials
                : [],
            };
          })
        : [],
    }));
  }

  if (success && data == null) {
    return [];
  }

  throw new Error(
    message?.trim() || "Failed to load project resources by category",
  );
}

export const projectResourcesByCategoryQueryKey = (
  query: GetProjectResourcesByCategoryQuery,
) =>
  [
    "v3",
    "intern-project-resources",
    "by-category",
    String(query.program_id),
    String(query.cohort_id),
    query.category,
    query.search ?? "",
    query.format ?? "all",
    query.per_page ?? 50,
    query.page ?? 1,
  ] as const;

type UseGetProjectResourcesByCategoryOptions = {
  /** When false, skips the fetch (default: true). */
  enabled?: boolean;
};

export function useGetProjectResourcesByCategory(
  query?: Partial<GetProjectResourcesByCategoryQuery> | null,
  options?: UseGetProjectResourcesByCategoryOptions,
) {
  const { cohortId, programId } = useSelectedEnrollmentIds();

  const resolvedProgramId =
    query?.program_id != null && String(query.program_id).trim() !== ""
      ? query.program_id
      : programId;
  const resolvedCohortId =
    query?.cohort_id != null && String(query.cohort_id).trim() !== ""
      ? query.cohort_id
      : cohortId;
  const category =
    query?.category != null && String(query.category).trim() !== ""
      ? query.category
      : null;

  const resolvedQuery: GetProjectResourcesByCategoryQuery | null =
    resolvedProgramId != null &&
    resolvedCohortId != null &&
    category != null
      ? {
          program_id: resolvedProgramId,
          cohort_id: resolvedCohortId,
          category,
          search: query?.search,
          format: query?.format,
          per_page: query?.per_page ?? 50,
          page: query?.page ?? 1,
        }
      : null;

  const enabled = options?.enabled !== false;
  const canFetch = enabled && !!apiBaseURL && resolvedQuery != null;

  return useQuery({
    queryKey: resolvedQuery
      ? projectResourcesByCategoryQueryKey(resolvedQuery)
      : ["v3", "intern-project-resources", "by-category", "disabled"],
    queryFn: () => fetchProjectResourcesByCategory(resolvedQuery!),
    enabled: canFetch,
  });
}
