import { useQuery } from "@tanstack/react-query";
import type {
  InternProject,
  InternProjectBySlugResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const INTERN_PROJECT_BY_SLUG_QUERY_KEY = (slug: string) =>
  ["v3", "intern-projects", "slug", slug] as const;

export async function getInternProjectBySlug(
  slug: string,
): Promise<InternProject> {
  const { data } = await axiosInstance.get<InternProjectBySlugResponse>(
    `v3/intern-projects/slug/${encodeURIComponent(slug)}`,
  );

  if (data.success === false || !data.data) {
    throw new Error(data.message?.trim() || "Failed to load project details.");
  }

  return data.data;
}

export function useGetProjectBySlug(slug?: string | null) {
  const normalizedSlug = slug?.trim() || "";
  const hasValidSlug = Boolean(normalizedSlug);

  return useQuery({
    queryKey: INTERN_PROJECT_BY_SLUG_QUERY_KEY(normalizedSlug),
    queryFn: () => getInternProjectBySlug(normalizedSlug),
    enabled: !!apiBaseURL && hasValidSlug,
  });
}
