import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import type { AuthUser } from "@/store/auth-store";
import type { UserEnrollment } from "@/types/user/enrollment";
import type {
  GetOnboardingParams,
  Onboarding,
  OnboardingApiResponse,
  OnboardingCohortLead,
  OnboardingStepKey,
} from "./types";

export const ONBOARDING_QUERY_KEY = (
  cohortId: string | number,
  programId: string | number,
) => ["v3/onboarding", cohortId, programId] as const;

// --- API errors ---

class OnboardingApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OnboardingApiError";
  }
}

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as Record<string, unknown>).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

export function getOnboardingErrorMessage(error: unknown): string {
  if (error instanceof OnboardingApiError) return error.message;
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Unable to load onboarding.";
}

function toOnboardingApiError(error: unknown): OnboardingApiError {
  if (error instanceof OnboardingApiError) return error;
  const apiMessage = axios.isAxiosError(error)
    ? extractApiMessage(error.response?.data)
    : null;
  if (apiMessage) return new OnboardingApiError(apiMessage);
  if (error instanceof Error && error.message) {
    return new OnboardingApiError(error.message);
  }
  return new OnboardingApiError("Unable to load onboarding.");
}

// --- Enrollment IDs (from v3/user/enrollment) ---

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

// --- Small UI helpers ---

export function buildOnboardingStepHref(step: OnboardingStepKey): string {
  return `/onboarding?step=${encodeURIComponent(step)}`;
}

export function getStudentDisplayName(user: AuthUser | null): string {
  if (!user || typeof user !== "object") return "";
  const record = user as Record<string, unknown>;
  const nested =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;
  const first =
    nested.firstName ?? nested.first_name ?? nested.name ?? nested.username;
  return typeof first === "string" ? first.trim() : "";
}

export function formatLeadPhone(lead: OnboardingCohortLead): string {
  const code = lead.countryCode?.trim() ?? "";
  const phone = lead.phone?.trim() ?? "";
  if (!code) return phone;
  return `${code.startsWith("+") ? code : `+${code}`} ${phone}`.trim();
}

// --- Fetch ---

function hasValidId(id: string | number | undefined | null): id is string | number {
  return id !== undefined && id !== null && id !== "";
}

export async function getOnboarding({
  cohortId,
  programId,
}: GetOnboardingParams): Promise<Onboarding> {
  try {
    const { data } = await axiosInstance.get<OnboardingApiResponse>("v3/onboarding", {
      params: { cohort_id: cohortId, program_id: programId },
    });

    if (data.success === false || !data.data) {
      throw new OnboardingApiError(
        extractApiMessage(data) ?? "Unable to load onboarding.",
      );
    }

    return data.data;
  } catch (error) {
    throw toOnboardingApiError(error);
  }
}

export function useGetOnboarding() {
  const enrollmentQuery = useGetUserEnrollment();
  const { cohortId, programId } = getEnrollmentIds(enrollmentQuery.data);

  const onboardingQuery = useQuery({
    queryKey: ONBOARDING_QUERY_KEY(cohortId ?? "", programId ?? ""),
    queryFn: () =>
      getOnboarding({
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
    ...onboardingQuery,
    errorMessage: onboardingQuery.isError
      ? getOnboardingErrorMessage(onboardingQuery.error)
      : null,
    enrollment: enrollmentQuery.data,
    cohortId,
    programId,
    isEnrollmentLoading:
      !enrollmentQuery.isAuthReady || enrollmentQuery.isLoading,
    isEnrollmentError: enrollmentQuery.isError,
    enrollmentError: enrollmentQuery.error,
    refetchEnrollment: enrollmentQuery.refetch,
  };
}
