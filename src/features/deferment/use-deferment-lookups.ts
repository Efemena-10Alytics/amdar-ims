"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { resolveDefermentCohortFetchParams } from "@/features/deferment/resolve-deferment-cohort-fetch";
import { EXCLUDED_INTERNSHIP_PROGRAM_SLUGS } from "@/features/internship/excluded-internship-program-slugs";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { CheckoutCohort } from "@/types/payment";
import type {
  DefermentCohortsApiResponse,
  DefermentProgram,
  DefermentProgramsApiResponse,
} from "@/types/deferment";

export const DEFERMENT_PROGRAMS_QUERY_KEY = [
  "internships",
  "programs",
  "deferment",
] as const;

export const defermentCohortsQueryKey = (
  cohortId: number | null,
  limit: number | null,
) => ["internships", "get-next-cohorts", cohortId, limit] as const;

function normalizePrograms(
  payload: DefermentProgramsApiResponse | DefermentProgram[] | null | undefined,
): DefermentProgram[] {
  if (Array.isArray(payload)) return payload;

  const fromData = payload?.data;
  if (Array.isArray(fromData)) return fromData;

  const fromPrograms = payload?.programs;
  if (Array.isArray(fromPrograms)) return fromPrograms;

  return [];
}

function normalizeCohorts(
  payload: DefermentCohortsApiResponse | CheckoutCohort[] | null | undefined,
): CheckoutCohort[] {
  if (Array.isArray(payload)) return payload;

  const fromData = payload?.data;
  if (Array.isArray(fromData)) return fromData;

  const fromCohorts = payload?.cohorts;
  if (Array.isArray(fromCohorts)) return fromCohorts;

  return [];
}

export async function getDefermentPrograms(): Promise<DefermentProgram[]> {
  const { data } = await axiosInstance.get<
    DefermentProgramsApiResponse | DefermentProgram[]
  >("internships/programs");

  return normalizePrograms(data).filter(
    (program) =>
      !EXCLUDED_INTERNSHIP_PROGRAM_SLUGS.includes(program.slug ?? ""),
  );
}

export async function getNextCohortsForDeferment(
  cohortId: number,
  limit: number,
): Promise<CheckoutCohort[]> {
  const { data } = await axiosInstance.get<
    DefermentCohortsApiResponse | CheckoutCohort[]
  >(`internships/get-next-cohorts/${cohortId}`, {
    params: { limit },
  });

  return normalizeCohorts(data);
}

function isDefermentProgramsQueryEnabled(enabled = true): boolean {
  return enabled && !!apiBaseURL;
}

function isDefermentCohortsQueryEnabled(
  cohortId: number | null | undefined,
  limit: number | null | undefined,
  enabled = true,
): boolean {
  return (
    enabled &&
    !!apiBaseURL &&
    cohortId != null &&
    limit != null &&
    Number.isFinite(cohortId) &&
    Number.isFinite(limit)
  );
}

export function useGetDefermentPrograms(options?: { enabled?: boolean }) {
  const enabled = isDefermentProgramsQueryEnabled(options?.enabled !== false);

  return useQuery({
    queryKey: DEFERMENT_PROGRAMS_QUERY_KEY,
    queryFn: getDefermentPrograms,
    enabled,
  });
}

export function useGetNextCohortsForDeferment(options: {
  cohortStartDate?: string | null;
  selectedCohortId?: number | null;
  enabled?: boolean;
}) {
  const fetchParams = useMemo(
    () =>
      resolveDefermentCohortFetchParams(
        options.cohortStartDate,
        options.selectedCohortId,
      ),
    [options.cohortStartDate, options.selectedCohortId],
  );

  const enabled = isDefermentCohortsQueryEnabled(
    fetchParams?.cohortId,
    fetchParams?.limit,
    options.enabled !== false,
  );

  return useQuery({
    queryKey: defermentCohortsQueryKey(
      fetchParams?.cohortId ?? null,
      fetchParams?.limit ?? null,
    ),
    queryFn: () =>
      getNextCohortsForDeferment(fetchParams!.cohortId, fetchParams!.limit),
    enabled,
  });
}
