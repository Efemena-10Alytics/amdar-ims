export type ReferralPaymentStatus = "in_progress" | "completed" | "refunded";

export interface ReferralStats {
  /** Already earned and payable. */
  confirmedEarnings: number;
  /** Projected from referrals still working through their payment plan. */
  expectedEarnings: number;
  totalReferrals: number;
  pendingReferrals: number;
  confirmedReferrals: number;
  failedReferrals: number;
}

export interface ReferralPaymentSummary {
  paid: number;
  remaining: number;
  total: number;
}

export type WithdrawalStatus = "successful" | "pending" | "failed";

export interface WithdrawalProfile {
  name: string;
  status: "Active" | "Inactive";
  initials: string;
  availableBalance: number;
}
