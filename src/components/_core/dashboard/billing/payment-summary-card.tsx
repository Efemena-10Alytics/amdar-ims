
import { formatCurrency } from "@/features/payment/mock-data";
import type { BillingSummary } from "@/features/payment/types";
import { DueSoonStatusIcon, PaidStatusIcon } from "./icons";

export function PaymentSummaryCard({ summary }: { summary: BillingSummary }) {
  const percentPaid =
    summary.totalPlanAmount > 0
      ? Math.round((summary.totalPaid / summary.totalPlanAmount) * 100)
      : 0;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentPaid / 100);

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 font-clash-display text-lg text-[#092A31] font-semibold">Payment Summary</h2>

      <div className="flex flex-col items-center gap-2">
        <div className="relative size-32">
          <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#E8EFF1"
              strokeWidth="12"
            />
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
            <span className="font-clash-display text-2xl text-[#092A31] font-bold">{percentPaid}%</span>
            <span className="font-sora text-xs text-[#64748B]"> Paid</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-sora text-sm font-medium flex gap-1 items-center text-[#297A46]"><PaidStatusIcon /> Paid</span>
          <span className="font-sora text-sm font-semibold text-[#092A31]">
            {formatCurrency(summary.totalPaid)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-sora text-sm font-medium flex gap-1 items-center text-[#5A431B]"><DueSoonStatusIcon /> Remaining</span>
          <span className="font-sora text-sm font-semibold text-[#092A31]">
            {formatCurrency(summary.remainingBalance)}
          </span>
        </div>
                <div className="flex items-center justify-between gap-2">
          <span className="font-sora text-sm font-medium flex gap-1 items-center text-[#64748B]">Total</span>
          <span className="font-sora text-sm font-semibold text-[#092A31]">
            {formatCurrency(summary.remainingBalance)}
          </span>
        </div>
      </div>
    </div>
  );
}
