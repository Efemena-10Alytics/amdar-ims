import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

const INTERNSHIP_PROGRAMS_QUERY_KEY = ["internship-programs-all"];

const EXCLUDED_PROGRAM_SLUGS = [
  "hr-analytics-career-experience-internship-hacei",
  "cybersecurity-career-experience-internship-ccei",
  "financial-analytics-career-experience-internship-facei",
  // "devops-career-experience-internship-dcei",
  // "product-design-career-experience-internship-pdcei",
  // "data-engineering-career-experience-internship-decei",
];

export function useGetInternshipPrograms() {
  return useQuery({
    queryKey: INTERNSHIP_PROGRAMS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/internship-programs-all");
      const programs = Array.isArray(data)
        ? data
        : ((data as { data?: unknown[] })?.data ?? []);
      const filtered = programs.filter(
        (p: { slug?: string }) =>
          !EXCLUDED_PROGRAM_SLUGS.includes(p?.slug ?? ""),
      );
      return Array.isArray(data) ? filtered : { ...data, data: filtered };
    },
    enabled: !!apiBaseURL,
  });
}
