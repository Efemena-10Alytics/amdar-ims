"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { GracePeriodDateBounds } from "./types";

export const GRACE_PERIOD_BOUNDS_QUERY_KEY = (paymentPlanId: string | number) =>
  ["payment", "grace-period-date-bounds", String(paymentPlanId)] as const;

type RawBoundsResponse = {
  data?: {
    data?: GracePeriodDateBounds;
  } & Partial<GracePeriodDateBounds>;
};

/** Unwraps defensively: `res?.data?.data ?? res?.data`, then `body?.data ?? body`. */
function unwrapBounds(payload: RawBoundsResponse | undefined): GracePeriodDateBounds | null {
  const body = payload?.data ?? payload;
  if (!body) return null;
  const unwrapped = (body as { data?: GracePeriodDateBounds }).data ?? body;
  return (unwrapped as GracePeriodDateBounds) ?? null;
}

export async function getGracePeriodDateBounds(
  paymentPlanId: string | number,
): Promise<GracePeriodDateBounds | null> {
  const res = await axiosInstance.get<RawBoundsResponse>(
    `payment/user/payment-plans/${paymentPlanId}/grace-period-date-bounds`,
  );
  return unwrapBounds(res.data);
}

export function useGetGracePeriodDateBounds(
  paymentPlanId: string | number | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: GRACE_PERIOD_BOUNDS_QUERY_KEY(paymentPlanId ?? ""),
    queryFn: () => getGracePeriodDateBounds(paymentPlanId as string | number),
    enabled: !!apiBaseURL && enabled && paymentPlanId != null && paymentPlanId !== "",
  });
}
