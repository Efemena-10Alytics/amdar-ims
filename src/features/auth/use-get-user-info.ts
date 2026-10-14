import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { imageUrl } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/store/auth-store";
import type { UserInfo, UserInfoApiResponse } from "@/types/user/user-info";

const AVATAR_KEYS = [
  "avatar",
  "image",
  "profile_image",
  "picture",
  "profile_picture",
  "avatar_url",
] as const;

/** Returns a displayable avatar URL from user info, or null if none. */
export function getAvatarUrlFromUser(
  user: UserInfo | AuthUser | null | undefined,
): string | null {
  if (!user || typeof user !== "object") return null;
  const u = user as Record<string, unknown>;
  for (const key of AVATAR_KEYS) {
    const val = u[key];
    if (typeof val === "string" && val.trim()) {
      if (val.startsWith("http")) return val;
      const base = imageUrl.replace(/\/$/, "");
      const path = val.replace(/^\//, "");
      return base ? `${base}/${path}` : val;
    }
  }
  return null;
}

export const USER_INFO_QUERY_KEY = (userId: string | number) =>
  ["user-info", String(userId)] as const;

export async function fetchUserInfo(userId: string | number): Promise<UserInfo> {
  const { data } = await axiosInstance.get<UserInfoApiResponse>(
    `get-user-info/${userId}`,
  );
  return data.data;
}

export function useGetUserInfo() {
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  return useQuery({
    queryKey: USER_INFO_QUERY_KEY(userId ?? ""),
    queryFn: () => fetchUserInfo(userId!),
    enabled: !!apiBaseURL && userId != null && userId !== "",
  });
}
