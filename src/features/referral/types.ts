export type ReferralPaymentStatus = "paid" | "pending" | "refunded";

export interface ReferralStats {
  totalEarned: number;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
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
