import { cn } from "@/lib/utils";
import { formatCurrency } from "@/features/payment/mock-data";
import type { BillingSummary } from "@/features/payment/types";
import { CardStatIcon } from "./icons";

interface StatCardProps {
  label: string;
  value: string;
  active?: boolean;
}

function StatCard({ label, value, active }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex h-27.5 flex-col justify-between rounded-lg px-4 py-5",
        active ? "bg-[#156374] text-white" : "bg-[#E8EFF1] text-[#092A31]",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 justify-between">
        <span className="font-sora text-xs opacity-80">{label}</span>
      <CardStatIcon variant={active ? "active" : "inactive"} />
        </div>
        <span className="font-clash-display text-xl">{value}</span>
      </div>
    </div>
  );
}

export function StatsCards({ summary }: { summary: BillingSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Plan Amount" value={formatCurrency(summary.totalPlanAmount)} active />
      <StatCard label="Total Paid" value={formatCurrency(summary.totalPaid)} />
      <StatCard label="Remaining Balance" value={formatCurrency(summary.remainingBalance)} />
      <StatCard label="Payment Status" value={summary.paymentStatus} />
    </div>
  );
}
