export type ReferralPaymentStatus = "paid" | "pending" | "refunded";

export interface ReferralEntry {
  id: string;
  refereeName: string;
  email: string;
  programme: string;
  paymentPlan: {
    current: number;
    total: number;
    status: ReferralPaymentStatus;
  };
  joinedOn: string;
  reward: number;
}

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

export interface TopReferrer {
  rank: number | string;
  name: string;
  amount: number;
  initials: string;
  color: string;
  isMe?: boolean;
}

export type WithdrawalStatus = "successful" | "pending" | "failed";

export interface WithdrawalEntry {
  id: string;
  date: string;
  amount: number;
  method: string;
  accountMasked: string;
  accountLabel: string;
  status: WithdrawalStatus;
  reference: string;
  notes: string | null;
}

export interface WithdrawalProfile {
  name: string;
  status: "Active" | "Inactive";
  initials: string;
  availableBalance: number;
}

export interface ReferralData {
  stats: ReferralStats;
  referralLink: string;
  referrals: ReferralEntry[];
  paymentSummary: ReferralPaymentSummary;
  topReferrers: TopReferrer[];
  withdrawals: WithdrawalEntry[];
  withdrawalProfile: WithdrawalProfile;
}
