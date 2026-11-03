import { formatReferralAmount, type ReferralCurrency } from "@/features/referral/locale";
import type { ReferralStats } from "@/features/referral/types";
import {
  PendingReferralsStatIcon,
  SuccessfulReferralsStatIcon,
  TotalEarnedStatIcon,
  TotalReferralsStatIcon,
} from "./icons";

function StatCard({
  label,
  value,
  icon,
  active,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={
        active
          ? "flex flex-col justify-between gap-4 rounded-lg bg-[#156374] px-4 py-5 text-white"
          : "flex flex-col justify-between gap-4 rounded-lg bg-[#E8EFF1] px-4 py-5 text-[#092A31]"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-sora text-xs opacity-80">{label}</span>
        {icon}
      </div>
      <span className="font-clash-display text-xl">{value}</span>
    </div>
  );
}

export function ReferralStatsCards({
  stats,
  currency,
  isLoading = false,
  errorMessage = null,
}: {
  stats: ReferralStats;
  currency: ReferralCurrency;
  isLoading?: boolean;
  errorMessage?: string | null;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl bg-white p-5 shadow">
            <span className="block h-3 w-24 animate-pulse rounded bg-[#E8EFF1]" />
            <span className="mt-3 block h-6 w-20 animate-pulse rounded bg-[#E8EFF1]" />
          </div>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow">
        <p className="font-sora text-sm text-[#AA3030]">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Earned"
        value={formatReferralAmount(stats.totalEarned, currency)}
        icon={<TotalEarnedStatIcon />}
        active
      />
      <StatCard
        label="Total Referrals"
        value={String(stats.totalReferrals)}
        icon={<TotalReferralsStatIcon />}
      />
      <StatCard
        label="Successful Referrals"
        value={String(stats.successfulReferrals)}
        icon={<SuccessfulReferralsStatIcon />}
      />
      <StatCard
        label="Pending Referrals"
        value={String(stats.pendingReferrals)}
        icon={<PendingReferralsStatIcon />}
      />
    </div>
  );
}
