import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

const INTERNSHIP_PROGRAMS_QUERY_KEY = ["internship-programs-all"];

export function useGetInternshipPrograms() {
  return useQuery({
    queryKey: INTERNSHIP_PROGRAMS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/internship-programs-all");
      return data;
    },
    enabled: !!apiBaseURL,
  });
}
