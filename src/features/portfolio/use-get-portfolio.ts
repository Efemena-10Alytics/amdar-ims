import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";

export const PORTFOLIO_QUERY_KEY = (userId: string | number) =>
  ["external-portfolio", "user", String(userId)] as const;

export type WorkExperienceItem = {
  company_name?: string;
  job_title?: string;
  industry?: string;
  job_description?: string;
  start_date?: string;
  end_date?: string;
  currently_work_there?: boolean;
};

export type EducationBackgroundItem = {
  school_name?: string;
  qualification?: string;
};

export type ProjectItem = {
  cover_image?: string;
  title?: string;
  category?: string;
  overview?: string;
  rationale?: string;
  aim?: string;
  excerpt?: string;
  solution_url?: string;
  media_link?: string;
  images?: string[];
};

export type PortfolioTool = {
  id?: number;
  name?: string;
  tool_image?: string;
  external_portfolio_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type ExternalPortfolioData = {
  id?: number;
  user_id?: number;
  title?: string;
  category?: string;
  description?: string;
  project_file?: string;
  excerpt?: string;
  embedded_media?: string | null;
  solution_url?: string;
  linkedin?: string;
  twitter?: string;
  skills?: string[];
  education_background?: EducationBackgroundItem[];
  work_experience?: WorkExperienceItem[];
  project?: ProjectItem[];
  additional_images?: string[];
  duration?: string;
  project_level?: string;
  project_industry?: string;
  project_overview?: string | null;
  rationale_for_the_project?: string | null;
  aim_of_the_project?: string | null;
  detailed_description?: string | null;
  project_scope?: string | null;
  created_at?: string;
  updated_at?: string;
  tools?: PortfolioTool[];
};

export function useGetPortfolio() {
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEY(userId ?? ""),
    queryFn: async (): Promise<ExternalPortfolioData | null> => {
      const { data } = await axiosInstance.get<ExternalPortfolioData | { data: ExternalPortfolioData }>(
        `external-portfolios/user/${userId}`,
      );
      if (!data || typeof data !== "object") return null;
      if ("data" in data && data.data != null) return data.data as ExternalPortfolioData;
      return data as ExternalPortfolioData;
    },
    enabled: !!apiBaseURL && userId != null && userId !== "",
  });
}
