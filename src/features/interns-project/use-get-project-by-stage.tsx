"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  InternProject,
  InternProjectCareerStage,
  InternProjectsResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

export type GetInternProjectsPublishedParams = {
  cohortId: number | string;
  programId: number | string;
  careerStage: InternProjectCareerStage;
};

export const INTERN_PROJECTS_BY_STAGE_QUERY_KEY = (
  cohortId: number | string,
  programId: number | string,
  careerStage: string,
) =>
  ["v3", "intern-projects", "published", cohortId, programId, careerStage] as const;

export async function getInternProjectsPublishedByStage({
  cohortId,
  programId,
  careerStage,
}: GetInternProjectsPublishedParams): Promise<InternProject[]> {
  const { data } = await axiosInstance.get<InternProjectsResponse>(
    "v3/intern-projects/published",
    {
      params: {
        cohort_id: cohortId,
        program_id: programId,
        careerStage,
      },
    },
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to load published projects.");
  }

  return data.data ?? [];
}

export function useGetProjectByStage(
  params: Partial<GetInternProjectsPublishedParams> = {},
) {
  const selected = useSelectedEnrollmentIds();
  const cohortId = params.cohortId ?? selected.cohortId;
  const programId = params.programId ?? selected.programId;
  const careerStage = params.careerStage;
  const hasValidParams = Boolean(cohortId && programId && careerStage);

  return useQuery({
    queryKey: INTERN_PROJECTS_BY_STAGE_QUERY_KEY(
      cohortId ?? "",
      programId ?? "",
      careerStage ?? "",
    ),
    queryFn: () =>
      getInternProjectsPublishedByStage({
        cohortId: cohortId as number | string,
        programId: programId as number | string,
        careerStage: careerStage as InternProjectCareerStage,
      }),
    enabled: !!apiBaseURL && hasValidParams,
  });
}
