"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  CurrentInternProject,
  CurrentInternProjectResponse,
} from "./internship-project.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

export type GetCurrentInternProjectParams = {
  cohortId: number | string;
  programId: number | string;
};

export const CURRENT_INTERN_PROJECT_QUERY_KEY = (
  cohortId: number | string,
  programId: number | string,
) => ["v3", "intern-projects", "current", cohortId, programId] as const;

export async function getCurrentInternProject({
  cohortId,
  programId,
}: GetCurrentInternProjectParams): Promise<CurrentInternProject> {
  const { data } = await axiosInstance.get<CurrentInternProjectResponse>(
    "v3/intern-projects/current",
    {
      params: {
        cohort_id: cohortId,
        program_id: programId,
      },
    },
  );

  if (data.success === false || !data.data) {
    throw new Error(
      data.message?.trim() || "Failed to load current intern project.",
    );
  }

  return data.data;
}

export function useGetCurrentProject(
  cohortId?: number | string | null,
  programId?: number | string | null,
  options?: { enabled?: boolean },
) {
  const selected = useSelectedEnrollmentIds();
  const resolvedCohortId = cohortId ?? selected.cohortId;
  const resolvedProgramId = programId ?? selected.programId;
  const hasValidParams = Boolean(resolvedCohortId && resolvedProgramId);
  const enabled = options?.enabled !== false;

  return useQuery({
    queryKey: CURRENT_INTERN_PROJECT_QUERY_KEY(
      resolvedCohortId ?? "",
      resolvedProgramId ?? "",
    ),
    queryFn: () =>
      getCurrentInternProject({
        cohortId: resolvedCohortId as number | string,
        programId: resolvedProgramId as number | string,
      }),
    enabled: !!apiBaseURL && hasValidParams && enabled,
  });
}
