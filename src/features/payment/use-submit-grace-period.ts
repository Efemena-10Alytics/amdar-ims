"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import { PAYMENT_STATS_QUERY_KEY } from "./use-get-payment-stats";
import { USER_INVOICES_QUERY_KEY } from "./use-get-user-invoices";
import type { SubmitGracePeriodPayload } from "./types";

export type SubmitGracePeriodErrorData = {
  message?: string;
  min_selectable_date?: string;
  max_selectable_date?: string;
};

/** Normalizes 422 (validation/ineligibility) and 409 (conflict) error bodies. */
export function getGracePeriodErrorDetails(error: unknown): SubmitGracePeriodErrorData {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; data?: SubmitGracePeriodErrorData }
      | undefined;
    if (responseData?.data) {
      return {
        message: responseData.data.message ?? responseData.message,
        min_selectable_date: responseData.data.min_selectable_date,
        max_selectable_date: responseData.data.max_selectable_date,
      };
    }
    if (responseData?.message) {
      return { message: responseData.message };
    }
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "Failed to submit grace period request." };
}

export async function submitGracePeriod(
  payload: SubmitGracePeriodPayload,
): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.post<{ success: boolean }>(
    "payment/grace-periods",
    payload,
  );
  return data;
}

export function useSubmitGracePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitGracePeriodPayload) => submitGracePeriod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_INVOICES_QUERY_KEY });
    },
  });
}
