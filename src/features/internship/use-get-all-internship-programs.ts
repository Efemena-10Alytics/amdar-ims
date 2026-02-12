import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

const INTERNSHIP_PROGRAMS_QUERY_KEY = ["internship-programs-all"];

const EXCLUDED_PROGRAM_TITLES = [
  "HR Analytics Career Experience Internship (HACEI)",
  "Cybersecurity Career Experience Internship (CCEI)",
  "Financial Analytics Career Experience Internship (FACEI)",
];

export function useGetInternshipPrograms() {
  return useQuery({
    queryKey: INTERNSHIP_PROGRAMS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/internship-programs-all");
      const programs = Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];
      const filtered = programs.filter(
        (p: { title?: string }) => !EXCLUDED_PROGRAM_TITLES.includes(p?.title ?? "")
      );
      return Array.isArray(data) ? filtered : { ...data, data: filtered };
    },
    enabled: !!apiBaseURL,
  });
}
