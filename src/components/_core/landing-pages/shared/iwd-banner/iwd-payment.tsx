"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  INTERNSHIP_ORIGINAL_PRICE_LABEL,
  INTERNSHIP_DISCOUNTED_PRICE_LABEL,
} from "@/constants/internship-pricing";
import { useGetPromoUrgency } from "@/features/payment/use-get-promo-time";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { OfferDialog } from "./offer";
import {
  getDefaultCountdownEnd,
  parseEndDate,
  useCountdown,
} from "./use-countdown";

const HASHTAG_STRIP = "💐 INTERNATIONAL WOMEN'S DAY OFFER";

function toPoundLabel(label: string): string {
  return label.replace(/^GBP\s+/i, "£");
}

export type IWDPaymentProps = {
  registeredCount?: number;
  viewingNow?: number;
  slotsLeft?: number;
  /** Link for "Claim your spot now!" button */
  claimHref?: string;
  /** Link for "See offers here" text link */
  offersHref?: string;
  id?: number;
};

export default function IWDPayment({
  registeredCount = 24,
  viewingNow = 87,
  slotsLeft = 6,
  id,
  claimHref = id != null ? `/payment/${id}` : "/internship",
}: IWDPaymentProps) {
  const [offerOpen, setOfferOpen] = useState(false);
  const { data: promoUrgency } = useGetPromoUrgency();

  // console.log("promoUrgency", promoUrgency);

  const countdownEnd = useCallback(() => {
    if (promoUrgency?.end_date) {
      const parsed = parseEndDate(promoUrgency.end_date);
      if (parsed && parsed.getTime() > Date.now()) return parsed;
    }
    return getDefaultCountdownEnd();
  }, [promoUrgency?.end_date]);
  const { hrs, mins, secs, ended } = useCountdown(countdownEnd);

  const slotsLeftDisplay =
    typeof promoUrgency?.slots_left === "number"
      ? promoUrgency.slots_left
      : slotsLeft;
  const registeredDisplay =
    typeof promoUrgency?.registered === "number"
      ? promoUrgency.registered
      : registeredCount;
  const viewingDisplay =
    typeof promoUrgency?.viewing === "number"
      ? promoUrgency.viewing
      : viewingNow;


  const originalLabel = toPoundLabel(INTERNSHIP_ORIGINAL_PRICE_LABEL);
  const discountedLabel = toPoundLabel(INTERNSHIP_DISCOUNTED_PRICE_LABEL);

  return (
    <div className="bg-[#E8EFF1] p-2 rounded-xl">
      <OfferDialog
        open={offerOpen}
        onOpenChange={setOfferOpen}
        secureSpotHref={claimHref}
        imageSrc="/images/offers-hands.jpg"
      />
      <div className="overflow-x-hidden flex items-center py-1">
        <div
          className="flex gap-6 whitespace-nowrap font-medium shrink-0 text-primary text-xs"
          style={{ animation: "scroll-strip 35s linear infinite" }}
          aria-hidden
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i}>{HASHTAG_STRIP}</span>
          ))}
        </div>
      </div>
      <div
        className={cn("w-full rounded-2xl overflow-hidden", "bg-[#FFE082]")}
        style={{
          backgroundImage: 'url("/sales-banner-noise.png")',
          backgroundSize: "200px auto",
        }}
      >
        <div className="p-4 flex flex-col gap-2">
          {/* Top: LIMITED SLOT + countdown */}
          <div className="flex items-center justify-center gap-3 mt-1">
            <Image
              src={"/iwd/iwd-time-icon.svg"}
              width={32}
              height={32}
              alt="time"
              className="animate-vibrate"
            />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-primary">
                LIMITED SLOT AVAILABLE
              </h1>
              <p className="text-sm text-[#334155] mt-1 font-semibold">
                Offer ending soon!{" "}
                {ended ? (
                  "Ended"
                ) : (
                  <span className="font-mono font-semibold tabular-nums text-[#334155] animate-countdown-pulse-color">
                    {/* {String(days).padStart(2, "0")} :{" "} */}
                    {String(hrs).padStart(2, "0")} : {String(mins).padStart(2, "0")}{" "}
                    : {String(secs).padStart(2, "0")}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mid: Dark teal offer card */}
          <div className="rounded-xl bg-[#0F4652] text-white p-5 sm:p-3 flex lg:flex-col xl:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold text-white/90">
                Slot Getting Sold Out
              </p>
              <div
                className="mt-2 inline-block rounded-lg px-5 py-2.5 font-bold text-[#0F4652] bg-[#FFE082] animate-countdown-pulse-color text-base"
                aria-live="polite"
              >
                {slotsLeftDisplay} Slots Left!
              </div>
            </div>

            {/* Dashed vertical separator */}
            <Image
              src={"/iwd/iwd-center-image.svg"}
              height={72}
              width={20}
              alt="center image"
              className="inline lg:hidden xl:inline"
            />

            <div className="flex-1 mt-3 rounded-xl text-sm font-semibold text-center">
              <div className="w-fit ml-auto space-y-1 rounded-xl bg-[#FFFFFF12] px-6 py-1">
                <h3 className="text-[#93B7BF]">40% off</h3>
                <div className="flex justify-center items-center">
                  <p className="text-zinc-400 text-sm line-through">
                    {originalLabel}
                  </p>
                  <p className="text-red-400 font-bold text-lg">
                    {discountedLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex justify-center text-[#092A31]">
            <div className="rounded-full bg-[#E8CC76] px-3 py-2.5 space-y-1 text-xs">
              <p>🔥<span className="font-semibold">{registeredDisplay}</span>  Registered in past 1 hour</p>
            </div>
            <div className="rounded-full bg-[#E8CC76] px-3 py-2.5 space-y-1 text-xs">
              <p>👀 <span className="font-semibold">{viewingDisplay}</span> viewing now</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href={claimHref}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 w-full sm:w-4/5 mx-auto text-xs!",
                "font-semibold text-white text-center",
                "bg-primary hover:bg-[#0C3640] transition-colors",
              )}
            >
              Claim your spot now!
              <div className="flex justify-center items-center rounded-full bg-amdari-yellow h-5 w-5">
                <ArrowUpRight className="w-3 h-3 text-primary shrink-0" />
              </div>
            </Link>
            <button
              onClick={() => setOfferOpen(true)}
              className="text-sm font-medium text-[#334155] underline underline-offset-2 hover:text-[#0F4652] transition-colors"
            >
              See offers here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
