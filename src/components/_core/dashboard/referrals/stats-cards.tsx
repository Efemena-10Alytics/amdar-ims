"use client";

import { useRef, useState } from "react";
import { Info, X } from "lucide-react";
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

/** Leading bold run, then the rest of the sentence. */
type HintLine = { label: string; text: string };

// Copy is specified verbatim in the handover guide (section 8.3).
const REWARDS_HINT: HintLine[] = [
  { label: "Confirmed Earnings:", text: "The total amount earned from confirmed referrals." },
  {
    label: "Expected Earnings:",
    text: "The amount you stand to earn once your pending referrals are confirmed.",
  },
];
const TOTAL_HINT: HintLine[] = [
  { label: "Total referrals", text: "combine all pending and confirmed referrals." },
];
const PENDING_HINT: HintLine[] = [
  { label: "Pending Referrals:", text: "Referrals awaiting confirmation." },
];
const CONFIRMED_HINT: HintLine[] = [
  {
    label: "Confirmed Referrals:",
    text: "Referrals that have been successfully verified and approved.",
  },
];
const FAILED_HINT: HintLine[] = [
  {
    label: "Failed Referrals:",
    text: "Referrals that were not confirmed due to a refund request from the referred user.",
  },
];

/** Grace period so the pointer can travel from the icon onto the panel. */
const CLOSE_DELAY_MS = 120;

function InfoHint({ lines, onDark = false }: { lines: HintLine[]; onDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const show = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const hide = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <span className="relative shrink-0" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-label={`${lines[0].label} ${lines[0].text}`}
        aria-expanded={open}
        onFocus={show}
        onBlur={hide}
        onClick={() => setOpen((current) => !current)}
        className="flex cursor-help items-center"
      >
        <Info
          className={
            onDark
              ? "size-4 text-white/70"
              : "size-4 text-[#94A3B8] transition-colors group-hover:text-white"
          }
          aria-hidden
        />
      </button>

      {open && (
        <span
          role="tooltip"
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute top-full right-0 z-30 mt-2 flex w-80 max-w-[70vw] gap-2.5 rounded-xl bg-[#BFDBFE] p-4 text-left shadow-lg"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-[#1D4ED8]" aria-hidden />

          <span className="flex min-w-0 flex-1 flex-col gap-3">
            {lines.map((line) => (
              <span
                key={line.label}
                className="block font-sora text-sm leading-relaxed text-[#27568F]"
              >
                <span className="font-semibold text-[#0B2E6F]">{line.label}</span> {line.text}
              </span>
            ))}
          </span>

          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setOpen(false)}
            className="-mt-0.5 shrink-0 text-[#2A5DA8] transition-opacity hover:opacity-70"
          >
            <X className="size-4" aria-hidden />
          </button>
        </span>
      )}
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
  hint: HintLine[];
  icon: React.ReactNode;
}) {
  return (
    // Hovering lifts the card into the Rewards card's treatment.
    <div className="group flex min-w-0 cursor-default flex-col justify-between gap-4 rounded-lg bg-[#E8EFF1] px-4 py-4 text-[#092A31] transition-colors hover:bg-[#156374] hover:text-white">
      <div className="flex items-start justify-between gap-2">
        <span className="flex min-w-0 items-start gap-2">
          <span className="shrink-0">{icon}</span>
          <span className="font-sora text-xs leading-tight text-[#0C3640] transition-colors group-hover:text-white">
            {label}
          </span>
        </span>
        <InfoHint lines={hint} />
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
        <InfoHint onDark lines={REWARDS_HINT} />
      </div>

      <div className="flex items-stretch gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-sora text-[10px] text-[#B6CFD4]">
            Confirmed Earnings
          </span>
          <span className="font-clash-display text-2xl font-semibold">
            {formatReferralAmount(confirmed, currency)}
          </span>
        </div>

        <span className="w-px shrink-0 bg-white/25" aria-hidden />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-sora text-[10px] text-[#B6CFD4]">Expected Earnings</span>
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
        hint={TOTAL_HINT}
        icon={<TotalReferralsStatIcon />}
      />
      <StatCard
        label="Pending Referrals"
        value={String(stats.pendingReferrals)}
        hint={PENDING_HINT}
        icon={<PendingReferralsStatIcon />}
      />
      <StatCard
        label="Confirmed Referrals"
        value={String(stats.confirmedReferrals)}
        hint={CONFIRMED_HINT}
        icon={<SuccessfulReferralsStatIcon />}
      />
      <StatCard
        label="Failed Referrals"
        value={String(stats.failedReferrals)}
        hint={FAILED_HINT}
        icon={<FailedReferralsStatIcon />}
      />
    </div>
  );
}
