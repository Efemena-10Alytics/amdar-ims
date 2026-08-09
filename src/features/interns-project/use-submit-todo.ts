import { useCallback, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import type {
  SubmitInternProjectTodoPayload,
  SubmitInternProjectTodoResponse,
} from "./internship-project.types";
import {
  buildTodoSubmissionFormData,
  submissionItemsHaveFile,
} from "./build-todo-submission-form-data";
import { INTERN_PROJECT_TODO_QUERY_KEY } from "./use-get-todo-by-id";
import { INTERN_PROJECT_TODOS_QUERY_KEY } from "./use-get-todos-by-project-id";
import { MY_INTERN_PROJECT_TODO_SUBMISSION_QUERY_KEY } from "./use-get-my-todo-submission";
import { axiosInstance } from "@/lib/axios-instance";

export type SubmitInternProjectTodoParams = {
  projectId: number | string;
  todoId: number | string;
  payload: SubmitInternProjectTodoPayload;
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
  return "Failed to submit todo solution.";
}

export async function submitInternProjectTodo({
  projectId,
  todoId,
  payload,
}: SubmitInternProjectTodoParams): Promise<SubmitInternProjectTodoResponse> {
  const hasFile = submissionItemsHaveFile(payload.items);
  const body = hasFile
    ? buildTodoSubmissionFormData(payload.items)
    : payload;

  const { data } = await axiosInstance.post<SubmitInternProjectTodoResponse>(
    `v3/intern-projects/${projectId}/todos/${todoId}/submissions`,
    body,
    hasFile
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {
          headers: {
            "Content-Type": "application/json",
          },
        },
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to submit todo solution.");
  }

  return data;
}

export function useSubmitTodo() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitTodo = useCallback(
    async ({ projectId, todoId, payload }: SubmitInternProjectTodoParams) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        const response = await submitInternProjectTodo({
          projectId,
          todoId,
          payload,
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: INTERN_PROJECT_TODO_QUERY_KEY(projectId, todoId),
          }),
          queryClient.invalidateQueries({
            queryKey: INTERN_PROJECT_TODOS_QUERY_KEY(projectId),
          }),
          queryClient.invalidateQueries({
            queryKey: MY_INTERN_PROJECT_TODO_SUBMISSION_QUERY_KEY(
              projectId,
              todoId,
            ),
          }),
        ]);

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [queryClient],
  );

  return {
    submitTodo,
    isSubmitting,
    errorMessage,
  };
}
