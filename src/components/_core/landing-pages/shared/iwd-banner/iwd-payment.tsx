"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  INTERNSHIP_ORIGINAL_PRICE_LABEL,
  INTERNSHIP_DISCOUNTED_PRICE_LABEL,
} from "@/constants/internship-pricing";
import { cn } from "@/lib/utils";
import Image from "next/image";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

function getCurrentCountdownEnd(): Date | null {
  const now = new Date();
  const year = now.getFullYear();
  const campaignStart = new Date(year, 2, 7, 0, 0, 0, 0);
  const campaignEnd = new Date(year, 3, 4, 23, 59, 59, 999);

  if (now.getTime() >= campaignEnd.getTime()) return null;
  if (now.getTime() < campaignStart.getTime()) return campaignStart;

  const elapsed = now.getTime() - campaignStart.getTime();
  const cycleIndex = Math.floor(elapsed / FORTY_EIGHT_HOURS_MS);
  const currentCycleEnd = new Date(
    campaignStart.getTime() + (cycleIndex + 1) * FORTY_EIGHT_HOURS_MS,
  );

  if (currentCycleEnd.getTime() > campaignEnd.getTime()) {
    return campaignEnd;
  }
  return currentCycleEnd;
}

function useCountdown(getEndDate: () => Date | null) {
  const [diff, setDiff] = useState(() => {
    const end = getEndDate();
    if (!end) return -1;
    return Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    const tick = () => {
      const end = getEndDate();
      if (!end) {
        setDiff(-1);
        return;
      }
      setDiff(Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [getEndDate]);

  if (diff < 0) {
    return { days: 0, hrs: 0, mins: 0, secs: 0, ended: true as const };
  }
  const days = Math.floor(diff / 86400);
  const hrs = Math.floor((diff % 86400) / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  return { days, hrs, mins, secs, ended: false as const };
}

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
};

export default function IWDPayment({
  registeredCount = 24,
  viewingNow = 87,
  slotsLeft = 6,
  claimHref = "/internship",
  offersHref = "/internship",
}: IWDPaymentProps) {
  const { days, hrs, mins, secs, ended } = useCountdown(getCurrentCountdownEnd);

  const originalLabel = toPoundLabel(INTERNSHIP_ORIGINAL_PRICE_LABEL);
  const discountedLabel = toPoundLabel(INTERNSHIP_DISCOUNTED_PRICE_LABEL);

  return (
    <div className="bg-[#E8EFF1] flex items-center justify-center p-2 rounded-xl">
      <div
        className={cn("w-full rounded-2xl overflow-hidden", "bg-[#FFE082]")}
        style={{
          backgroundImage: 'url("/sales-banner-noise.png")',
          backgroundSize: "200px auto",
        }}
      >
        <div className="p-4 flex flex-col gap-6">
          {/* Top: LIMITED SLOT + countdown */}
          <div className="flex items-center justify-center gap-3">
            <Image
              src={"/iwd/iwd-time-icon.svg"}
              width={32}
              height={32}
              alt="time"
            />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[#0F4652]">
                LIMITED SLOT AVAILABLE
              </h1>
              <p className="text-sm text-[#334155] mt-1 font-semibold">
                Offer ending soon!{" "}
                {ended ? (
                  "Ended"
                ) : (
                  <span className="font-mono font-semibold tabular-nums text-[#334155]">
                    {String(days).padStart(2, "0")} :{" "}
                    {String(hrs).padStart(2, "0")} :{" "}
                    {String(mins).padStart(2, "0")} :{" "}
                    {String(secs).padStart(2, "0")}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mid: Dark teal offer card */}
          <div className="rounded-xl bg-[#0F4652] text-white p-5 sm:p-6 flex lg:flex-col xl:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold text-white/90">
                Slot Getting Sold Out
              </p>
              <div
                className="mt-2 inline-block rounded-lg px-5 py-2.5 font-bold text-[#0F4652] bg-[#FFE082] text-base"
                aria-live="polite"
              >
                {slotsLeft} Slots Left!
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

            <div className="flex-1 mt-3 space-y-0.5 py-3 rounded-xl text-sm font-semibold text-center">
              <div className="w-fit ml-auto space-y-1 rounded-xl bg-[#FFFFFF12] px-6 py-3">
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
          <div className="flex flex-wrap justify-center gap-3 text-xs text-[#334155]">
            <span>🔥 {registeredCount} Registered in past 2 hour</span>
            <span>👀 {viewingNow} viewing now</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href={claimHref}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 w-full sm:w-auto",
                "font-semibold text-white text-center",
                "bg-[#0F4652] hover:bg-[#0C3640] transition-colors",
              )}
            >
              Claim your spot now!
              <ArrowUpRight className="w-5 h-5 shrink-0" />
            </Link>
            <Link
              href={offersHref}
              className="text-sm font-medium text-[#334155] underline underline-offset-2 hover:text-[#0F4652] transition-colors"
            >
              See offers here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
