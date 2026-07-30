import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  InternProjectTodoSolutionFormat,
  InternProjectTodoSubmissionSolutionItem,
  MyInternProjectTodoSubmission,
  MyInternProjectTodoSubmissionResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export type GetMyInternProjectTodoSubmissionParams = {
  projectId: number | string;
  todoId: number | string;
};

export const MY_INTERN_PROJECT_TODO_SUBMISSION_QUERY_KEY = (
  projectId: number | string,
  todoId: number | string,
) =>
  ["v3", "intern-projects", "todo-submission-me", projectId, todoId] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function readString(
  record: Record<string, unknown> | null,
  ...keys: string[]
): string | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function readNumber(
  record: Record<string, unknown> | null,
  ...keys: string[]
): number | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function normalizeSolutionType(
  value: unknown,
): InternProjectTodoSolutionFormat | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "text" || normalized === "url" || normalized === "file") {
    return normalized;
  }
  return null;
}

function normalizeSolutionItem(
  value: unknown,
  index: number,
): InternProjectTodoSubmissionSolutionItem | null {
  const record = asRecord(value);
  if (!record) return null;

  const contentText = readString(record, "contentText", "content_text");
  const contentUrl = readString(
    record,
    "contentUrl",
    "content_url",
    "url",
    "link",
  );
  const fileUrl = readString(record, "fileUrl", "file_url");
  const fileName = readString(record, "fileName", "file_name");

  const type =
    normalizeSolutionType(record.type) ??
    (fileUrl || fileName
      ? "file"
      : contentUrl || (contentText && /^https?:\/\//i.test(contentText))
        ? "url"
        : contentText
          ? "text"
          : null);

  if (!type) return null;

  return {
    id: readNumber(record, "id") ?? index,
    type,
    contentText,
    contentUrl,
    fileUrl,
    fileName,
    mimeType: readString(record, "mimeType", "mime_type"),
    sortOrder: readNumber(record, "sortOrder", "sort_order") ?? index,
    created_at: readString(record, "created_at", "createdAt") ?? "",
    updated_at: readString(record, "updated_at", "updatedAt") ?? "",
  };
}

function normalizeSolutionList(value: unknown): InternProjectTodoSubmissionSolutionItem[] {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => normalizeSolutionItem(item, index))
      .filter((item): item is InternProjectTodoSubmissionSolutionItem => Boolean(item));
  }

  const record = asRecord(value);
  if (!record) return [];

  const nested = record.solution ?? record.solutions ?? record.items;
  if (Array.isArray(nested)) {
    return nested
      .map((item, index) => normalizeSolutionItem(item, index))
      .filter((item): item is InternProjectTodoSubmissionSolutionItem => Boolean(item));
  }

  return [];
}

function normalizeMySubmission(
  value: unknown,
): MyInternProjectTodoSubmission | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = readNumber(record, "id");
  if (id == null) return null;

  return {
    id,
    internProjectTodoId:
      readNumber(record, "internProjectTodoId", "intern_project_todo_id") ?? 0,
    status: readString(record, "status") ?? "",
    submittedAt:
      readString(record, "submittedAt", "submitted_at", "created_at", "updated_at") ??
      "",
    isLate: Boolean(record.isLate ?? record.is_late),
    solution: normalizeSolutionList(
      record.solution ?? record.solutions ?? record.items,
    ),
    feedback: Array.isArray(record.feedback)
      ? (record.feedback as MyInternProjectTodoSubmission["feedback"])
      : [],
  };
}

export async function getMyInternProjectTodoSubmission({
  projectId,
  todoId,
}: GetMyInternProjectTodoSubmissionParams): Promise<MyInternProjectTodoSubmission | null> {
  try {
    const { data } =
      await axiosInstance.get<MyInternProjectTodoSubmissionResponse>(
        `v3/intern-projects/${projectId}/todos/${todoId}/submissions/me`,
      );

    if (data.success === false) {
      throw new Error(
        data.message?.trim() || "Failed to load your todo submission.",
      );
    }

    return normalizeMySubmission(data.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export function useGetMyTodoSubmission(
  projectId?: number | string | null,
  todoId?: number | string | null,
  options?: { enabled?: boolean },
) {
  const hasValidParams = Boolean(projectId && todoId);
  const enabled = options?.enabled !== false;

  return useQuery({
    queryKey: MY_INTERN_PROJECT_TODO_SUBMISSION_QUERY_KEY(
      projectId ?? "",
      todoId ?? "",
    ),
    queryFn: () =>
      getMyInternProjectTodoSubmission({
        projectId: projectId as number | string,
        todoId: todoId as number | string,
      }),
    enabled: !!apiBaseURL && hasValidParams && enabled,
  });
}
