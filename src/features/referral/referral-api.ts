import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import type {
  LeaderboardData,
  LeaderboardPeriod,
  PayoutAccountData,
  PayoutAccountPayload,
  ReferralCodeData,
  ReferralEnvelope,
  ReferralPaginated,
  ReferralPaymentSummaryData,
  ReferralSummaryData,
  ReferralTrackingItem,
  ReferralTrackingQuery,
  SubmitWithdrawalPayload,
  WithdrawalHistoryQuery,
  WithdrawalOptionsData,
  WithdrawalQuoteData,
  WithdrawalQuotePayload,
  WithdrawalRecord,
} from "./referral-api.types";

/**
 * Carries the HTTP status and body through to the caller. The withdrawal
 * submit flow needs them: a 409 means the rate moved and its `data` holds a
 * fresh quote, 422 means the quote expired and 403 means the user is blocked.
 */
export class ReferralApiError extends Error {
  readonly status: number | null;
  readonly data: unknown;

  constructor(message: string, status: number | null, data: unknown) {
    super(message);
    this.name = "ReferralApiError";
    this.status = status;
    this.data = data;
  }
}

function apiMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const message = (body as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

/** Turns any thrown error into something showable, preferring the API's text. */
export function referralErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ReferralApiError) return error.message || fallback;
  if (axios.isAxiosError(error)) {
    const message = apiMessage(error.response?.data);
    if (message) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Status of a failed request, however it failed. */
export function referralErrorStatus(error: unknown): number | null {
  if (error instanceof ReferralApiError) return error.status;
  if (axios.isAxiosError(error)) return error.response?.status ?? null;
  return null;
}

export function referralErrorData(error: unknown): unknown {
  if (error instanceof ReferralApiError) return error.data;
  if (axios.isAxiosError(error)) return error.response?.data;
  return null;
}

function unwrap<T>(envelope: ReferralEnvelope<T>, fallback: string): T {
  if (envelope.success === false || envelope.data == null) {
    throw new ReferralApiError(envelope.message?.trim() || fallback, null, envelope.data ?? null);
  }
  return envelope.data;
}

/** Rethrows an axios failure as a ReferralApiError so the status survives. */
async function request<T>(fallback: string, run: () => Promise<ReferralEnvelope<T>>): Promise<T> {
  try {
    return unwrap(await run(), fallback);
  } catch (error) {
    if (error instanceof ReferralApiError) throw error;
    throw new ReferralApiError(
      referralErrorMessage(error, fallback),
      referralErrorStatus(error),
      referralErrorData(error),
    );
  }
}

/* ------------------------------------------------------------ Screen 1 */

/** 3.1 - GET /api/referral/code */
export function getReferralCode(): Promise<ReferralCodeData> {
  return request("Unable to load your referral code.", async () => {
    const { data } = await axiosInstance.get<ReferralEnvelope<ReferralCodeData>>("referral/code");
    return data;
  });
}

/** 3.2 - GET /api/referral/summary */
export function getReferralSummary(): Promise<ReferralSummaryData> {
  return request("Unable to load your referral summary.", async () => {
    const { data } =
      await axiosInstance.get<ReferralEnvelope<ReferralSummaryData>>("referral/summary");
    return data;
  });
}

/** 3.3 - GET /api/referral/payment-summary */
export function getReferralPaymentSummary(): Promise<ReferralPaymentSummaryData> {
  return request("Unable to load your payment summary.", async () => {
    const { data } = await axiosInstance.get<ReferralEnvelope<ReferralPaymentSummaryData>>(
      "referral/payment-summary",
    );
    return data;
  });
}

/** 3.4 - GET /api/referral/referrals */
export function getReferralTracking(
  query: ReferralTrackingQuery,
): Promise<ReferralPaginated<ReferralTrackingItem>> {
  return request("Unable to load your referrals.", async () => {
    const { data } = await axiosInstance.get<
      ReferralEnvelope<ReferralPaginated<ReferralTrackingItem>>
    >("referral/referrals", { params: query });
    return data;
  });
}

/** 3.6 - GET /api/referral/leaderboard */
export function getReferralLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardData> {
  return request("Unable to load the leaderboard.", async () => {
    const { data } = await axiosInstance.get<ReferralEnvelope<LeaderboardData>>(
      "referral/leaderboard",
      { params: { period } },
    );
    return data;
  });
}

/* ------------------------------------------------------------ Screen 2 */

/** 4.1 - GET /api/referral/withdrawal-options */
export function getWithdrawalOptions(): Promise<WithdrawalOptionsData> {
  return request("Unable to load withdrawal options.", async () => {
    const { data } = await axiosInstance.get<ReferralEnvelope<WithdrawalOptionsData>>(
      "referral/withdrawal-options",
    );
    return data;
  });
}

/**
 * 4.2.1 - GET /api/referral/payout-account. `data` is null when nothing has
 * been saved yet, which is not an error, so this does not go through unwrap.
 */
export async function getPayoutAccount(): Promise<PayoutAccountData | null> {
  try {
    const { data } =
      await axiosInstance.get<ReferralEnvelope<PayoutAccountData>>("referral/payout-account");
    if (data.success === false) {
      throw new ReferralApiError(
        data.message?.trim() || "Unable to load your saved account.",
        null,
        null,
      );
    }
    return data.data ?? null;
  } catch (error) {
    if (error instanceof ReferralApiError) throw error;
    throw new ReferralApiError(
      referralErrorMessage(error, "Unable to load your saved account."),
      referralErrorStatus(error),
      referralErrorData(error),
    );
  }
}

/** 4.2.2 - PUT /api/referral/payout-account */
export function savePayoutAccount(payload: PayoutAccountPayload): Promise<PayoutAccountData> {
  return request("Unable to save your payout account.", async () => {
    const { data } = await axiosInstance.put<ReferralEnvelope<PayoutAccountData>>(
      "referral/payout-account",
      payload,
    );
    return data;
  });
}

/** 4.3 - POST /api/referral/withdrawals/quote */
export function requestWithdrawalQuote(
  payload: WithdrawalQuotePayload,
): Promise<WithdrawalQuoteData> {
  return request("Unable to get an exchange rate quote.", async () => {
    const { data } = await axiosInstance.post<ReferralEnvelope<WithdrawalQuoteData>>(
      "referral/withdrawals/quote",
      payload,
    );
    return data;
  });
}

/** 4.4 - POST /api/referral/withdrawals */
export function submitWithdrawal(payload: SubmitWithdrawalPayload): Promise<WithdrawalRecord> {
  return request("Unable to submit your withdrawal request.", async () => {
    const { data } = await axiosInstance.post<ReferralEnvelope<WithdrawalRecord>>(
      "referral/withdrawals",
      payload,
    );
    return data;
  });
}

/* ------------------------------------------------------------ Screen 3 */

/** 5.1 - GET /api/referral/withdrawals */
export function getWithdrawalHistory(
  query: WithdrawalHistoryQuery,
): Promise<ReferralPaginated<WithdrawalRecord>> {
  return request("Unable to load your withdrawal history.", async () => {
    const { data } =
      await axiosInstance.get<ReferralEnvelope<ReferralPaginated<WithdrawalRecord>>>(
        "referral/withdrawals",
        { params: query },
      );
    return data;
  });
}

/* -------------------------------------------------------------- Export */

function filenameFromDisposition(disposition: unknown, fallback: string): string {
  if (typeof disposition !== "string") return fallback;
  const match = /filename\*?=(?:UTF-8[']{2})?["]?([^";]+)["]?/i.exec(disposition);
  return match?.[1]?.trim() || fallback;
}

/**
 * The CSV endpoints are authenticated, so they cannot be a plain link - the
 * Bearer token only rides along on an axios request. Fetch as a blob and hand
 * it to the browser instead.
 */
async function downloadCsv(
  path: string,
  params: Record<string, string | number | undefined>,
  fallbackName: string,
): Promise<void> {
  const response = await axiosInstance.get<Blob>(path, { params, responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filenameFromDisposition(
      response.headers?.["content-disposition"],
      fallbackName,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

function todayStamp(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}${month}${day}`;
}

/** 3.5 - GET /api/referral/referrals/export */
export function exportReferralsCsv(
  query: Pick<ReferralTrackingQuery, "status" | "search">,
): Promise<void> {
  return downloadCsv("referral/referrals/export", query, `referrals-${todayStamp()}.csv`);
}

/** 5.2 - GET /api/referral/withdrawals/export */
export function exportWithdrawalsCsv(query: Pick<WithdrawalHistoryQuery, "status">): Promise<void> {
  return downloadCsv("referral/withdrawals/export", query, `withdrawals-${todayStamp()}.csv`);
}
