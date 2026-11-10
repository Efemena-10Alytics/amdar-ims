/**
 * Response shapes for the referral API, from the Referral System frontend
 * handover guide (sections 3-5). Every endpoint is under /api/referral and
 * returns the same envelope.
 */

export type ReferralEnvelope<T> = {
  success: boolean;
  message: string | null;
  data?: T | null;
};

export type ReferralPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ReferralPaginated<T> = {
  items: T[];
  pagination: ReferralPagination;
};

/* ---------------------------------------------------------------- 3.1 */

export type ReferralRewardTier = {
  from: number;
  /** `null` on the open-ended top tier, e.g. "10+". */
  to: number | null;
  label: string;
  /** Decimal string, e.g. "25.00". */
  amount: string;
};

export type ReferralCodeData = {
  code: string;
  status: "active" | "blocked";
  is_blocked: boolean;
  currency: string;
  qualified_referrals: number;
  next_reward: string;
  reward_tiers: ReferralRewardTier[];
  eligibility: {
    days_after_cohort_start: number;
    requires_full_payment: boolean;
  };
};

/* ---------------------------------------------------------------- 3.2 */

export type ReferralWallet = {
  available_balance: string;
  pending_balance: string;
  processing_balance: string;
  withdrawn_balance: string;
  total_balance: string;
};

export type ReferralSummaryData = {
  currency: string;
  /** Earned from confirmed referrals, including anything already withdrawn. */
  confirmed_earnings: string;
  /** Projected from referrals still awaiting confirmation. Not withdrawable. */
  expected_earnings: string;
  /** pending + confirmed + failed. */
  total_referrals: number;
  /** Awaiting confirmation: in_progress and completed. */
  pending_referrals: number;
  /** Verified and approved: earned. */
  confirmed_referrals: number;
  /** Not confirmed because the referred user was refunded. */
  failed_referrals: number;
  wallet: ReferralWallet;
  /** When false the Withdraw Earnings button is disabled. */
  can_withdraw: boolean;
};

/* ---------------------------------------------------------------- 3.3 */

export type ReferralPaymentSummaryData = {
  currency: string;
  paid: string;
  remaining: string;
  total: string;
  /** Already a percentage, e.g. 60. */
  paid_percentage: number;
};

/* ---------------------------------------------------------------- 3.4 */

/**
 * Row status, distinct from the payment plan's own. The flow is
 * in_progress -> completed -> earned, and a row can become refunded at any
 * point: `completed` means paid in full but still inside the 30-day wait.
 */
export type ReferralTrackingStatus = "in_progress" | "completed" | "earned" | "refunded";

export type ReferralPaymentPlanStatus = "in_progress" | "completed" | "refunded";

export type ReferralTrackingItem = {
  id: number;
  number: number;
  referee_name: string;
  /** Partially masked by the API, e.g. "qu***@gmail.com". */
  email: string;
  programme: string;
  payment_plan: {
    paid: number;
    total: number;
    label: string;
    status: ReferralPaymentPlanStatus;
  };
  joined_on: string;
  status: ReferralTrackingStatus;
  reward: string;
  /** True while the reward is only projected, not yet earned. */
  reward_is_projected: boolean;
};

export type ReferralTrackingQuery = {
  status?: ReferralTrackingStatus;
  search?: string;
  per_page?: number;
  page?: number;
};

/* ---------------------------------------------------------------- 3.6 */

export type LeaderboardPeriod = "all" | "monthly";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  initial: string;
  total_earned: string;
  referrals: number;
  is_me?: boolean;
};

export type LeaderboardData = {
  period: LeaderboardPeriod;
  currency: string;
  top: LeaderboardEntry[];
  /** The signed-in user's own standing; absent when they have no rank yet. */
  me: LeaderboardEntry | null;
};

/* ---------------------------------------------------------------- 4.1 */

export type WithdrawalFieldType = "text" | "email" | "number" | "select";

export type WithdrawalField = {
  key: string;
  label: string;
  type: WithdrawalFieldType;
  required: boolean;
  /** Present on `select` fields, as value -> label. */
  options?: Record<string, string>;
  /** Makes the field required only when another field holds `value`. */
  required_if?: { field: string; value: string };
};

export type WithdrawalCurrencyOption = {
  currency: string;
  exchange_rate: string;
  fields: WithdrawalField[];
  /** Cross-border explainer; rendered as a yellow alert when set. */
  note: string | null;
};

export type WithdrawalCountryOption = {
  code: string;
  name: string;
  currencies: WithdrawalCurrencyOption[];
};

export type WithdrawalOptionsData = {
  currency: string;
  available_balance: string;
  total_balance: string;
  min_withdrawal: string;
  max_withdrawal: string;
  /** The lower of max_withdrawal and the available balance. */
  max_withdrawable: string;
  quote_valid_minutes: number;
  can_withdraw: boolean;
  countries: WithdrawalCountryOption[];
};

/* ---------------------------------------------------------------- 4.2 */

export type PayoutAccountData = {
  country: string;
  currency: string;
  label: string;
  masked_number: string;
  /** Keyed by the same field keys the withdrawal options define. */
  account: Record<string, string>;
};

export type PayoutAccountPayload = {
  country: string;
  currency: string;
  account: Record<string, string>;
};

/* ---------------------------------------------------------------- 4.3 */

export type WithdrawalQuotePayload = {
  amount_gbp: number;
  country: string;
  payout_currency: string;
};

export type WithdrawalQuoteData = {
  amount_gbp: string;
  country: string;
  payout_currency: string;
  exchange_rate: string;
  payout_amount: string;
  expires_at: string;
  quote_token: string;
};

/* ---------------------------------------------------------------- 4.4 */

export type SubmitWithdrawalPayload = {
  quote_token: string;
  country: string;
  payout_currency: string;
  save_details: boolean;
  account: Record<string, string>;
};

/* ------------------------------------------------------------ 4.4, 5.1 */

export type WithdrawalRecordStatus = "pending" | "successful" | "failed";

export type WithdrawalRecord = {
  id: number;
  number: number;
  invoice_id: string;
  date: string;
  amount_gbp: string;
  payout_currency: string;
  exchange_rate: string;
  payout_amount: string;
  country: string;
  account: {
    masked_number: string;
    label: string;
  };
  status: WithdrawalRecordStatus;
  decline_reason: string | null;
};

export type WithdrawalHistoryQuery = {
  status?: WithdrawalRecordStatus;
  per_page?: number;
  page?: number;
};
