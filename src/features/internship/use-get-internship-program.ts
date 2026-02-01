import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { InternshipProgram } from "@/types/internship-program";

const INTERNSHIP_PROGRAM_QUERY_KEY = (id: string | number) => [
  "internship-program",
  id,
];

export function useGetInternshipProgram(id: string | number | undefined | null) {
  return useQuery({
    queryKey: INTERNSHIP_PROGRAM_QUERY_KEY(id ?? ""),
    queryFn: async (): Promise<InternshipProgram> => {
      const { data } = await axiosInstance.get<{ data: InternshipProgram }>(
        `/internship-program/${id}`
      );
      return data.data;
    },
    enabled: !!apiBaseURL && (id !== undefined && id !== null && id !== ""),
  });
}
