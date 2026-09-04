"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  INTERNSHIP_ORIGINAL_PRICE_LABEL,
  INTERNSHIP_DISCOUNTED_PRICE_LABEL,
} from "@/constants/internship-pricing";
import { cn } from "@/lib/utils";
import { usePromoCountdown } from "./use-countdown";
import UrgencyPills from "./urgency-pills";

/** Format "GBP 800" -> "£800" for display. */
function toPoundLabel(label: string): string {
  return label.replace(/^GBP\s+/i, "£");
}

const pad = (value: number) => String(value).padStart(2, "0");

function OfferClockIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#E85A4F] to-[#C44B3A]",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" fill="none" className="size-4">
        <circle cx="10" cy="10" r="7.25" fill="#FFE788" />
        <path
          d="M10 6V10L12.5 12"
          stroke="#C44B3A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export type IWDPaymentProps = {
  /** Where the claim CTA goes — the payment page for this program. */
  applyHref: string;
  className?: string;
};

/**
 * Discounted-price card with a live countdown, shown under the program details.
 * Doubles as the page's primary apply CTA.
 */
export default function IWDPayment({ applyHref, className }: IWDPaymentProps) {
  const { hrs, mins, secs } = usePromoCountdown();

  const originalLabel = toPoundLabel(INTERNSHIP_ORIGINAL_PRICE_LABEL);
  const discountedLabel = toPoundLabel(INTERNSHIP_DISCOUNTED_PRICE_LABEL);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-dashed border-[#CBD5E1] p-4 sm:p-5",
        className,
      )}
      style={{
        background:
          "linear-gradient(90deg, #D6E9EF 0%, #E8F0F3 42%, #FDF8E8 100%)",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2.5">
            <OfferClockIcon className="mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0C3640] sm:text-base">
                Special Offer • Ends in:{" "}
                <span className="font-mono font-bold tabular-nums text-[#DC2626]">
                  {pad(hrs)} : {pad(mins)} : {pad(secs)}
                </span>
              </p>
              <p className="mt-1 text-xs text-[#475467] sm:text-sm">
                500 Hired • On a mission to help 500 more
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-sm text-[#94A3B8] line-through sm:text-base">
              {originalLabel}
            </span>
            <span className="text-3xl font-bold tracking-tight text-[#092A31] sm:text-4xl">
              {discountedLabel}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-[#0C3640] sm:text-sm">
            Discount Applied (Limited Slots Available)
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start justify-between gap-3 sm:items-end">
          <UrgencyPills />
          <Link
            href={applyHref}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full px-5 py-3.5",
              "text-sm font-medium text-white sm:text-base",
              "bg-[#0F4652] transition-colors hover:bg-[#0C3640]",
            )}
          >
            Claim your discount
            <span className="flex size-6 items-center justify-center rounded-full bg-[#FFE082]">
              <ArrowUpRight className="size-3.5 text-[#0F4652]" strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
