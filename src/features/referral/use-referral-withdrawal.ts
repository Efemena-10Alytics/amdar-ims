"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseURL } from "@/lib/axios-instance";
import {
  getPayoutAccount,
  getWithdrawalHistory,
  getWithdrawalOptions,
  referralErrorMessage,
  requestWithdrawalQuote,
  savePayoutAccount,
  submitWithdrawal,
} from "./referral-api";
import type { WithdrawalHistoryQuery, WithdrawalQuoteData } from "./referral-api.types";
import { REFERRAL_QUERY_KEY } from "./use-referral-dashboard";

/** 4.1 - wallet constraints, countries, currencies and dynamic form fields. */
export function useWithdrawalOptions(enabled = true) {
  const query = useQuery({
    queryKey: [...REFERRAL_QUERY_KEY, "withdrawal-options"],
    queryFn: getWithdrawalOptions,
    enabled: enabled && !!apiBaseURL,
    // Exchange rates ride along with this payload, so don't hold it long.
    staleTime: 1000 * 60,
  });

  return {
    ...query,
    errorMessage: query.isError
      ? referralErrorMessage(query.error, "Unable to load withdrawal options.")
      : null,
  };
}

/** 4.2.1 - the single saved payout account, or null when none is saved. */
export function usePayoutAccount(enabled = true) {
  const query = useQuery({
    queryKey: [...REFERRAL_QUERY_KEY, "payout-account"],
    queryFn: getPayoutAccount,
    enabled: enabled && !!apiBaseURL,
  });

  return {
    ...query,
    account: query.data ?? null,
    errorMessage: query.isError
      ? referralErrorMessage(query.error, "Unable to load your saved account.")
      : null,
  };
}

/** 4.2.2 - update the saved payout account on its own. */
export function useSavePayoutAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePayoutAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...REFERRAL_QUERY_KEY, "payout-account"] });
    },
  });
}

/** 4.3 - the official conversion quote taken before submitting. */
export function useWithdrawalQuote() {
  return useMutation({ mutationFn: requestWithdrawalQuote });
}

/**
 * 4.4 - submit the withdrawal. On success every balance on the screen has
 * moved, so the whole referral tree is invalidated.
 */
export function useSubmitWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEY });
    },
  });
}

/** 5.1 - the paginated withdrawal history table. */
export function useWithdrawalHistory(query: WithdrawalHistoryQuery, enabled = true) {
  const result = useQuery({
    queryKey: [
      ...REFERRAL_QUERY_KEY,
      "withdrawals",
      query.status ?? "all",
      query.per_page ?? 15,
      query.page ?? 1,
    ],
    queryFn: () => getWithdrawalHistory(query),
    enabled: enabled && !!apiBaseURL,
    placeholderData: keepPreviousData,
  });

  return {
    ...result,
    items: result.data?.items ?? [],
    pagination: result.data?.pagination ?? null,
    errorMessage: result.isError
      ? referralErrorMessage(result.error, "Unable to load your withdrawal history.")
      : null,
  };
}

/** A 409 on submit carries a replacement quote in its `data`. */
export function quoteFromConflict(data: unknown): WithdrawalQuoteData | null {
  if (!data || typeof data !== "object") return null;
  const payload = (data as { data?: unknown }).data ?? data;
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as Partial<WithdrawalQuoteData>;
  if (typeof candidate.quote_token !== "string" || typeof candidate.payout_amount !== "string") {
    return null;
  }
  return candidate as WithdrawalQuoteData;
}
