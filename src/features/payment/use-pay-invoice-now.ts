"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import type { PayNowPayload, PayNowResponse } from "./types";

export type PayInvoiceNowInput =
  | string
  | number
  | {
      invoiceId: string | number;
      successUrl?: string;
      cancelUrl?: string;
    };

export async function payInvoiceNow(
  input: PayInvoiceNowInput,
): Promise<PayNowResponse> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const invoiceId = typeof input === "object" ? input.invoiceId : input;
  const successUrl =
    typeof input === "object" && input.successUrl
      ? input.successUrl
      : `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl =
    typeof input === "object" && input.cancelUrl
      ? input.cancelUrl
      : `${origin}/dashboard`;

  const payload: PayNowPayload = {
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  const { data } = await axiosInstance.post<PayNowResponse>(
    `payment/invoices/${invoiceId}/pay-now`,
    payload,
  );

  return data;
}

export function usePayInvoiceNow() {
  return useMutation({
    mutationFn: (input: PayInvoiceNowInput) => payInvoiceNow(input),
  });
}
