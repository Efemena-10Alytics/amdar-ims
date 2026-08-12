"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

export type IWDPaymentProps = {
  /** Where "Apply now" goes — the payment page for this program. */
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
        "rounded-xl border border-dashed border-[#94A3B8] p-4 overflow-hidden",
        "animate-pricing-gradient",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #C8DDE3 0%, #C8DDE3 30%, rgba(255, 224, 130, 0.15) 38%, rgba(255, 224, 130, 0.4) 50%, rgba(255, 224, 130, 0.15) 62%, #C8DDE3 70%, #C8DDE3 100%)",
        backgroundSize: "300% 100%",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <Image
              src="/iwd/iwd-time-icon.svg"
              width={28}
              height={28}
              alt=""
              className="animate-vibrate shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-primary">
                OFFER ENDING SOON!
              </p>
              <p className="mt-0.5 text-xs text-[#334155]">
                Ends in:{" "}
                <span className="font-mono font-semibold tabular-nums text-red-600">
                  {pad(hrs)} : {pad(mins)} : {pad(secs)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg text-[#64748B] line-through">
              {originalLabel}
            </span>
            <span className="text-2xl font-semibold text-[#092A31] lg:text-3xl">
              {discountedLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            Discount Applied (Limited Slots Available)
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <UrgencyPills />
          <Link
            href={applyHref}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-6 py-3.5",
              "text-base font-medium text-white",
              "bg-primary hover:bg-[#0f4d5a] transition-colors",
            )}
          >
            Apply now
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amdari-yellow">
              <ArrowRight className="h-3 w-3" color="#156374" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
