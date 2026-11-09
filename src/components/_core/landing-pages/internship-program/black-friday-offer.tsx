"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePromoCountdown } from "@/components/_core/landing-pages/shared/iwd-banner/use-countdown";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "amdari-black-friday-offer-dismissed";
const CLAIM_HREF = "/internship";
const SPOTS_CLAIMED = 3;
const SPOTS_TOTAL = 10;
/** Each 24h window starts at 7:00pm UTC+1 (18:00 UTC) and repeats daily. */
const CYCLE_START_HOUR_UTC = 18;
const CLOSE_DELAY_MS = 10_000;

const FLAGS = [
  { src: "/images/svgs/country/UK.svg", alt: "United Kingdom" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
] as const;

function ArrowIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-6 items-center justify-center rounded-full",
        className,
      )}
      aria-hidden
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CountdownRing({
  value,
  label,
  progress,
}: {
  value: number;
  label: string;
  progress: number;
}) {
  const size = 64;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative size-14 sm:size-16">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="size-full -rotate-90"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E24B4B"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-clash-display text-lg font-semibold tabular-nums text-white sm:text-xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[11px] font-medium text-white/80">{label}</span>
    </div>
  );
}

export default function BlackFridayOffer() {
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const { days, hrs, mins, secs } = usePromoCountdown(CYCLE_START_HOUR_UTC);
  const hoursLeft = days * 24 + hrs;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") return;
    } catch {
      // ignore private-mode storage errors
    }

    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => setCanClose(true), CLOSE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // ignore private-mode storage errors
    }
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpen(true);
        return;
      }
      if (!canClose) return;
      dismiss();
    },
    [canClose, dismiss],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-200 bg-black/75"
        className="z-200 w-full max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-3xl border-0 bg-transparent p-0 text-white sm:max-w-215"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        onEscapeKeyDown={(event) => {
          if (!canClose) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (!canClose) event.preventDefault();
        }}
      >
        <div className="relative max-h-[min(92vh,640px)] overflow-y-auto md:max-h-none md:min-h-130 md:overflow-hidden">
          <Image
            src="/images/pngs/black-friday/offer-visual-v3.png"
            alt=""
            fill
            priority
            className="object-cover object-[center_left]"
            sizes="860px"
          />

          <div className="relative grid md:grid-cols-[minmax(0,1.09fr)_minmax(0,0.92fr)]">
            <div className="relative h-72 sm:h-80 md:h-auto" aria-hidden />

            <div className="relative px-5 py-6 sm:px-7 sm:py-8">
              {canClose && (
                <button
                  type="button"
                  onClick={dismiss}
                  className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDD0FA] px-3 py-1 text-[11px] font-semibold text-[#3A2A5C]">
                <span className="size-2 rounded-full bg-[#F5A524]" aria-hidden />
                Limited Black Friday Offer
              </span>

              <p className="mt-4 text-sm font-semibold text-[#E7C15A]">
                Your Offers
              </p>

              <DialogTitle className="mt-1 max-w-sm font-clash-display text-[1.7rem] leading-[1.05] font-semibold tracking-tight text-white sm:text-4xl">
                Get <span className="text-[#F6C945]">10</span> tailored job
                applications
              </DialogTitle>

              <DialogDescription className="mt-3 max-w-sm text-sm leading-relaxed text-white sm:text-base">
                Your <span className="font-semibold text-[#F6C945]">visa pack</span>{" "}
                and <span className="font-semibold text-[#F6C945]">1 year</span> of
                CV-to-Job Matching.
              </DialogDescription>

              <p className="mt-3 text-sm font-bold text-[#F6C945] sm:text-base">
                10 Slots! 24 hours!
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={CLAIM_HREF}
                  onClick={dismiss}
                  className="inline-flex h-11 items-center gap-3 rounded-full bg-[#F6C945] pr-1.5 pl-5 text-sm font-semibold text-[#1A1A1A] transition hover:bg-[#ffd866]"
                >
                  Claim my spot
                  <ArrowIcon className="bg-[#1A1A1A] text-[#F6C945]" />
                </Link>
                <Link
                  href={'/fast-track'}
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 items-center gap-3 rounded-full border border-white/35 pr-1.5 pl-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Read more
                  <ArrowIcon className="bg-[#F6C945] text-[#1A1A1A]" />
                </Link>
              </div>

              <div className="mt-6 flex gap-4 sm:gap-6">
                <CountdownRing
                  value={hoursLeft}
                  label="Hours"
                  progress={hoursLeft / 24}
                />
                <CountdownRing
                  value={mins}
                  label="Minutes"
                  progress={mins / 60}
                />
                <CountdownRing
                  value={secs}
                  label="Seconds"
                  progress={secs / 60}
                />
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                <div className="flex items-center">
                  {FLAGS.map((flag, index) => (
                    <Image
                      key={flag.alt}
                      src={flag.src}
                      alt={flag.alt}
                      width={22}
                      height={22}
                      className={cn(
                        "size-5.5 rounded-full object-cover",
                        index > 0 && "-ml-1.5",
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-white">
                  <span className="font-semibold">
                    {SPOTS_CLAIMED} of {SPOTS_TOTAL}
                  </span>{" "}
                  spots claimed
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
