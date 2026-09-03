"use client";

import { useQuery } from "@tanstack/react-query";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { ApiPaymentStats } from "./types";

export const PAYMENT_STATS_QUERY_KEY = ["payment", "user", "payment-stats"] as const;

type RawPaymentStatsResponse = {
  data?: ApiPaymentStats;
};

export async function getPaymentStats(): Promise<ApiPaymentStats | null> {
  const { data } = await axiosInstance.get<RawPaymentStatsResponse>(
    "payment/user/payment-stats",
  );
  return data?.data ?? null;
}

export function useGetPaymentStats() {
  const { userId, isAuthReady } = useRequireUserId();

  return useQuery({
    queryKey: PAYMENT_STATS_QUERY_KEY,
    queryFn: getPaymentStats,
    enabled: !!apiBaseURL && isAuthReady && userId != null && userId !== "",
  });
}
