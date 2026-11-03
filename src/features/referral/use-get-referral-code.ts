"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBaseURL } from "@/lib/axios-instance";
import { getReferralCode, referralErrorMessage } from "./referral-api";
import { REFERRAL_QUERY_KEY } from "./use-referral-dashboard";

/**
 * Referral System handover guide, 3.1 - GET /api/referral/code.
 * Fetches, or lazily generates on first call, the signed-in user's 5-8
 * character referral code along with the programme's reward information.
 */

/**
 * Public link a referee follows. The code rides in `?ref=`, which
 * ReferralTracker captures from the root layout on any page, and sign-up
 * then sends on to the register endpoint (handover guide section 2).
 */
const REFERRAL_LINK_BASE = "https://www.amdari.io/internship";

export function buildReferralLink(code: string): string {
  return `${REFERRAL_LINK_BASE}?ref=${encodeURIComponent(code)}`;
}

export const REFERRAL_CODE_QUERY_KEY = [...REFERRAL_QUERY_KEY, "code"] as const;

export function useGetReferralCode() {
  const query = useQuery({
    queryKey: REFERRAL_CODE_QUERY_KEY,
    queryFn: getReferralCode,
    enabled: !!apiBaseURL,
    // The code is stable once generated, so avoid refetching it on every mount.
    staleTime: 1000 * 60 * 5,
  });

  const code = query.data?.code ?? null;

  return {
    ...query,
    code,
    referralLink: code ? buildReferralLink(code) : null,
    errorMessage: query.isError
      ? referralErrorMessage(query.error, "Unable to load your referral code.")
      : null,
  };
}
