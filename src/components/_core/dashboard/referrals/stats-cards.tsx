import { Info } from "lucide-react";
import { formatReferralAmount, type ReferralCurrency } from "@/features/referral/locale";
import type { ReferralStats } from "@/features/referral/types";
import {
  FailedReferralsStatIcon,
  PendingReferralsStatIcon,
  SuccessfulReferralsStatIcon,
  TotalEarnedStatIcon,
  TotalReferralsStatIcon,
} from "./icons";

const CARD_GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

// Tooltip copy is specified verbatim in the handover guide (section 8.3).
const CONFIRMED_EARNINGS_HINT = "The total amount earned from confirmed referrals.";
const EXPECTED_EARNINGS_HINT =
  "The amount you stand to earn once your pending referrals are confirmed.";

function InfoHint({ hint, onDark = false }: { hint: string; onDark?: boolean }) {
  return (
    <span title={hint} className="shrink-0 cursor-help">
      <Info className={onDark ? "size-4 text-white/70" : "size-4 text-[#94A3B8]"} aria-hidden />
      <span className="sr-only">{hint}</span>
    </span>
  );
}

/** The four counting cards: icon and label on top, the count beneath. */
function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-4 rounded-lg bg-[#E8EFF1] px-4 py-4 text-[#092A31]">
      <div className="flex items-start justify-between gap-2">
        <span className="flex min-w-0 items-start gap-2">
          <span className="shrink-0">{icon}</span>
          <span className="font-sora text-xs leading-tight text-[#0C3640]">{label}</span>
        </span>
        <InfoHint hint={hint} />
      </div>
      <span className="font-clash-display text-2xl font-semibold">{value}</span>
    </div>
  );
}

/** The highlighted first card, which splits into confirmed and expected. */
function RewardsCard({
  confirmed,
  expected,
  currency,
}: {
  confirmed: number;
  expected: number;
  currency: ReferralCurrency;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-4 rounded-lg bg-[#156374] px-4 py-4 text-white">
      <div className="flex items-start justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0">
            <TotalEarnedStatIcon />
          </span>
          <span className="font-sora text-sm font-medium">Rewards</span>
        </span>
        <InfoHint onDark hint={`${CONFIRMED_EARNINGS_HINT} ${EXPECTED_EARNINGS_HINT}`} />
      </div>

      <div className="flex items-stretch gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            title={CONFIRMED_EARNINGS_HINT}
            className="truncate font-sora text-[10px] text-[#B6CFD4]"
          >
            Confirmed Earnings
          </span>
          <span className="font-clash-display text-2xl font-semibold">
            {formatReferralAmount(confirmed, currency)}
          </span>
        </div>

        <span className="w-px shrink-0 bg-white/25" aria-hidden />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            title={EXPECTED_EARNINGS_HINT}
            className="truncate font-sora text-[10px] text-[#B6CFD4]"
          >
            Expected Earnings
          </span>
          <span className="font-clash-display text-2xl font-semibold">
            {formatReferralAmount(expected, currency)}
          </span>
        </div>
      </div>
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
      <div className={CARD_GRID} aria-busy>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-lg bg-[#E8EFF1] px-4 py-4">
            <span className="block h-6 w-6 animate-pulse rounded-md bg-white/70" />
            <span className="mt-3 block h-3 w-24 animate-pulse rounded bg-white/70" />
            <span className="mt-3 block h-6 w-16 animate-pulse rounded bg-white/70" />
          </div>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg bg-[#E8EFF1] px-4 py-4">
        <p className="font-sora text-sm text-[#AA3030]">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className={CARD_GRID}>
      <RewardsCard
        confirmed={stats.confirmedEarnings}
        expected={stats.expectedEarnings}
        currency={currency}
      />
      <StatCard
        label="Total Referrals"
        value={String(stats.totalReferrals)}
        hint="Total referrals combine all pending and confirmed referrals."
        icon={<TotalReferralsStatIcon />}
      />
      <StatCard
        label="Pending Referrals"
        value={String(stats.pendingReferrals)}
        hint="Referrals awaiting confirmation."
        icon={<PendingReferralsStatIcon />}
      />
      <StatCard
        label="Confirmed Referrals"
        value={String(stats.confirmedReferrals)}
        hint="Referrals that have been successfully verified and approved."
        icon={<SuccessfulReferralsStatIcon />}
      />
      <StatCard
        label="Failed Referrals"
        value={String(stats.failedReferrals)}
        hint="Referrals that were not confirmed due to a refund request from the referred user."
        icon={<FailedReferralsStatIcon />}
      />
    </div>
  );
}
