"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import type { UserEnrollment } from "@/types/user/enrollment";

export type EnrollmentProgressSection = {
  percent: number;
  completed: number;
  total: number;
  isComplete: boolean;
};

export type EnrollmentCareerStageProgress = {
  stage: string;
  label: string;
  percent: number;
  activitiesDone: number;
  activitiesTotal: number;
  isComplete: boolean;
};

export type EnrollmentProgress = {
  enrollmentId: number;
  cohortId: number;
  programId: number;
  onboarding: EnrollmentProgressSection;
  preDiagnostic: EnrollmentProgressSection;
  careerStages: EnrollmentCareerStageProgress[];
  stagesCompleted: number;
  stagesTotal: number;
};

export type EnrollmentProgressApiResponse = {
  success: boolean;
  message: string;
  data: EnrollmentProgress | null;
};

export type GetEnrollmentProgressParams = {
  cohortId: string | number;
  programId: string | number;
};

export const ENROLLMENT_PROGRESS_QUERY_KEY = (
  cohortId: string | number,
  programId: string | number,
) => ["v3/user/enrollment/progress", cohortId, programId] as const;

class EnrollmentProgressApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnrollmentProgressApiError";
  }
}

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as Record<string, unknown>).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

export function getEnrollmentProgressErrorMessage(error: unknown): string {
  if (error instanceof EnrollmentProgressApiError) return error.message;
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Unable to load enrollment progress.";
}

function toEnrollmentProgressApiError(
  error: unknown,
): EnrollmentProgressApiError {
  if (error instanceof EnrollmentProgressApiError) return error;
  const apiMessage = axios.isAxiosError(error)
    ? extractApiMessage(error.response?.data)
    : null;
  if (apiMessage) return new EnrollmentProgressApiError(apiMessage);
  if (error instanceof Error && error.message) {
    return new EnrollmentProgressApiError(error.message);
  }
  return new EnrollmentProgressApiError("Unable to load enrollment progress.");
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

function hasValidId(
  id: string | number | undefined | null,
): id is string | number {
  return id !== undefined && id !== null && id !== "";
}

export async function getEnrollmentProgress({
  cohortId,
  programId,
}: GetEnrollmentProgressParams): Promise<EnrollmentProgress> {
  try {
    const { data } = await axiosInstance.get<EnrollmentProgressApiResponse>(
      "v3/user/enrollment/progress",
      {
        params: {
          cohort_id: cohortId,
          program_id: programId,
        },
      },
    );

    if (data.success === false || !data.data) {
      throw new EnrollmentProgressApiError(
        extractApiMessage(data) ?? "Unable to load enrollment progress.",
      );
    }

    return data.data;
  } catch (error) {
    throw toEnrollmentProgressApiError(error);
  }
}

export function useGetInternshipProgress() {
  const enrollmentQuery = useGetUserEnrollment();
  const { cohortId, programId } = getEnrollmentIds(enrollmentQuery.data);

  const progressQuery = useQuery({
    queryKey: ENROLLMENT_PROGRESS_QUERY_KEY(cohortId ?? "", programId ?? ""),
    queryFn: () =>
      getEnrollmentProgress({
        cohortId: cohortId as string | number,
        programId: programId as string | number,
      }),
    enabled:
      !!apiBaseURL &&
      enrollmentQuery.isAuthReady &&
      enrollmentQuery.isSuccess &&
      hasValidId(cohortId) &&
      hasValidId(programId),
  });

  return {
    ...progressQuery,
    errorMessage: progressQuery.isError
      ? getEnrollmentProgressErrorMessage(progressQuery.error)
      : null,
    enrollment: enrollmentQuery.data,
    cohortId,
    programId,
    isEnrollmentLoading:
      !enrollmentQuery.isAuthReady ||
      enrollmentQuery.isLoading ||
      (enrollmentQuery.isFetching && !enrollmentQuery.data),
    isEnrollmentError: enrollmentQuery.isError,
    enrollmentError: enrollmentQuery.error,
    refetchEnrollment: enrollmentQuery.refetch,
  };
}
