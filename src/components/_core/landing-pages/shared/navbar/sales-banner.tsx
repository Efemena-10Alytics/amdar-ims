"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  INTERNSHIP_ORIGINAL_PRICE_LABEL,
  INTERNSHIP_DISCOUNTED_PRICE_LABEL,
} from "@/constants/internship-pricing";
import { cn } from "@/lib/utils";

const SALES_BANNER_STORAGE_KEY = "amdari-sales-banner-dismissed";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

/** First 48h cycle starts March 7 00:00 local; campaign ends April 4 23:59:59 local. */
function getCurrentCountdownEnd(): Date | null {
  const now = new Date();
  const year = now.getFullYear();
  const campaignStart = new Date(year, 2, 7, 0, 0, 0, 0); // March 7
  const campaignEnd = new Date(year, 3, 4, 23, 59, 59, 999); // April 4

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
      const d = Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000));
      setDiff(d);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [getEndDate]);

  if (diff < 0) {
    return { hrs: 0, mins: 0, secs: 0, ended: true as const };
  }
  const hrs = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  return { hrs, mins, secs, ended: false as const };
}

/** Format "GBP 500" -> "£500" for display. */
function toPoundLabel(label: string): string {
  return label.replace(/^GBP\s+/i, "£");
}

const HASHTAG_STRIP = "#International Woman Day.";

export function SalesBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { hrs, mins, secs, ended } = useCountdown(getCurrentCountdownEnd);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SALES_BANNER_STORAGE_KEY);
      if (stored === "true") setDismissed(true);
    } catch {
      // ignore (e.g. SSR)
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SALES_BANNER_STORAGE_KEY, "true");
    } catch {
      // ignore (e.g. SSR)
    }
  };

  if (dismissed) return null;

  const originalLabel = toPoundLabel(INTERNSHIP_ORIGINAL_PRICE_LABEL);
  const discountedLabel = toPoundLabel(INTERNSHIP_DISCOUNTED_PRICE_LABEL);

  return (
    <div
      className="w-full mt-20 z-10"
      style={{
        backgroundColor: "#FFE082",
        backgroundImage: `url("/images/sales-banner-noise.png")`,
        backgroundSize: "280px auto",
      }}
    >
      {/* Upper: offer + countdown */}
      <div
        className={cn(
          "app-width relative flex flex-wrap items-center justify-between gap-4 sm:gap-6 py-3 min-h-15",
          "text-[#092A31]",
        )}
      >
        <p className="text-sm sm:text-base lg:text-[28px] font-semibold">
          IWD Exclusive Offer, from{" "}
          <span className="line-through text-red-600">{originalLabel}</span> to{" "}
          <span className="font-semibold">{discountedLabel}</span>
        </p>
        <span className="inline-flex items-center rounded-full bg-[#4ADE80] px-3 py-1 text-sm lg:text-lg font-medium text-[#092A31]">
          7th – 14th, March
        </span>
        <span className="hidden sm:block relative h-10 w-auto shrink-0" aria-hidden>
          <Image
            src="/sales-banner.svg"
            alt=""
            width={50}
            height={100}
            className="h-full w-auto object-contain"
          />
        </span>
        <div
          className="flex items-center justify-center -rotate-12 rounded-md px-4 py-2 text-white text-sm font-bold shadow-sm"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #9333ea 100%)",
          }}
        >
          <span className="text-2xl leading-none">40%</span>
          <span className="ml-1 text-base">off</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-lg sm:text-xl font-semibold tabular-nums">
          {ended ? (
            <span className="text-[#092A31]">Ended</span>
          ) : (
            <>
              <span className="flex flex-col items-center">
                <span>{String(hrs).padStart(2, "0")}</span>
                <span className="text-[10px] sm:text-xs font-normal uppercase tracking-wider text-[#64748B]">
                  Hrs
                </span>
              </span>
              <span className="text-[#64748B]">:</span>
              <span className="flex flex-col items-center">
                <span>{String(mins).padStart(2, "0")}</span>
                <span className="text-[10px] sm:text-xs font-normal uppercase tracking-wider text-[#64748B]">
                  Mins
                </span>
              </span>
              <span className="text-[#64748B]">:</span>
              <span className="flex flex-col items-center">
                <span>{String(secs).padStart(2, "0")}</span>
                <span className="text-[10px] sm:text-xs font-normal uppercase tracking-wider text-[#64748B]">
                  Secs
                </span>
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full text-[#64748B] hover:bg-black/5 hover:text-[#092A31] transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Lower: teal strip with hashtag */}
      <div className="bg-primary overflow-x-hidden flex items-center py-3">
        <div
          className="flex gap-6 whitespace-nowrap text-white text-sm font-medium shrink-0"
          style={{ animation: "scroll-strip 25s linear infinite" }}
          aria-hidden
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i}>{HASHTAG_STRIP}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
