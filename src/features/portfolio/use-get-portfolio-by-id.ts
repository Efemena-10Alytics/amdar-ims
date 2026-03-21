import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { UserPortfolioData } from "./use-get-portfolio";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";

export const PORTFOLIO_BY_USER_QUERY_KEY = (userId: string | number) =>
  [...PORTFOLIO_QUERY_KEY(userId), "by-id"] as const;

export function useGetPortfolioByUserId(userId: string | number | undefined | null) {
  return useQuery({
    queryKey: PORTFOLIO_BY_USER_QUERY_KEY(userId ?? ""),
    queryFn: async (): Promise<UserPortfolioData | null> => {
      const { data } = await axiosInstance.get<
        UserPortfolioData | { data: UserPortfolioData }
      >(`user-portfolio/user/${userId}`);
      if (!data || typeof data !== "object") return null;
      if ("data" in data && data.data != null) return data.data as UserPortfolioData;
      return data as UserPortfolioData;
    },
    enabled: !!apiBaseURL && userId != null && userId !== "",
  });
}
