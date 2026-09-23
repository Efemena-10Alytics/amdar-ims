import { useCallback, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import type {
  CompleteInternProjectTodoTypePayload,
  CompleteInternProjectTodoTypeResponse,
} from "./internship-project.types";
import { INTERN_PROJECT_TODO_QUERY_KEY } from "./use-get-todo-by-id";
import { INTERN_PROJECT_TODOS_QUERY_KEY } from "./use-get-todos-by-project-id";
import { axiosInstance } from "@/lib/axios-instance";

export type CompleteInternProjectTodoParams = {
  projectId: number | string;
  todoId: number | string;
  typeId: number | string;
  payload?: CompleteInternProjectTodoTypePayload;
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
  return "Failed to complete todo.";
}

export async function completeInternProjectTodo({
  projectId,
  todoId,
  typeId,
  payload = { status: "completed" },
}: CompleteInternProjectTodoParams): Promise<CompleteInternProjectTodoTypeResponse> {
  const { data } = await axiosInstance.patch<CompleteInternProjectTodoTypeResponse>(
    `v3/intern-projects/${projectId}/todos/${todoId}/types/${typeId}/status`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (
    data.success === false ||
    (typeof data.status === "string" &&
      data.status.toLowerCase() !== "success")
  ) {
    throw new Error(data.message?.trim() || "Failed to complete todo.");
  }

  return data;
}

export function useCompleteTodo() {
  const queryClient = useQueryClient();
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const completeTodo = useCallback(
    async ({
      projectId,
      todoId,
      typeId,
      payload,
    }: CompleteInternProjectTodoParams) => {
      setIsCompleting(true);
      setErrorMessage("");

      try {
        const response = await completeInternProjectTodo({
          projectId,
          todoId,
          typeId,
          payload,
        });

        await Promise.all([
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
        setIsCompleting(false);
      }
    },
    [queryClient],
  );

  return {
    completeTodo,
    isCompleting,
    errorMessage,
  };
}
