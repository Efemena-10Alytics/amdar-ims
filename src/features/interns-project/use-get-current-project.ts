"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  CurrentInternProjectDetails,
  CurrentInternProjectEnvelope,
  CurrentInternProjectPayload,
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

function isProjectDetails(
  value: unknown,
): value is CurrentInternProjectDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    "currentWeek" in value &&
    "project" in value &&
    !("currentProject" in value)
  );
}

function isPayload(value: unknown): value is CurrentInternProjectPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    ("currentTask" in value || "currentProject" in value) &&
    !("data" in value)
  );
}

function isEnvelope(value: unknown): value is CurrentInternProjectEnvelope {
  return typeof value === "object" && value !== null && "data" in value;
}

function normalizeCurrentInternProjectResponse(
  body: CurrentInternProjectResponse,
): CurrentInternProjectPayload {
  if (isPayload(body)) {
    return {
      currentTask: body.currentTask ?? null,
      currentProject: body.currentProject ?? null,
    };
  }

  if (isEnvelope(body)) {
    if (body.success === false) {
      throw new Error(
        body.message?.trim() || "Failed to load current intern project.",
      );
    }

    const payload = body.data;
    if (!payload) {
      throw new Error(
        body.message?.trim() || "Failed to load current intern project.",
      );
    }

    if (isPayload(payload)) {
      return {
        currentTask: payload.currentTask ?? null,
        currentProject: payload.currentProject ?? null,
      };
    }

    if (isProjectDetails(payload)) {
      return {
        currentTask: null,
        currentProject: payload,
      };
    }
  }

  throw new Error("Failed to load current intern project.");
}

export async function getCurrentInternProject({
  cohortId,
  programId,
}: GetCurrentInternProjectParams): Promise<CurrentInternProjectPayload> {
  const { data } = await axiosInstance.get<CurrentInternProjectResponse>(
    "v3/intern-projects/current",
    {
      params: {
        cohort_id: cohortId,
        program_id: programId,
      },
    },
  );

  return normalizeCurrentInternProjectResponse(data);
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
