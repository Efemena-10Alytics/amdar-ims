import type { ReferralData } from "./types";

export const mockReferralData: ReferralData = {
  stats: {
    totalEarned: 420,
    totalReferrals: 23,
    successfulReferrals: 16,
    pendingReferrals: 7,
  },
  referralLink: "https://amdari.io/refer/queen123",
  referrals: [
    { id: "1", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 3, total: 3, status: "paid" }, joinedOn: "25 Jul, 2026", reward: 50 },
    { id: "2", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 1, total: 3, status: "pending" }, joinedOn: "25 Jul, 2026", reward: 50 },
    { id: "3", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 2, total: 3, status: "pending" }, joinedOn: "25 Jul, 2026", reward: 50 },
    { id: "4", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 1, total: 1, status: "paid" }, joinedOn: "25 Jul, 2026", reward: 50 },
    { id: "5", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 0, total: 3, status: "refunded" }, joinedOn: "25 Jul, 2026", reward: 0 },
    { id: "6", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 3, total: 3, status: "paid" }, joinedOn: "25 Jul, 2026", reward: 50 },
    { id: "7", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 3, total: 3, status: "paid" }, joinedOn: "25 Jul, 2026", reward: 50 },
    { id: "8", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 3, total: 3, status: "paid" }, joinedOn: "25 Jul, 2026", reward: 50 },
    { id: "9", refereeName: "Queen Agada", email: "example@gmail.com", programme: "Data Science", paymentPlan: { current: 3, total: 3, status: "paid" }, joinedOn: "25 Jul, 2026", reward: 50 },
  ],
  paymentSummary: {
    paid: 420,
    remaining: 280,
    total: 700,
  },
  topReferrers: [
    { rank: 1, name: "Linda Ikeji", amount: 1420, initials: "LI", color: "#F97432" },
    { rank: 2, name: "Jay Amber", amount: 1000, initials: "JA", color: "#C13584" },
    { rank: 3, name: "Abiola Taiwo", amount: 900, initials: "AT", color: "#6366F1" },
    { rank: 25, name: "ME", amount: 700, initials: "ME", color: "#F16B6B", isMe: true },
  ],
  withdrawalProfile: {
    name: "Ojay Adams",
    status: "Active",
    initials: "OA",
    availableBalance: 0,
  },
  withdrawals: [
    { id: "1", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "successful", reference: "WD - 20260818 - 001", notes: "Testing withdrawal t..." },
    { id: "2", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "pending", reference: "WD - 20260818 - 001", notes: null },
    { id: "3", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "successful", reference: "WD - 20260818 - 001", notes: null },
    { id: "4", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "failed", reference: "WD - 20260818 - 001", notes: "Testing withdrawal t..." },
    { id: "5", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "successful", reference: "WD - 20260818 - 001", notes: "Testing withdrawal t..." },
    { id: "6", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "successful", reference: "WD - 20260818 - 001", notes: null },
    { id: "7", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "successful", reference: "WD - 20260818 - 001", notes: null },
    { id: "8", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "successful", reference: "WD - 20260818 - 001", notes: null },
    { id: "9", date: "25 Jul, 2026", amount: 50, method: "Bank Transfer", accountMasked: "**** **** **** 1234", accountLabel: "Opay | Ojay Adams", status: "successful", reference: "WD - 20260818 - 001", notes: null },
    ...Array.from({ length: 18 }, (_, index) => ({
      id: String(index + 10),
      date: "25 Jul, 2026",
      amount: 50,
      method: "Bank Transfer",
      accountMasked: "**** **** **** 1234",
      accountLabel: "Opay | Ojay Adams",
      status: (["successful", "successful", "pending"] as const)[index % 3],
      reference: "WD - 20260818 - 001",
      notes: null,
    })),
  ],
};

export const mockEmptyReferralData: ReferralData = {
  stats: {
    totalEarned: 0,
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
  },
  referralLink: "https://amdari.io/refer/queen123",
  referrals: [],
  paymentSummary: {
    paid: 0,
    remaining: 0,
    total: 0,
  },
  topReferrers: [
    { rank: 1, name: "Linda Ikeji", amount: 1420, initials: "LI", color: "#F97432" },
    { rank: 2, name: "Jay Amber", amount: 1000, initials: "JA", color: "#C13584" },
    { rank: 3, name: "Abiola Taiwo", amount: 900, initials: "AT", color: "#6366F1" },
    { rank: "-", name: "ME", amount: 0, initials: "ME", color: "#F16B6B", isMe: true },
  ],
  withdrawalProfile: {
    name: "Ojay Adams",
    status: "Active",
    initials: "OA",
    availableBalance: 0,
  },
  withdrawals: [],
};

const CURRENCY_SYMBOL = "£";

export function formatReferralCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString("en-GB")}`;
}
