import { useCallback, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import type {
  EditInternProjectTodoSubmissionPayload,
  MyInternProjectTodoSubmission,
  MyInternProjectTodoSubmissionResponse,
} from "./internship-project.types";
import {
  buildTodoSubmissionFormData,
  submissionItemsHaveFile,
} from "./build-todo-submission-form-data";
import { MY_INTERN_PROJECT_TODO_SUBMISSION_QUERY_KEY } from "./use-get-my-todo-submission";
import { INTERN_PROJECT_TODO_QUERY_KEY } from "./use-get-todo-by-id";
import { INTERN_PROJECT_TODOS_QUERY_KEY } from "./use-get-todos-by-project-id";
import { axiosInstance } from "@/lib/axios-instance";

export type EditMyInternProjectTodoSubmissionParams = {
  projectId: number | string;
  todoId: number | string;
  typeId: number | string;
  payload: EditInternProjectTodoSubmissionPayload;
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
  return "Failed to update todo submission.";
}

export async function editMyInternProjectTodoSubmission({
  projectId,
  todoId,
  typeId,
  payload,
}: EditMyInternProjectTodoSubmissionParams): Promise<MyInternProjectTodoSubmission> {
  const hasFile = submissionItemsHaveFile(payload.items);
  const body = hasFile
    ? buildTodoSubmissionFormData(payload.items)
    : payload;
  const url = `v3/intern-projects/${projectId}/todos/${todoId}/types/${typeId}/submissions`;
  const config = hasFile
    ? {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    : {
        headers: {
          "Content-Type": "application/json",
        },
      };

  const { data } = hasFile
    ? await axiosInstance.post<MyInternProjectTodoSubmissionResponse>(
        url,
        body,
        config,
      )
    : await axiosInstance.put<MyInternProjectTodoSubmissionResponse>(
        url,
        body,
        config,
      );

  if (data.success === false) {
    throw new Error(
      data.message?.trim() || "Failed to update todo submission.",
    );
  }

  if (!data.data) {
    throw new Error(
      data.message?.trim() || "Failed to update todo submission.",
    );
  }

  return data.data;
}

export function useEditMyTodoSubmission() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const editTodoSubmission = useCallback(
    async ({
      projectId,
      todoId,
      typeId,
      payload,
    }: EditMyInternProjectTodoSubmissionParams) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        const response = await editMyInternProjectTodoSubmission({
          projectId,
          todoId,
          typeId,
          payload,
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
    editTodoSubmission,
    isSubmitting,
    errorMessage,
  };
}
