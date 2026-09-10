"use client";

import { useQuery } from "@tanstack/react-query";
import { useRequireUserId } from "@/hooks/use-require-user-id";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { ApiInvoice } from "./types";

export const USER_INVOICES_QUERY_KEY = ["payment", "user", "invoices"] as const;

type RawInvoicesResponse = {
  data?: {
    data?: {
      data?: ApiInvoice[];
    };
  };
};

/** Unwraps the triply-nested `{ data: { data: { data: [...] } } }` envelope defensively. */
function unwrapInvoices(
  payload: RawInvoicesResponse | undefined,
): ApiInvoice[] {
  const inner = payload?.data?.data;
  return Array.isArray(inner) ? inner : [];
}

export async function getUserInvoices(): Promise<ApiInvoice[]> {
  const { data } = await axiosInstance.get<RawInvoicesResponse>(
    "payment/user/invoices",
  );
  return unwrapInvoices(data);
}

export function useGetUserInvoices() {
  const { userId, isAuthReady } = useRequireUserId();

  return useQuery({
    queryKey: USER_INVOICES_QUERY_KEY,
    queryFn: getUserInvoices,
    enabled: !!apiBaseURL && isAuthReady && userId != null && userId !== "",
  });
}
