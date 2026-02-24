import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

type NextCohortResponse = {
  data?: {
    start_date?: string | null;
  };
};

export function useGetNextCohort() {
  return useQuery({
    queryKey: ["internships", "next-cohort"],
    queryFn: async () => {
      const response = await axiosInstance.get<NextCohortResponse>(
        "/internships/next-cohort",
      );
      return response?.data?.data?.start_date ?? null;
    },
    enabled: !!apiBaseURL,
  });
}
