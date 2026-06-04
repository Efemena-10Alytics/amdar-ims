import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import type {
  UserEnrollment,
  UserEnrollmentApiResponse,
} from "@/types/user/enrollment";

export const USER_ENROLLMENT_QUERY_KEY = ["v3", "user", "enrollment"] as const;

export async function getUserEnrollment(): Promise<UserEnrollment> {
  const { data } = await axiosInstance.get<UserEnrollmentApiResponse>(
    "v3/user/enrollment",
  );
  return data.data;
}

export function useGetUserEnrollment() {
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  return useQuery({
    queryKey: USER_ENROLLMENT_QUERY_KEY,
    queryFn: getUserEnrollment,
    enabled: !!apiBaseURL && userId != null && userId !== "",
  });
}

/** @deprecated Use `useGetUserEnrollment` */
export const useGetUserPrograms = useGetUserEnrollment;
