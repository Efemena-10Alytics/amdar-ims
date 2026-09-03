"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { PAYMENT_STATS_QUERY_KEY } from "./use-get-payment-stats";
import { USER_INVOICES_QUERY_KEY } from "./use-get-user-invoices";
import type { UpdateSecondInstallmentDatePayload } from "./types";

export async function updateSecondInstallmentDate({
  paymentPlanId,
  next_payment_date,
}: UpdateSecondInstallmentDatePayload): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.patch<{ success: boolean }>(
    `payment/user/payment-plans/${paymentPlanId}/second-installment-date`,
    { next_payment_date },
  );
  return data;
}

/** Built, but not yet wired to a trigger — no existing UI element calls this. */
export function useUpdateSecondInstallmentDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSecondInstallmentDatePayload) =>
      updateSecondInstallmentDate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_INVOICES_QUERY_KEY });
    },
  });
}
