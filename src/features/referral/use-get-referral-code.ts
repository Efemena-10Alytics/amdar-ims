"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

/**
 * Referral System handover guide, §3.1 — GET /api/referral/code.
 * Fetches, or lazily generates on first call, the signed-in user's 5–8
 * character referral code along with the programme's reward information.
 */

/** Only "active" is documented; `is_blocked` carries the blocked state. */
export type ReferralCodeStatus = string;

export type ReferralRewardTier = {
  from: number;
  /** `null` on the open-ended top tier, e.g. "10+". */
  to: number | null;
  label: string;
  /** Decimal string, e.g. "25.00". */
  amount: string;
};

export type ReferralCodeEligibility = {
  months_into_program: number;
  requires_full_payment: boolean;
};

export type ReferralCodeData = {
  code: string;
  status: ReferralCodeStatus;
  is_blocked: boolean;
  /** Reward currency, e.g. "GBP". */
  currency: string;
  qualified_referrals: number;
  /** Decimal string, e.g. "50.00". */
  next_reward: string;
  reward_tiers: ReferralRewardTier[];
  eligibility: ReferralCodeEligibility;
};

type ReferralCodeResponse = {
  success: boolean;
  message: string | null;
  data?: ReferralCodeData | null;
};

/** Public link a referee follows; see the handover guide §2. */
const REFERRAL_LINK_BASE = "https://amdari.io/refer";

export function buildReferralLink(code: string): string {
  return `${REFERRAL_LINK_BASE}/${code}`;
}

export const REFERRAL_CODE_QUERY_KEY = ["referral", "code"] as const;

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

export function getReferralCodeErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Unable to load your referral code.";
}

export async function getReferralCode(): Promise<ReferralCodeData> {
  const { data } = await axiosInstance.get<ReferralCodeResponse>("referral/code");

  if (data.success === false || !data.data) {
    throw new Error(data.message?.trim() || "Unable to load your referral code.");
  }

  return data.data;
}

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
    errorMessage: query.isError ? getReferralCodeErrorMessage(query.error) : null,
  };
}
