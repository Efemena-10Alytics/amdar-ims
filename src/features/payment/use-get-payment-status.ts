"use client";

import { useQuery } from "@tanstack/react-query";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type {
  GetPaymentStatusParams,
  PaymentStatusData,
  PaymentStatusResponse,
} from "./types";

export const PAYMENT_STATUS_QUERY_KEY = [
  "payment",
  "user",
  "payment-status",
] as const;

export async function getPaymentStatus(
  params?: GetPaymentStatusParams,
): Promise<PaymentStatusData | null> {
  const queryParams = {
    ...(params?.cohort_id != null ? { cohort_id: params.cohort_id } : {}),
    ...(params?.program_id != null ? { program_id: params.program_id } : {}),
    ...(params?.payment_plan_id != null
      ? { payment_plan_id: params.payment_plan_id }
      : {}),
  };

  const { data } = await axiosInstance.get<PaymentStatusResponse>(
    "payment/user/payment-status",
    {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    },
  );

  return data?.data ?? null;
}

export type UseGetPaymentStatusOptions = GetPaymentStatusParams & {
  enabled?: boolean;
};

export function useGetPaymentStatus(options?: UseGetPaymentStatusOptions) {
  const { userId, isAuthReady } = useRequireUserId();
  const isCallerEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: [
      ...PAYMENT_STATUS_QUERY_KEY,
      options?.cohort_id != null ? String(options.cohort_id) : "",
      options?.program_id != null ? String(options.program_id) : "",
      options?.payment_plan_id != null ? String(options.payment_plan_id) : "",
    ],
    queryFn: () =>
      getPaymentStatus({
        cohort_id: options?.cohort_id,
        program_id: options?.program_id,
        payment_plan_id: options?.payment_plan_id,
      }),
    enabled:
      !!apiBaseURL &&
      isAuthReady &&
      userId != null &&
      userId !== "" &&
      isCallerEnabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
