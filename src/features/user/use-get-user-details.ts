import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";

export const USER_DETAILS_QUERY_KEY = ["user-details"] as const;

export type UserDetails = Record<string, unknown>;

type UserDetailsResponse = {
  data: UserDetails;
};

export function useGetUserDetails() {
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  return useQuery({
    queryKey: [...USER_DETAILS_QUERY_KEY, userId ?? ""],
    queryFn: async (): Promise<UserDetails> => {
      const { data } = await axiosInstance.get<UserDetailsResponse>(
        `user-details/${userId}`,
      );
      // React Query requires a defined value; API may use data.data or return the object at top level
      const payload = data?.data ?? data;
      return payload && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as UserDetails)
        : {};
    },
    enabled: !!apiBaseURL && userId != null && userId !== "",
  });
}
