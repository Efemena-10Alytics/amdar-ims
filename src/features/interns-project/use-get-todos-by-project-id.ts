import { useQuery } from "@tanstack/react-query";
import type {
  InternProjectTodo,
  InternProjectTodosResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const INTERN_PROJECT_TODOS_QUERY_KEY = (projectId: number | string) =>
  ["v3", "intern-projects", "todos", projectId] as const;

export async function getInternProjectTodosByProjectId(
  projectId: number | string,
): Promise<InternProjectTodo[]> {
  const { data } = await axiosInstance.get<InternProjectTodosResponse>(
    `v3/intern-projects/${projectId}/todos`,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to load internship project todos.");
  }

  return data.data ?? [];
}

export function useGetTodosByProjectId(projectId?: number | string | null) {
  const hasValidProjectId = Boolean(projectId);

  return useQuery({
    queryKey: INTERN_PROJECT_TODOS_QUERY_KEY(projectId ?? ""),
    queryFn: () =>
      getInternProjectTodosByProjectId(projectId as number | string),
    enabled: !!apiBaseURL && hasValidProjectId,
  });
}
