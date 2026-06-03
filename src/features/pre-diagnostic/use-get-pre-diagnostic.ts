import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import type { UserEnrollment } from "@/types/user/enrollment";
import type {
  GetPreDiagnosticParams,
  PreDiagnostic,
  PreDiagnosticApiResponse,
  PreDiagnosticVideoItem,
} from "./types";

export const PRE_DIAGNOSTIC_QUERY_KEY = (
  cohortId: string | number,
  programId: string | number,
) => ["v3/pre-diagnostics", cohortId, programId] as const;

class PreDiagnosticApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreDiagnosticApiError";
  }
}

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as Record<string, unknown>).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

export function getPreDiagnosticErrorMessage(error: unknown): string {
  if (error instanceof PreDiagnosticApiError) return error.message;
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Unable to load pre-diagnostic.";
}

function toPreDiagnosticApiError(error: unknown): PreDiagnosticApiError {
  if (error instanceof PreDiagnosticApiError) return error;
  const apiMessage = axios.isAxiosError(error)
    ? extractApiMessage(error.response?.data)
    : null;
  if (apiMessage) return new PreDiagnosticApiError(apiMessage);
  if (error instanceof Error && error.message) {
    return new PreDiagnosticApiError(error.message);
  }
  return new PreDiagnosticApiError("Unable to load pre-diagnostic.");
}

function pickId(value: unknown): string | number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return null;
}

function getEnrollmentIds(enrollment?: UserEnrollment | null) {
  if (!enrollment) return { cohortId: null, programId: null };
  return {
    cohortId: pickId(enrollment.cohort_id) ?? pickId(enrollment.cohort?.id),
    programId: pickId(enrollment.program_id) ?? pickId(enrollment.program?.id),
  };
}

function hasValidId(id: string | number | undefined | null): id is string | number {
  return id !== undefined && id !== null && id !== "";
}

export function getPreDiagnosticVideoDescription(
  item?: PreDiagnosticVideoItem | null,
  fallback = "",
): string {
  if (!item) return fallback;
  return item.description?.trim() || item.instructions?.trim() || fallback;
}

export async function getPreDiagnostic({
  cohortId,
  programId,
}: GetPreDiagnosticParams): Promise<PreDiagnostic> {
  try {
    const { data } = await axiosInstance.get<PreDiagnosticApiResponse>(
      "v3/pre-diagnostics",
      {
        params: { cohort_id: cohortId, program_id: programId },
      },
    );

    if (data.success === false || !data.data) {
      throw new PreDiagnosticApiError(
        extractApiMessage(data) ?? "Unable to load pre-diagnostic.",
      );
    }

    return data.data;
  } catch (error) {
    throw toPreDiagnosticApiError(error);
  }
}

export function useGetPreDiagnostic() {
  const enrollmentQuery = useGetUserEnrollment();
  const { cohortId, programId } = getEnrollmentIds(enrollmentQuery.data);

  const preDiagnosticQuery = useQuery({
    queryKey: PRE_DIAGNOSTIC_QUERY_KEY(cohortId ?? "", programId ?? ""),
    queryFn: () =>
      getPreDiagnostic({
        cohortId: cohortId as string | number,
        programId: programId as string | number,
      }),
    enabled:
      !!apiBaseURL &&
      enrollmentQuery.isSuccess &&
      hasValidId(cohortId) &&
      hasValidId(programId),
  });

  return {
    ...preDiagnosticQuery,
    errorMessage: preDiagnosticQuery.isError
      ? getPreDiagnosticErrorMessage(preDiagnosticQuery.error)
      : null,
    enrollment: enrollmentQuery.data,
    cohortId,
    programId,
    isEnrollmentLoading: enrollmentQuery.isLoading,
    isEnrollmentError: enrollmentQuery.isError,
    enrollmentError: enrollmentQuery.error,
    refetchEnrollment: enrollmentQuery.refetch,
  };
}
