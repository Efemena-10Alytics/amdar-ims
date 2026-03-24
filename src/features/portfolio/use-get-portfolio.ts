import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";

export const PORTFOLIO_QUERY_KEY = (userId: string | number) =>
  ["user-portfolio", String(userId)] as const;

export type UserPortfolioPersonalInfo = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  phoneNumber?: string | null;
  location?: string | null;
  countryCode?: string | null;
};

export type UserPortfolioSocial = {
  linkedIn?: string | null;
  twitter?: string | null;
};

export type UserPortfolioBio = {
  jobTitle?: string | null;
  yearsOfExperience?: string | null;
  projectCount?: string | null;
  bio?: string | null;
};

export type UserPortfolioCategory = {
  title?: string | null;
  specializationData?: unknown[];
  skills?: unknown[];
};

export type UserPortfolioTool = {
  name?: string;
  image?: string | null;
  url?: string | null;
};

export type UserPortfolioWorkExperienceItem = {
  companyName?: string | null;
  jobTitle?: string | null;
  industry?: string | null;
  jobDescription?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  currentlyWorkThere?: boolean;
};

export type UserPortfolioEducationItem = {
  schoolName?: string | null;
  qualification?: string | null;
};

export type UserPortfolioProject = {
  id?: string | number | null;
  coverImage?: string | null;
  title?: string | null;
  category?: string | null;
  overview?: string | null;
  rationale?: string | null;
  aim?: string | null;
  scope?: string | null;
  excerpt?: string | null;
  solutionUrl?: string | null;
  mediaLink?: string | null;
  image?: string[];
};

export type UserPortfolioData = {
  personalInfo?: UserPortfolioPersonalInfo;
  social?: UserPortfolioSocial;
  bio?: UserPortfolioBio;
  category?: UserPortfolioCategory;
  tools?: UserPortfolioTool[];
  workExperience?: UserPortfolioWorkExperienceItem[];
  educationalBackground?: UserPortfolioEducationItem[];
  projects?: UserPortfolioProject[];
};

export function useGetPortfolio() {
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEY(userId ?? ""),
    queryFn: async (): Promise<UserPortfolioData | null> => {
      const { data } = await axiosInstance.get<
        UserPortfolioData | { data: UserPortfolioData }
      >("user-portfolio");
      if (!data || typeof data !== "object") return null;
      if ("data" in data && data.data != null) return data.data as UserPortfolioData;
      return data as UserPortfolioData;
    },
    enabled: !!apiBaseURL && userId != null && userId !== "",
  });
}
