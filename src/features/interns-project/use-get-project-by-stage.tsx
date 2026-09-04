"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import type {
  InternProject,
  InternProjectCareerStage,
  InternProjectsResponse,
} from "./internship-project.types";
import { InternProjectStatus } from "./internship-project.types";
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

/** Active (published) or completed projects unlock a career stage. */
export function isCareerStageUnlockingProject(
  project: Pick<InternProject, "status">,
): boolean {
  const status = project.status;
  if (status == null) return true;
  const normalized = String(status).toLowerCase();
  return (
    normalized === InternProjectStatus.Active ||
    normalized === InternProjectStatus.Completed ||
    normalized === "published"
  );
}

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

/**
 * Loads published projects for many career stages at once so stage cards can
 * unlock from Active/Completed project availability.
 */
export function usePublishedProjectsUnlockByStages(
  careerStages: InternProjectCareerStage[],
  params: {
    cohortId?: number | string | null;
    programId?: number | string | null;
  } = {},
) {
  const selected = useSelectedEnrollmentIds();
  const cohortId = params.cohortId ?? selected.cohortId;
  const programId = params.programId ?? selected.programId;
  const hasValidIds = Boolean(cohortId && programId);

  const queries = useQueries({
    queries: careerStages.map((careerStage) => ({
      queryKey: INTERN_PROJECTS_BY_STAGE_QUERY_KEY(
        cohortId ?? "",
        programId ?? "",
        careerStage,
      ),
      queryFn: () =>
        getInternProjectsPublishedByStage({
          cohortId: cohortId as number | string,
          programId: programId as number | string,
          careerStage,
        }),
      enabled: !!apiBaseURL && hasValidIds,
    })),
  });

  const unlockingByApiStage: Record<string, boolean> = {};
  careerStages.forEach((careerStage, index) => {
    const query = queries[index];
    const projects = query?.data ?? [];
    unlockingByApiStage[careerStage] = projects.some(
      isCareerStageUnlockingProject,
    );
  });

  const isResolving =
    !hasValidIds ||
    queries.some((query) => query.isPending || query.isLoading);

  return {
    unlockingByApiStage,
    isResolving,
  };
}
