import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { InternshipProgram } from "@/types/internship-program";

const INTERNSHIP_PROGRAM_QUERY_KEY = (id: string | number) => [
  "internship-program",
  id,
];

export async function getInternshipProgram(
  id: string | number,
): Promise<InternshipProgram> {
  const { data } = await axiosInstance.get<{ data: InternshipProgram }>(
    `/internship-programs/${id}`,
  );
  return data.data;
}

export function useGetInternshipProgram(id: string | number | undefined | null) {
  return useQuery({
    queryKey: INTERNSHIP_PROGRAM_QUERY_KEY(id ?? ""),
    queryFn: () => getInternshipProgram(id as string | number),
    enabled: !!apiBaseURL && (id !== undefined && id !== null && id !== ""),
  });
}
