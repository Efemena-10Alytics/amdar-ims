import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { UserPortfolioProject, UserPortfolioTool } from "./use-get-portfolio";

export const PROJECT_BY_ID_QUERY_KEY = (
  userId: string | number,
  projectId: string | number,
) => ["user-portfolio", "project", String(userId), String(projectId)] as const;

/** Single project from GET user-portfolio/user/{userId}/projects/{projectId} */
export type UserPortfolioProjectDetail = UserPortfolioProject & {
  tools?: UserPortfolioTool[];
};

export function useGetProjectByUserId(
  userId: string | number | undefined | null,
  projectId: string | number | undefined | null,
) {
  return useQuery({
    queryKey: PROJECT_BY_ID_QUERY_KEY(userId ?? "", projectId ?? ""),
    queryFn: async (): Promise<UserPortfolioProjectDetail | null> => {
      const { data } = await axiosInstance.get<
        UserPortfolioProjectDetail | { data: UserPortfolioProjectDetail }
      >(`user-portfolio/user/${userId}/projects/${projectId}`);
      if (!data || typeof data !== "object") return null;
      if ("data" in data && data.data != null) {
        return data.data as UserPortfolioProjectDetail;
      }
      return data as UserPortfolioProjectDetail;
    },
    enabled:
      !!apiBaseURL &&
      userId != null &&
      userId !== "" &&
      projectId != null &&
      projectId !== "",
  });
}
