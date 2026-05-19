import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { EXCLUDED_INTERNSHIP_PROGRAM_SLUGS } from "@/features/internship/excluded-internship-program-slugs";
import type { InternshipProgram } from "@/types/internship-program";

const INTERNSHIP_PROGRAMS_QUERY_KEY = ["internship-programs-all"];

type InternshipProgramsResponse =
  | InternshipProgram[]
  | { data?: InternshipProgram[];[key: string]: unknown };

export async function getInternshipProgramsAll(): Promise<InternshipProgramsResponse> {
  const { data } = await axiosInstance.get("/internship-programs-all");
  const programs = Array.isArray(data)
    ? data
    : ((data as { data?: InternshipProgram[] })?.data ?? []);
  const filtered = programs.filter(
    (p: { slug?: string }) =>
      !EXCLUDED_INTERNSHIP_PROGRAM_SLUGS.includes(p?.slug ?? ""),
  );
  return Array.isArray(data) ? filtered : { ...data, data: filtered };
}

export function useGetInternshipPrograms() {
  return useQuery({
    queryKey: INTERNSHIP_PROGRAMS_QUERY_KEY,
    queryFn: getInternshipProgramsAll,
    enabled: !!apiBaseURL,
  });
}
