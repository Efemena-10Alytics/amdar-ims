import { useQuery } from "@tanstack/react-query";
import type {
  InternProjectTodo,
  InternProjectTodoResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export type GetInternProjectTodoParams = {
  projectId: number | string;
  todoId: number | string;
};

export const INTERN_PROJECT_TODO_QUERY_KEY = (
  projectId: number | string,
  todoId: number | string,
) => ["v3", "intern-projects", "todo", projectId, todoId] as const;

export async function getInternProjectTodoById({
  projectId,
  todoId,
}: GetInternProjectTodoParams): Promise<InternProjectTodo> {
  const { data } = await axiosInstance.get<InternProjectTodoResponse>(
    `v3/intern-projects/${projectId}/todos/${todoId}`,
  );

  if (data.success === false || !data.data) {
    throw new Error(data.message?.trim() || "Failed to load internship project todo.");
  }

  return data.data;
}

export function useGetTodoById(
  projectId?: number | string | null,
  todoId?: number | string | null,
) {
  const hasValidParams = Boolean(projectId && todoId);

  return useQuery({
    queryKey: INTERN_PROJECT_TODO_QUERY_KEY(projectId ?? "", todoId ?? ""),
    queryFn: () =>
      getInternProjectTodoById({
        projectId: projectId as number | string,
        todoId: todoId as number | string,
      }),
    enabled: !!apiBaseURL && hasValidParams,
  });

}
