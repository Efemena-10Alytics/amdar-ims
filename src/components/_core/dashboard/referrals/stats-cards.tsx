import { formatReferralCurrency } from "@/features/referral/mock-data";
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

export function ReferralStatsCards({ stats }: { stats: ReferralStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Earned"
        value={formatReferralCurrency(stats.totalEarned)}
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
