"use client";

import { useQuery } from "@tanstack/react-query";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type {
  UserEnrollment,
  UserEnrollmentApiResponse,
} from "@/types/user/enrollment";

export const USER_ENROLLMENT_QUERY_KEY = ["v3", "user", "enrollment"] as const;

export async function getUserEnrollment(): Promise<UserEnrollment> {
  const { data } = await axiosInstance.get<UserEnrollmentApiResponse>(
    "v3/user/enrollment",
  );

  if (data.success === false || !data.data) {
    throw new Error(data.message?.trim() || "Failed to load enrollment.");
  }

  return data.data;
}

export function useGetUserEnrollment() {
  const { userId, isAuthReady } = useRequireUserId();

  const query = useQuery({
    queryKey: USER_ENROLLMENT_QUERY_KEY,
    queryFn: getUserEnrollment,
    enabled: !!apiBaseURL && isAuthReady && userId != null && userId !== "",
  });

  return {
    ...query,
    isAuthReady,
  };
}

/** @deprecated Use `useGetUserEnrollment` */
export const useGetUserPrograms = useGetUserEnrollment;
