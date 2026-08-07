"use client";

import { useQuery } from "@tanstack/react-query";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export type InternshipDetailsProgram = {
  id: number;
  title: string;
};

export type InternshipDetailsCohort = {
  id: number;
  name: string;
};

export type InternshipDetails = {
  enrollmentId: number;
  program: InternshipDetailsProgram;
  cohort: InternshipDetailsCohort;
  skillLevel: string | null;
  location: string | null;
  gender: string | null;
  findOut: string | null;
  decisionInfluenced: string | null;
  sessionInfluenced: string | null;
  hoursPerWeek: string | null;
};

export type InternshipDetailsApiResponse = {
  success: boolean;
  message: string;
  data: InternshipDetails | null;
};

export const INTERNSHIP_DETAILS_QUERY_KEY = [
  "v3",
  "user",
  "internship-details",
] as const;

export async function getInternshipDetails(): Promise<InternshipDetails> {
  const { data } = await axiosInstance.get<InternshipDetailsApiResponse>(
    "v3/user/internship-details",
  );

  if (data.success === false || !data.data) {
    throw new Error(
      data.message?.trim() || "Failed to load internship details.",
    );
  }

  return data.data;
}

export function useGetInternshipDetails() {
  const { userId, isAuthReady } = useRequireUserId();

  const query = useQuery({
    queryKey: INTERNSHIP_DETAILS_QUERY_KEY,
    queryFn: getInternshipDetails,
    enabled: !!apiBaseURL && isAuthReady && userId != null && userId !== "",
  });

  return {
    ...query,
    isAuthReady,
  };
}
