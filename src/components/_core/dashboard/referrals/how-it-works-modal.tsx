"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetReferralCode } from "@/features/referral/use-get-referral-code";
import { toAmount } from "@/features/referral/locale";
import type { ReferralRewardTier } from "@/features/referral/referral-api.types";
import {
  EarnWhileYouLearnIcon,
  ReferralDocumentIcon,
  ReferralNoteIcon,
  ReferralWhatsappIcon,
} from "./icons";

const PROGRAMMES_URL = "https://www.amdari.io/internship";
const REFERRAL_FORM_URL = "https://forms.gle/pRHB4HMhLszcYSQa6";
const PROGRAMME_INFO_URL = "https://tinyurl.com/Amdari-Referral-Program";
const SUPPORT_PHONE = "+2348160395002";

type RewardTile = { label: string; amount: string };

/** Shown until the reward tiers arrive from the referral code endpoint. */
const FALLBACK_TIERS: RewardTile[] = [
  { label: "1st – 2nd", amount: "£25" },
  { label: "3rd – 4th", amount: "£30" },
  { label: "5th – 7th", amount: "£40" },
  { label: "8th – 9th", amount: "£45" },
  { label: "10th+", amount: "£50" },
];

function ordinal(value: number): string {
  const rest = value % 100;
  if (rest >= 11 && rest <= 13) return `${value}th`;
  return `${value}${["th", "st", "nd", "rd"][value % 10] ?? "th"}`;
}

/** "1st – 2nd" / "10th+", built from the tier's own bounds. */
function tierLabel(tier: ReferralRewardTier): string {
  if (tier.to == null) return `${ordinal(tier.from)}+`;
  if (tier.to === tier.from) return ordinal(tier.from);
  return `${ordinal(tier.from)} – ${ordinal(tier.to)}`;
}

function QuickStep({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-3">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCF5E4] font-sora text-sm font-semibold text-[#092A31]"
      >
        {number}
      </span>
      <div className="min-w-0">
        <p className="font-sora text-sm font-semibold text-[#092A31]">{title}</p>
        <p className="mt-1 font-sora text-sm leading-relaxed text-[#475569]">{children}</p>
      </div>
    </div>
  );
}

export function HowItWorksModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const referralCode = useGetReferralCode();
  const apiTiers = referralCode.data?.reward_tiers;

  const tiers: RewardTile[] =
    apiTiers && apiTiers.length > 0
      ? apiTiers.map((tier) => ({
          label: tierLabel(tier),
          amount: `£${toAmount(tier.amount).toLocaleString()}`,
        }))
      : FALLBACK_TIERS;

  const topReward = tiers[tiers.length - 1]?.amount ?? "£50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] max-w-180 gap-0 overflow-y-auto rounded-2xl p-6 sm:max-w-180 sm:p-10"
      >
        {/* Intro */}
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[#FDF0CE] px-2.5 font-sora text-xs font-semibold tracking-wide text-[#092A31] uppercase">
              <EarnWhileYouLearnIcon />
              Earn while you learn
            </span>

            <DialogTitle className="mt-3 font-clash-display text-3xl leading-tight font-bold text-[#092A31]">
              Unlock Up to {topReward}+ Per Referral!
            </DialogTitle>

            <p className="mt-3 font-sora text-sm leading-relaxed text-[#475569]">
              Got friends or colleagues looking to launch or transition their tech career? Refer
              them to Amdari and earn cash for every person who joins
            </p>
          </div>

          <Image
            src="/how-it-works.png"
            alt=""
            width={520}
            height={380}
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Reward tiers */}
        <section className="mt-6 rounded-2xl bg-[#EDFCF2] p-5">
          <h3 className="font-clash-display text-xl font-semibold text-[#092A31]">
            What you earn per referral:
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {tiers.map((tier) => (
              <div
                key={tier.label}
                className="rounded-xl bg-[#F6FEF9] px-2 py-4 text-center"
              >
                <p className="font-sora text-xs text-[#475569]">{tier.label}</p>
                <p className="mt-1 font-clash-display text-2xl font-bold text-[#092A31]">
                  {tier.amount}
                </p>
                <p className="mt-0.5 font-sora text-xs text-[#64748B]">each</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick steps */}
        <h3 className="mt-6 font-clash-display text-xl font-semibold text-[#092A31]">
          Quick Steps:
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:divide-x sm:divide-[#E2E8F0]">
          <QuickStep number={1} title="Share the Link">
            Send them to browse our programs at{" "}
            <a
              href={PROGRAMMES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#156374] break-words underline-offset-2 hover:underline"
            >
              www.amdari.io/internship
            </a>
          </QuickStep>

          <div className="sm:pl-5">
            <QuickStep number={2} title="Submit Referral Form:">
              Once your referral enrols, register their details here:{" "}
              <a
                href={REFERRAL_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#156374] break-words underline-offset-2 hover:underline"
              >
                {REFERRAL_FORM_URL}
              </a>
            </QuickStep>
          </div>
        </div>

        {/* Payout note */}
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#FFF8E6] p-4">
          <ReferralNoteIcon />
          <p className="font-sora text-sm leading-relaxed text-[#092A31]">
            <span className="font-semibold">Note:</span> Cash rewards are paid out once your
            referred person completes their full payment.
          </p>
        </div>

        {/* Help links */}
        <div className="mt-4 grid grid-cols-1 gap-5 rounded-xl bg-[#E7F2F2] p-4 sm:grid-cols-2">
          <div className="flex min-w-0 gap-3">
            <span className="shrink-0">
              <ReferralDocumentIcon />
            </span>
            <p className="min-w-0 font-sora text-sm leading-relaxed text-[#475569]">
              To learn more about the referral program, visit:{" "}
              <a
                href={PROGRAMME_INFO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#156374] break-words underline-offset-2 hover:underline"
              >
                {PROGRAMME_INFO_URL}
              </a>
            </p>
          </div>

          <div className="flex min-w-0 gap-3">
            <span className="shrink-0">
              <ReferralWhatsappIcon />
            </span>
            <p className="min-w-0 font-sora text-sm leading-relaxed text-[#475569]">
              Have questions? Reach out to us directly on WhatsApp/Call:{" "}
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="font-semibold text-[#156374] underline-offset-2 hover:underline"
              >
                {SUPPORT_PHONE}
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
