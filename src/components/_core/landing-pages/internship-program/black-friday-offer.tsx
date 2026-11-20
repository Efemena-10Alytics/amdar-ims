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

const CLAIM_HREF = "/internship";
const SPOTS_CLAIMED = 3;
const SPOTS_TOTAL = 10;
/** Each 24h window starts at 7:00pm UTC+1 (18:00 UTC) and repeats daily. */
const CYCLE_START_HOUR_UTC = 18;

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
  const { days, hrs, mins, secs } = usePromoCountdown(CYCLE_START_HOUR_UTC);
  const hoursLeft = days * 24 + hrs;

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpen(true);
        return;
      }
      dismiss();
    },
    [dismiss],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-200 bg-black/75"
        className="z-200 w-full max-w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-2xl border-0 bg-[#1A1028] p-0 text-white sm:max-w-[calc(100%-1.5rem)] sm:rounded-3xl md:max-w-215 md:bg-transparent"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <div className="relative max-h-[min(88dvh,720px)] overflow-y-auto overscroll-contain md:max-h-none md:min-h-130 md:overflow-hidden">
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60 md:top-4 md:right-4 md:bg-black/25"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          {/* Desktop: full-bleed composite behind the grid */}
          <Image
            src="/images/pngs/black-friday/offer-visual-v3.png"
            alt=""
            fill
            priority
            className="hidden object-cover object-[center_left] md:block"
            sizes="860px"
          />

          <div className="relative grid md:grid-cols-[minmax(0,1.09fr)_minmax(0,0.92fr)]">
            {/* Mobile image band / desktop spacer */}
            <div
              className="relative h-48 w-full overflow-hidden sm:h-56 md:h-auto md:min-h-130"
              aria-hidden
            >
              <Image
                src="/images/pngs/black-friday/offer-visual-v3.png"
                alt=""
                fill
                priority
                className="object-cover object-[72%_12%] md:hidden"
                sizes="(max-width: 768px) 100vw, 0px"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#1A1028] to-transparent md:hidden" />
            </div>

            <div className="relative bg-[#1A1028] px-4 pt-1 pb-6 sm:px-6 sm:pb-8 md:bg-transparent md:px-7 md:py-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDD0FA] px-3 py-1 text-[11px] font-semibold text-[#3A2A5C]">
                <span className="size-2 rounded-full bg-[#F5A524]" aria-hidden />
                Limited Black Friday Offer
              </span>

              <p className="mt-3 text-sm font-semibold text-[#E7C15A] sm:mt-4">
                Your Offers
              </p>

              <DialogTitle className="mt-1 max-w-sm font-clash-display text-[1.55rem] leading-[1.1] font-semibold tracking-tight text-white sm:text-[1.7rem] md:text-4xl">
                Get <span className="text-[#F6C945]">10</span> tailored job
                applications
              </DialogTitle>

              <DialogDescription className="mt-2.5 max-w-sm text-sm leading-relaxed text-white sm:mt-3 sm:text-base">
                Your{" "}
                <span className="font-semibold text-[#F6C945]">visa pack</span>{" "}
                and{" "}
                <span className="font-semibold text-[#F6C945]">1 year</span> of
                CV-to-Job Matching.
              </DialogDescription>

              <p className="mt-2.5 text-sm font-bold text-[#F6C945] sm:mt-3 sm:text-base">
                10 Slots! 24 hours!
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <Link
                  href={CLAIM_HREF}
                  onClick={dismiss}
                  className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full bg-[#F6C945] pr-1.5 pl-5 text-sm font-semibold text-[#1A1A1A] transition hover:bg-[#ffd866] sm:w-auto sm:justify-start"
                >
                  Claim my spot
                  <ArrowIcon className="bg-[#1A1A1A] text-[#F6C945]" />
                </Link>
                <Link
                  href="/fast-track"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-white/35 pr-1.5 pl-5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:justify-start"
                >
                  Read more
                  <ArrowIcon className="bg-[#F6C945] text-[#1A1A1A]" />
                </Link>
              </div>

              <div className="mt-5 flex gap-3 sm:mt-6 sm:gap-6">
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

              <div className="mt-4 flex items-center gap-2.5 sm:mt-5">
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
