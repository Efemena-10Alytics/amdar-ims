import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { UserPortfolioData } from "./use-get-portfolio";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";

export const PORTFOLIO_SHARE_QUERY_KEY = (pathname: string) =>
  [...PORTFOLIO_QUERY_KEY(pathname), "share"] as const;

export function useGetPortfolioBySharePathname(
  pathname: string | undefined | null,
) {
  return useQuery({
    queryKey: PORTFOLIO_SHARE_QUERY_KEY(pathname ?? ""),
    queryFn: async (): Promise<UserPortfolioData | null> => {
      const { data } = await axiosInstance.get<
        UserPortfolioData | { data: UserPortfolioData }
      >(`user-portfolio/share/${pathname}`);
      if (!data || typeof data !== "object") return null;
      if ("data" in data && data.data != null) return data.data as UserPortfolioData;
      return data as UserPortfolioData;
    },
    enabled: !!apiBaseURL && pathname != null && pathname !== "",
  });
}
