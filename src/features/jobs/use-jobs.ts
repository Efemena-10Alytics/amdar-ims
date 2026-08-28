import { useQuery } from "@tanstack/react-query";
import type { JobsFilters, JobsResponse } from "./types";
import { normalizeJobsResponse } from "./normalize";

const JOBS_API = "/api/jobs";
const MAX_PAGE_SIZE = 100;

export type UseJobsParams = JobsFilters & {
  page?: number;
  pageSize?: number;
};

function buildQueryString(params: UseJobsParams): string {
  const searchParams = new URLSearchParams();

  const { page, pageSize, ...filters } = params;

  Object.entries(filters).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  searchParams.set("page", String(page ?? 1));
  searchParams.set("pageSize", String(Math.min(pageSize ?? 9, MAX_PAGE_SIZE)));

  return searchParams.toString();
}

export function useJobs(params: UseJobsParams) {
  const queryString = buildQueryString(params);

  return useQuery({
    queryKey: ["jobs", queryString],
    queryFn: async (): Promise<JobsResponse> => {
      const res = await fetch(`${JOBS_API}?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      return normalizeJobsResponse(data);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
