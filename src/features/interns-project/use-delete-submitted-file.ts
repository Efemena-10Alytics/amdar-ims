import { useCallback, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import type { DeleteInternProjectTodoSubmissionItemResponse } from "./internship-project.types";
import { MY_INTERN_PROJECT_TODO_SUBMISSION_QUERY_KEY } from "./use-get-my-todo-submission";
import { INTERN_PROJECT_TODO_QUERY_KEY } from "./use-get-todo-by-id";
import { INTERN_PROJECT_TODOS_QUERY_KEY } from "./use-get-todos-by-project-id";
import { axiosInstance } from "@/lib/axios-instance";

export type DeleteSubmittedFileParams = {
  projectId: number | string;
  todoId: number | string;
  typeId: number | string;
  itemId: number | string;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage.trim();
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to delete submitted file.";
}

export async function deleteSubmittedFile({
  projectId,
  todoId,
  typeId,
  itemId,
}: DeleteSubmittedFileParams): Promise<void> {
  const { data } =
    await axiosInstance.delete<DeleteInternProjectTodoSubmissionItemResponse>(
      `v3/intern-projects/${projectId}/todos/${todoId}/types/${typeId}/submissions/items/${itemId}`,
    );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to delete submitted file.");
  }
}

export function useDeleteSubmittedFile() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deleteSubmittedFileMutation = useCallback(
    async ({
      projectId,
      todoId,
      typeId,
      itemId,
    }: DeleteSubmittedFileParams) => {
      setIsDeleting(true);
      setErrorMessage("");

      try {
        await deleteSubmittedFile({
          projectId,
          todoId,
          typeId,
          itemId,
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: MY_INTERN_PROJECT_TODO_SUBMISSION_QUERY_KEY(
              projectId,
              todoId,
              typeId,
            ),
          }),
          queryClient.invalidateQueries({
            queryKey: INTERN_PROJECT_TODO_QUERY_KEY(projectId, todoId),
          }),
          queryClient.invalidateQueries({
            queryKey: INTERN_PROJECT_TODOS_QUERY_KEY(projectId),
          }),
        ]);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsDeleting(false);
      }
    },
    [queryClient],
  );

  return {
    deleteSubmittedFile: deleteSubmittedFileMutation,
    isDeleting,
    errorMessage,
  };
}
