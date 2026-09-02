import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const TEN_ANALYTICS_ONBOARDING_PROFILE_QUERY_KEY = (email: string) =>
  ["10alytics", "onboarding", "profile", email] as const;

export type TenAnalyticsOnboardingUser = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

export type TenAnalyticsOnboardingStudent = {
  student_id: string;
  pod_id: string;
  pod_name: string;
  pod_whatsapp_link: string;
};

export type TenAnalyticsOnboardingProgram = {
  id: number;
  title: string;
  slug: string;
};

export type TenAnalyticsOnboardingCohort = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  month: string;
  year: number;
  duration: number;
};

export type TenAnalyticsOnboardingProfileData = {
  user: TenAnalyticsOnboardingUser;
  student: TenAnalyticsOnboardingStudent;
  program: TenAnalyticsOnboardingProgram;
  cohort: TenAnalyticsOnboardingCohort;
  enrollment_status: string;
};

type TenAnalyticsOnboardingProfileResponse = {
  success: boolean;
  message: string;
  data?: TenAnalyticsOnboardingProfileData;
};

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

export function getTenAnalyticsOnboardingProfileErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Unable to load profile.";
}

export async function getTenAnalyticsOnboardingProfile(
  email: string,
): Promise<TenAnalyticsOnboardingProfileData> {
  const { data } =
    await axiosInstance.get<TenAnalyticsOnboardingProfileResponse>(
      "/10alytics/onboarding/profile",
      { params: { email } },
    );

  if (data.success === false || !data.data) {
    throw new Error(
      data.message?.trim() || "No user found with this email",
    );
  }

  return data.data;
}

export function useGetTenAnalyticsOnboardingProfile(
  email: string | undefined | null,
) {
  const normalizedEmail = email?.trim() ?? "";

  const query = useQuery({
    queryKey: TEN_ANALYTICS_ONBOARDING_PROFILE_QUERY_KEY(normalizedEmail),
    queryFn: () => getTenAnalyticsOnboardingProfile(normalizedEmail),
    enabled: !!apiBaseURL && !!normalizedEmail,
    retry: false,
  });

  return {
    ...query,
    errorMessage: query.isError
      ? getTenAnalyticsOnboardingProfileErrorMessage(query.error)
      : null,
  };
}
