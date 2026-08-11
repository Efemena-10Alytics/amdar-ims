import { useQuery } from "@tanstack/react-query";
import type {
  InternProjectTodoSubmissionComment,
  InternProjectTodoSubmissionCommentsResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export type GetInternProjectTodoSubmissionCommentsParams = {
  projectId: number | string;
  todoId: number | string;
  typeId: number | string;
  submissionId: number | string;
};

export const INTERN_PROJECT_TODO_SUBMISSION_COMMENTS_QUERY_KEY = (
  projectId: number | string,
  todoId: number | string,
  typeId: number | string,
  submissionId: number | string,
) =>
  [
    "v3",
    "intern-projects",
    "todo-submission-comments",
    projectId,
    todoId,
    typeId,
    submissionId,
  ] as const;

function extractComments(
  response: InternProjectTodoSubmissionCommentsResponse,
): InternProjectTodoSubmissionComment[] {
  if (Array.isArray(response.comments)) {
    return response.comments;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    Array.isArray(response.data.comments)
  ) {
    return response.data.comments;
  }

  return [];
}

export async function getInternProjectTodoSubmissionComments({
  projectId,
  todoId,
  typeId,
  submissionId,
}: GetInternProjectTodoSubmissionCommentsParams): Promise<
  InternProjectTodoSubmissionComment[]
> {
  const { data } =
    await axiosInstance.get<InternProjectTodoSubmissionCommentsResponse>(
      `v3/intern-projects/${projectId}/todos/${todoId}/types/${typeId}/submissions/${submissionId}/comments`,
    );

  if (data.success === false) {
    throw new Error(
      data.message?.trim() || "Failed to load submission comments.",
    );
  }

  return extractComments(data);
}

export function useGetTodoSubmissionComments(
  projectId?: number | string | null,
  todoId?: number | string | null,
  typeId?: number | string | null,
  submissionId?: number | string | null,
  options?: { enabled?: boolean },
) {
  const hasValidParams = Boolean(projectId && todoId && typeId && submissionId);
  const enabled = options?.enabled !== false;

  return useQuery({
    queryKey: INTERN_PROJECT_TODO_SUBMISSION_COMMENTS_QUERY_KEY(
      projectId ?? "",
      todoId ?? "",
      typeId ?? "",
      submissionId ?? "",
    ),
    queryFn: () =>
      getInternProjectTodoSubmissionComments({
        projectId: projectId as number | string,
        todoId: todoId as number | string,
        typeId: typeId as number | string,
        submissionId: submissionId as number | string,
      }),
    enabled: !!apiBaseURL && hasValidParams && enabled,
  });
}
