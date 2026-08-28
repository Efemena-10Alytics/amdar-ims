"use client";

import { useQuery } from "@tanstack/react-query";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { UserProgramsResponse } from "@/types/internship-program/user-program";
import { normalizeUserProgramsResponse } from "@/types/internship-program/user-program";

export const USER_INTERNSHIP_PROGRAMS_QUERY_KEY = [
  "internships",
  "user-programs",
] as const;

export async function getUserInternshipPrograms(): Promise<UserProgramsResponse> {
  const { data } = await axiosInstance.get<UserProgramsResponse>(
    "internships/user-programs",
  );

  return normalizeUserProgramsResponse(data);
}

export function useGetUserInternshipPrograms(options?: { enabled?: boolean }) {
  const { userId, isAuthReady } = useRequireUserId();

  const query = useQuery({
    queryKey: USER_INTERNSHIP_PROGRAMS_QUERY_KEY,
    queryFn: getUserInternshipPrograms,
    enabled:
      options?.enabled !== false &&
      !!apiBaseURL &&
      isAuthReady &&
      userId != null &&
      userId !== "",
  });

  return {
    ...query,
    isAuthReady,
  };
}
