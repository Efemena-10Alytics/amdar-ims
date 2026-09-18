"use client";

import { formatReferralCurrency } from "@/features/referral/mock-data";
import type { ReferralPaymentSummary } from "@/features/referral/types";

export function ReferralPaymentSummaryCard({
  summary,
  onWithdraw,
  onViewHistory,
}: {
  summary: ReferralPaymentSummary;
  onWithdraw: () => void;
  onViewHistory: () => void;
}) {
  const percentPaid = summary.total > 0 ? Math.round((summary.paid / summary.total) * 100) : 0;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentPaid / 100);

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 font-clash-display text-lg font-semibold text-[#092A31]">
        Payment Summary
      </h2>

      <div className="flex flex-col items-center gap-2">
        <div className="relative size-32">
          <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
            <circle cx="64" cy="64" r={radius} fill="none" stroke="#E8EFF1" strokeWidth="12" />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#156374"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-clash-display text-2xl font-bold text-[#092A31]">
              {percentPaid}%
            </span>
            <span className="font-sora text-xs text-[#64748B]">Paid</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-sora text-sm font-medium text-[#359E5B]">
            <span className="size-2 rounded-full bg-[#359E5B]" aria-hidden />
            Paid
          </span>
          <span className="font-sora text-sm font-semibold text-[#092A31]">
            {formatReferralCurrency(summary.paid)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-sora text-sm font-medium text-[#5A431B]">
            <span className="size-2 rounded-full bg-[#5A431B]" aria-hidden />
            Remaining
          </span>
          <span className="font-sora text-sm font-semibold text-[#092A31]">
            {formatReferralCurrency(summary.remaining)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-sora text-sm font-medium text-[#64748B]">Total</span>
          <span className="font-sora text-sm font-semibold text-[#092A31]">
            {formatReferralCurrency(summary.total)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={onWithdraw}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-[#156374] font-sora text-sm font-semibold text-white transition-colors hover:bg-[#156374]/90"
        >
          Withdraw Earnings
        </button>
        <button
          type="button"
          onClick={onViewHistory}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-[#B6CFD4] font-sora text-sm font-semibold text-[#0C3640] transition-colors hover:bg-[#B6CFD4]/80"
        >
          Withdrawal History
        </button>
      </div>
    </div>
  );
}
