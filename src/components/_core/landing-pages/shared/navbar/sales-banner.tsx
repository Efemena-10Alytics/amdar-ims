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

/** End of offer: 14th March, end of day (local time). */
function getOfferEndDate(): Date {
  const now = new Date();
  const year = now.getFullYear();
  // March 14 at 23:59:59.999 local time
  const end = new Date(year, 2, 14, 23, 59, 59, 999); // month 2 = March
  if (end.getTime() <= now.getTime()) {
    end.setFullYear(year + 1);
  }
  return end;
}

function useCountdown(endDate: Date) {
  const [diff, setDiff] = useState(() =>
    Math.max(0, Math.floor((endDate.getTime() - Date.now()) / 1000)),
  );

  useEffect(() => {
    const tick = () => {
      setDiff((d) => Math.max(0, d - 1));
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const days = Math.floor(diff / 86400);
  const hrs = Math.floor((diff % 86400) / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  return { days, hrs, mins, secs };
}

/** Format "GBP 500" -> "£500" for display. */
function toPoundLabel(label: string): string {
  return label.replace(/^GBP\s+/i, "£");
}

const HASHTAG_STRIP = "#International Woman Day.";

export function SalesBanner() {
  const [dismissed, setDismissed] = useState(false);
  const endDate = getOfferEndDate();
  const { days, hrs, mins, secs } = useCountdown(endDate);

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
          <span className="flex flex-col items-center">
            <span>{String(days).padStart(2, "0")}</span>
            <span className="text-[10px] sm:text-xs font-normal uppercase tracking-wider text-[#64748B]">
              Days
            </span>
          </span>
          <span className="text-[#64748B]">:</span>
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
