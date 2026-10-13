"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  GetLearnsQuery,
  LearnsApiResponse,
  LearnsPaginatedResponse,
} from "@/features/learn/learn.types";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

const EMPTY_LEARNS_PAGE = (page: number, perPage: number): LearnsPaginatedResponse => ({
  current_page: page,
  data: [],
  first_page_url: null,
  from: null,
  last_page: 1,
  last_page_url: null,
  links: [],
  next_page_url: null,
  path: null,
  per_page: perPage,
  prev_page_url: null,
  to: null,
  total: 0,
});

function normalizeLearnsResponse(
  payload: LearnsApiResponse,
  page: number,
  perPage: number,
): LearnsPaginatedResponse {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data) &&
    Array.isArray((payload.data as LearnsPaginatedResponse).data)
  ) {
    return payload.data as LearnsPaginatedResponse;
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as LearnsPaginatedResponse).data)
  ) {
    return payload as LearnsPaginatedResponse;
  }

  return EMPTY_LEARNS_PAGE(page, perPage);
}

/** GET /api/learns */
export async function fetchLearns(
  query: GetLearnsQuery = {},
): Promise<LearnsPaginatedResponse> {
  const page = query.page ?? 1;
  const perPage = query.per_page ?? 15;
  const search = query.search?.trim();

  const { data } = await axiosInstance.get<LearnsApiResponse>("learns", {
    params: {
      page,
      per_page: perPage,
      ...(search ? { search } : {}),
    },
  });

  return normalizeLearnsResponse(data, page, perPage);
}

export const learnsQueryKey = (query: GetLearnsQuery) =>
  [
    "learns",
    query.page ?? 1,
    query.per_page ?? 15,
    query.search?.trim() ?? "",
  ] as const;

type UseGetLearnsOptions = {
  enabled?: boolean;
  page?: number;
  per_page?: number;
  search?: string;
};

export function useGetLearns(options: UseGetLearnsOptions = {}) {
  const { enabled = true, page = 1, per_page = 15, search = "" } = options;
  const normalizedSearch = search.trim();

  const query: GetLearnsQuery = {
    page,
    per_page,
    ...(normalizedSearch ? { search: normalizedSearch } : {}),
  };

  return useQuery({
    queryKey: learnsQueryKey(query),
    queryFn: () => fetchLearns(query),
    enabled: !!apiBaseURL && enabled,
  });
}
