"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, AlarmClock } from "lucide-react";
import {
  INTERNSHIP_ORIGINAL_PRICE_LABEL,
  INTERNSHIP_DISCOUNTED_PRICE_LABEL,
} from "@/constants/internship-pricing";
import { useGetPromoUrgency } from "@/features/payment/use-get-promo-time";
import { cn } from "@/lib/utils";
import Image from "next/image";

const IWD_BANNER_STORAGE_KEY = "amdari-iwd-banner-dismissed";

/** Fallback when promo-urgency API is not yet loaded or returns no data. */
const DUMMY_PROMO_URGENCY = {
  slots_left: 21,
  registered: 5,
  registered_interval_hours: 3,
  viewing: 40,
} as const;

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

function getDefaultCountdownEnd(): Date | null {
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

/** Parse "YYYY-MM-DD" as end of day (23:59:59). */
function parseEndDate(endDate: string): Date | null {
  const d = new Date(endDate + "T23:59:59");
  return isNaN(d.getTime()) ? null : d;
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

export type IWDBannerProps = {
  /** Number of users registered in the last 2 hours (default 24). */
  registeredCount?: number;
  /** Number of users currently viewing (default 87). */
  viewingNow?: number;
  /** Number of slots left (default 6). */
  slotsLeft?: number;
  /** Link for "See offers here" (default /internship or #). */
  offersHref?: string;
};

export const IWDMiddleComp = ({
  slotsLeft,
  originalLabel,
  discountedLabel,
}: {
  slotsLeft: number;
  originalLabel: string;
  discountedLabel: string;
}) => (
  <div className="flex-1 rounded-xl  text-white text-center">
    <div className="w-fit flex mx-auto gap-4 rounded-xl items-center justify-between bg-[#0C3640] px-4 py-1.5">
      <div className="flex-1">
        <div className="w-fit">
          <p className="text-sm font-semibold text-white md:whitespace-nowrap">
            Slot Getting Sold Out
          </p>
          <div
            className="mt-2 rounded-lg px-4 py-2 font-bold text-[#0F4652] animate-countdown-pulse-color bg-[#FFE082] text-sm sm:text-base"
            aria-live="polite"
          >
            {slotsLeft} Slots Left!
          </div>
        </div>
      </div>
      <Image
        src={"/iwd/iwd-center-image.svg"}
        height={72}
        width={20}
        alt="center image"
      />
      <div className="flex-1 mt-3 space-y-0.5 py-3 rounded-xl text-sm font-semibold text-center">
        <div className="w-fit ml-auto space-y-1 rounded-xl bg-[#FFFFFF12] px-6 py-3">
          <h3 className="text-[#93B7BF]">40% off</h3>
          <div className="flex justify-center items-center">
            <p className="text-zinc-400 text-sm line-through">
              {originalLabel}
            </p>
            <p className="text-red-400 font-bold text-lg">{discountedLabel}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function IWDBanner({
  registeredCount = 24,
  viewingNow = 87,
  slotsLeft = 6,
  offersHref = "/internship",
}: IWDBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { data: promoUrgency } = useGetPromoUrgency();

  const countdownEnd = useCallback(() => {
    if (promoUrgency?.end_date) {
      const parsed = parseEndDate(promoUrgency.end_date);
      if (parsed && parsed.getTime() > Date.now()) return parsed;
    }
    return getDefaultCountdownEnd();
  }, [promoUrgency?.end_date]);
  const { mins, secs, ended } = useCountdown(countdownEnd);

  const slotsLeftDisplay =
    typeof promoUrgency?.slots_left === "number"
      ? promoUrgency.slots_left
      : DUMMY_PROMO_URGENCY.slots_left;
  const registeredDisplay =
    typeof promoUrgency?.registered === "number"
      ? promoUrgency.registered
      : DUMMY_PROMO_URGENCY.registered;
  const viewingDisplay =
    typeof promoUrgency?.viewing === "number"
      ? promoUrgency.viewing
      : DUMMY_PROMO_URGENCY.viewing;
  const registeredIntervalHours =
    typeof promoUrgency?.registered_interval_hours === "number"
      ? promoUrgency.registered_interval_hours
      : DUMMY_PROMO_URGENCY.registered_interval_hours;
  console.log("registeredIntervalHours", registeredIntervalHours);
  console.log("registeredDisplay", registeredDisplay);
  console.log("viewingDisplay", viewingDisplay);
  console.log("promoUrgency", promoUrgency);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(IWD_BANNER_STORAGE_KEY) === "true") {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(IWD_BANNER_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  const originalLabel = toPoundLabel(INTERNSHIP_ORIGINAL_PRICE_LABEL);
  const discountedLabel = toPoundLabel(INTERNSHIP_DISCOUNTED_PRICE_LABEL);

  return (
    <div
      className={cn("relative overflow-hidden mx-auto", "bg-[#F5F0E6]")}
      style={{
        backgroundImage: 'url("/sales-banner-noise.png")',
        backgroundSize: "200px auto",
      }}
    >
      <div className="app-width flex flex-col lg:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5">
        {/* Left: limited slot + countdown + activity */}
        <div className="flex flex-1 flex-col  gap-3 min-w-0">
          <div className="flex items-start gap-3">
            <Image
              src={"/iwd/iwd-time-icon.svg"}
              width={32}
              height={32}
              alt="time"
              className="animate-vibrate"
            />
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-extrabold text-primary">
                LIMITED SLOT AVAILABLE
              </p>
              <p className="text-sm text-[#334155] mt-0.5">
                Offer ending soon!{" "}
                {ended ? (
                  "Ended"
                ) : (
                  <span className="font-mono font-semibold tabular-nums text-[#334155] animate-countdown-pulse-color">
                    {/* {String(days).padStart(2, "0")} :{" "} */}
                    {registeredIntervalHours} : {String(mins).padStart(2, "0")}{" "}
                    : {String(secs).padStart(2, "0")}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex text-[#334155]">
            <div className="rounded-full bg-[#E8CC76] px-3 py-2.5 space-y-1 text-xs">
              <p>🔥 {registeredDisplay} Registered in past 2 hour</p>
            </div>
            <div className="rounded-full bg-[#E8CC76] px-3 py-2.5 space-y-1 text-xs">
              <p>👀 {viewingDisplay} viewing now</p>
            </div>
          </div>
        </div>

        {/* Middle: slot sold out + price */}
        <IWDMiddleComp
          discountedLabel={discountedLabel}
          originalLabel={originalLabel}
          slotsLeft={slotsLeftDisplay}
        />

        {/* Right: CTA */}
        <div className="flex-1 flex items-center justify-center sm:justify-end">
          <Link
            href={offersHref}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-6 py-3.5",
              "font-semibold text-white text-center",
              "bg-[#6B5E37] hover:bg-[#4E342E] transition-colors",
            )}
          >
            See offers here
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-2 sm:right-3 sm:top-3 flex items-center justify-center w-8 h-8 rounded-full text-zinc-500 hover:bg-black/10 hover:text-zinc-800 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
