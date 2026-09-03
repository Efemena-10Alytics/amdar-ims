"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import type { PayNowPayload, PayNowResponse } from "./types";

export async function payInvoiceNow(
  invoiceId: string | number,
): Promise<PayNowResponse> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const payload: PayNowPayload = {
    success_url: `${origin}/payments/success`,
    cancel_url: `${origin}/payments/cancel`,
  };

  const { data } = await axiosInstance.post<PayNowResponse>(
    `payment/invoices/${invoiceId}/pay-now`,
    payload,
  );

  return data;
}

export function usePayInvoiceNow() {
  return useMutation({
    mutationFn: (invoiceId: string | number) => payInvoiceNow(invoiceId),
  });
}
