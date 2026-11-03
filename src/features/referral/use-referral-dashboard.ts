"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiBaseURL } from "@/lib/axios-instance";
import {
  getReferralLeaderboard,
  getReferralPaymentSummary,
  getReferralSummary,
  getReferralTracking,
  referralErrorMessage,
} from "./referral-api";
import type {
  LeaderboardPeriod,
  ReferralTrackingQuery,
} from "./referral-api.types";

/** Shared root key, so the whole screen can be invalidated after a withdrawal. */
export const REFERRAL_QUERY_KEY = ["referral"] as const;

/** 3.2 - dashboard metric cards and wallet balances. */
export function useReferralSummary() {
  const query = useQuery({
    queryKey: [...REFERRAL_QUERY_KEY, "summary"],
    queryFn: getReferralSummary,
    enabled: !!apiBaseURL,
  });

  return {
    ...query,
    errorMessage: query.isError
      ? referralErrorMessage(query.error, "Unable to load your referral summary.")
      : null,
  };
}

/** 3.3 - the payment ring chart and its breakdown. */
export function useReferralPaymentSummary() {
  const query = useQuery({
    queryKey: [...REFERRAL_QUERY_KEY, "payment-summary"],
    queryFn: getReferralPaymentSummary,
    enabled: !!apiBaseURL,
  });

  return {
    ...query,
    errorMessage: query.isError
      ? referralErrorMessage(query.error, "Unable to load your payment summary.")
      : null,
  };
}

/** 3.4 - the paginated referral tracking table. */
export function useReferralTracking(query: ReferralTrackingQuery) {
  const result = useQuery({
    queryKey: [
      ...REFERRAL_QUERY_KEY,
      "referrals",
      query.status ?? "all",
      query.search ?? "",
      query.per_page ?? 15,
      query.page ?? 1,
    ],
    queryFn: () => getReferralTracking(query),
    enabled: !!apiBaseURL,
    // Keeps the previous page on screen while the next one loads, so the
    // table doesn't collapse to an empty state between pages.
    placeholderData: keepPreviousData,
  });

  return {
    ...result,
    items: result.data?.items ?? [],
    pagination: result.data?.pagination ?? null,
    errorMessage: result.isError
      ? referralErrorMessage(result.error, "Unable to load your referrals.")
      : null,
  };
}

/** 3.6 - the Top Referrers leaderboard. */
export function useReferralLeaderboard(period: LeaderboardPeriod) {
  const query = useQuery({
    queryKey: [...REFERRAL_QUERY_KEY, "leaderboard", period],
    queryFn: () => getReferralLeaderboard(period),
    enabled: !!apiBaseURL,
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    errorMessage: query.isError
      ? referralErrorMessage(query.error, "Unable to load the leaderboard.")
      : null,
  };
}
