import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { UserPortfolioProjectDetail } from "./use-get-project-by-id";

export const PROJECT_SHARE_BY_ID_QUERY_KEY = (
  pathname: string | number,
  projectId: string | number,
) =>
  ["user-portfolio", "share-project", String(pathname), String(projectId)] as const;

/** Single project from GET user-portfolio/share/{pathname}/projects/{projectId} */
export function useGetProjectBySharePathname(
  pathname: string | number | undefined | null,
  projectId: string | number | undefined | null,
) {
  return useQuery({
    queryKey: PROJECT_SHARE_BY_ID_QUERY_KEY(pathname ?? "", projectId ?? ""),
    queryFn: async (): Promise<UserPortfolioProjectDetail | null> => {
      const { data } = await axiosInstance.get<
        UserPortfolioProjectDetail | { data: UserPortfolioProjectDetail }
      >(`user-portfolio/share/${pathname}/projects/${projectId}`);
      if (!data || typeof data !== "object") return null;
      if ("data" in data && data.data != null) {
        return data.data as UserPortfolioProjectDetail;
      }
      return data as UserPortfolioProjectDetail;
    },
    enabled:
      !!apiBaseURL &&
      pathname != null &&
      pathname !== "" &&
      projectId != null &&
      projectId !== "",
  });
}
