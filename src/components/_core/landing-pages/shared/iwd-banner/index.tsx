"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useGetPromoUrgency } from "@/features/payment/use-get-promo-time";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { cn } from "@/lib/utils";
import { usePromoCountdown } from "./use-countdown";
import UrgencyPills, {
  URGENCY_PILL_COUNT,
  URGENCY_PILL_INTERVAL_MS,
} from "./urgency-pills";

const IWD_BANNER_STORAGE_KEY = "amdari-iwd-banner-dismissed";

/** Shown until promo-urgency resolves, so the slot count never flashes empty. */
const FALLBACK_SLOTS_LEFT = 6;

const pad = (value: number) => String(value).padStart(2, "0");

/*
 * Dismissal is read through useSyncExternalStore rather than an effect, so the
 * server render and the first client render agree (banner visible) and a
 * previously dismissed banner disappears on hydration without a cascading render.
 */
const dismissListeners = new Set<() => void>();

function subscribeDismissed(onChange: () => void) {
  dismissListeners.add(onChange);
  return () => {
    dismissListeners.delete(onChange);
  };
}

function getDismissedSnapshot(): boolean {
  try {
    return sessionStorage.getItem(IWD_BANNER_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function dismissBanner() {
  try {
    sessionStorage.setItem(IWD_BANNER_STORAGE_KEY, "true");
  } catch {
    // ignore (private mode / storage disabled)
  }
  dismissListeners.forEach((listener) => listener());
}

export type IWDBannerProps = {
  className?: string;
};

/**
 * Full-width urgency strip above the internship program details: countdown,
 * rotating social proof, and remaining slots.
 */
export default function IWDBanner({ className }: IWDBannerProps) {
  const dismissed = useSyncExternalStore(
    subscribeDismissed,
    getDismissedSnapshot,
    () => false,
  );
  const { data: promoUrgency } = useGetPromoUrgency();
  const { hrs, mins, secs } = usePromoCountdown();
  const [pillsPaused, setPillsPaused] = useState(false);
  const pillIndex = useRotatingIndex(URGENCY_PILL_COUNT, {
    intervalMs: URGENCY_PILL_INTERVAL_MS,
    paused: pillsPaused,
  });

  const slotsLeft =
    typeof promoUrgency?.slots_left === "number"
      ? promoUrgency.slots_left
      : FALLBACK_SLOTS_LEFT;

  if (dismissed) return null;

  return (
    <div
      className={cn("relative overflow-hidden bg-[#F5F0E6]", className)}
      style={{
        backgroundImage: 'url("/sales-banner-noise.png")',
        backgroundSize: "200px auto",
      }}
    >
      <div className="app-width flex flex-col gap-4 py-4 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Countdown + rotating social proof */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-start gap-3">
            <Image
              src="/iwd/iwd-time-icon.svg"
              width={32}
              height={32}
              alt=""
              className="animate-vibrate shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display text-base font-extrabold text-primary sm:text-lg">
                OFFER ENDING SOON!
              </p>
              <p className="mt-0.5 text-sm text-[#334155]">
                Registration ending soon!{" "}
                <span className="font-mono font-semibold tabular-nums animate-countdown-pulse-color">
                  {pad(hrs)} : {pad(mins)} : {pad(secs)}
                </span>
              </p>
            </div>
          </div>
          {/*
           * Both pills read from one timer, the second a step ahead, so they
           * advance together and never show the same item.
           */}
          <div
            className="flex flex-wrap"
            onMouseEnter={() => setPillsPaused(true)}
            onMouseLeave={() => setPillsPaused(false)}
          >
            <UrgencyPills index={pillIndex} className="pl-11" />
            <UrgencyPills
              index={pillIndex + 1}
              announceList={false}
              className="pl-2"
            />
          </div>
        </div>

        {/* Remaining slots */}
        <div className="flex shrink-0 items-center gap-4 rounded-xl bg-[#0F4652] px-5 py-4 text-white">
          <p className="text-xs font-semibold text-white/90">
            Slot Getting Sold Out
          </p>
          <div
            className="rounded-lg bg-[#FFE082] px-4 py-2 text-base font-bold text-[#0F4652]"
            aria-live="polite"
          >
            {slotsLeft} Slots Left!
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={dismissBanner}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/10 hover:text-zinc-800 sm:right-3 sm:top-3"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
