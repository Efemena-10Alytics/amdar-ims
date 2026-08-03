import { useQuery } from "@tanstack/react-query";
import type {
  ProjectAssessments,
  ProjectAssessmentsResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const INTERN_PROJECT_ASSESSMENTS_QUERY_KEY = (
  projectId: number | string,
) => ["v3", "intern-projects", "assessments", projectId] as const;

const EMPTY_ASSESSMENTS: ProjectAssessments = { pre: null, post: null };

export async function getProjectAssessments(
  projectId: number | string,
): Promise<ProjectAssessments> {
  const { data } = await axiosInstance.get<ProjectAssessmentsResponse>(
    `v3/intern-projects/${projectId}/assessments/me`,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to load project assessments.");
  }

  return data.data ?? EMPTY_ASSESSMENTS;
}

export function useGetProjectAssessments(projectId?: number | string | null) {
  const hasValidProjectId = Boolean(projectId);

  return useQuery({
    queryKey: INTERN_PROJECT_ASSESSMENTS_QUERY_KEY(projectId ?? ""),
    queryFn: () => getProjectAssessments(projectId as number | string),
    enabled: !!apiBaseURL && hasValidProjectId,
  });
}
