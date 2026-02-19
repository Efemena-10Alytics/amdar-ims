import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/store/auth-store";

const USER_INFO_QUERY_KEY = (userId: string | number) =>
  ["user-info", String(userId)] as const;

function getUserId(user: AuthUser | null): string | number | null {
  if (!user || typeof user !== "object") return null;
  const id = (user as Record<string, unknown>).id;
  if (id != null && (typeof id === "string" || typeof id === "number"))
    return id;
  const nested = (user as Record<string, unknown>).user;
  if (nested && typeof nested === "object" && "id" in nested) {
    const nestedId = (nested as Record<string, unknown>).id;
    if (nestedId != null && (typeof nestedId === "string" || typeof nestedId === "number"))
      return nestedId;
  }
  return null;
}

export function useGetUserInfo() {
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  return useQuery({
    queryKey: USER_INFO_QUERY_KEY(userId ?? ""),
    queryFn: async (): Promise<AuthUser> => {
      const { data } = await axiosInstance.get<{ data: AuthUser }>(
        `get-user-info/${userId}`,
      );
      return data.data;
    },
    enabled: !!apiBaseURL && userId != null && userId !== "",
  });
}
