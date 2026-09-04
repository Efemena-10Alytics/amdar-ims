"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePromoCountdown } from "@/components/_core/landing-pages/shared/iwd-banner/use-countdown";
import { cn } from "@/lib/utils";

const CLAIM_HREF_DEFAULT = "/internship";
const CLARITY_HREF_DEFAULT = "/clarity-session/data-track";
const SPOTS_CLAIMED = 350;
const SPOTS_TOTAL = 500;
const PEOPLE_HIRED = 250;
const CLOSE_BUTTON_DELAY_MS = 10_000;

const CONFETTI_COLORS = [
  "#F2C94C",
  "#FFE082",
  "#146374",
  "#0F4652",
  "#E85A4F",
  "#FFFFFF",
  "#6B4C9A",
];

type SpecialOfferModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claimHref?: string;
  clarityHref?: string;
};

function ArrowIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-5 items-center justify-center rounded-full bg-[#0F4652]/15",
        className,
      )}
      aria-hidden
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          stroke="currentColor"
          strokeWidth="2.5"
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
  const size = 72;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5">
      <div className="relative size-12 sm:size-16 md:size-18">
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
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E85A4F"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-clash-display text-base font-semibold tabular-nums text-white sm:text-xl md:text-2xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] font-medium text-white/80 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function SpecialOfferModal({
  open,
  onOpenChange,
  claimHref = CLAIM_HREF_DEFAULT,
  clarityHref = CLARITY_HREF_DEFAULT,
}: SpecialOfferModalProps) {
  const { days, hrs, mins, secs } = usePromoCountdown();
  const totalHours = days * 24 + hrs;
  const claimedPct = Math.round((SPOTS_CLAIMED / SPOTS_TOTAL) * 100);
  const confettiFired = useRef(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowCloseButton(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowCloseButton(true);
    }, CLOSE_BUTTON_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) {
      confettiFired.current = false;
      return;
    }
    if (confettiFired.current) return;
    confettiFired.current = true;

    const fire = (
      origin: { x: number; y?: number },
      angle: number,
      particleCount = 55,
    ) => {
      confetti({
        particleCount,
        spread: 68,
        startVelocity: 38,
        origin,
        angle,
        colors: CONFETTI_COLORS,
        zIndex: 300,
      });
    };

    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        fire({ x: 0.2, y: 0.45 }, 60);
        fire({ x: 0.8, y: 0.45 }, 120);
        timers.push(
          window.setTimeout(() => fire({ x: 0.5, y: 0.35 }, 90, 70), 180),
        );
      }, 150),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-200 bg-black/70"
        className={cn(
          "z-200 max-h-[min(96vh,900px)] w-full max-w-222.5 sm:max-w-222.5 gap-0 overflow-hidden border-0 bg-[#083A45] p-0 text-white rounded-xs!",
        )}
      >
        {showCloseButton ? (
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/10 sm:top-4 sm:right-4"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        ) : null}

        <div className="relative max-h-[min(96vh,900px)] overflow-y-auto md:overflow-hidden">
          {/* Soft office backdrop across the modal */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <Image
              src="/2years-aniversary/2years-ani-image.png"
              alt=""
              fill
              className="object-cover opacity-30"
              sizes="890px"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(270.34deg, rgba(20, 99, 116, 0) 2.28%, rgba(20, 99, 116, 0.668269) 64.88%, #146374 95.95%)",
              }}
            />
          </div>

          {/* Right graphic — always an overlay on the right */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 flex w-[48%] items-center justify-center p-2 sm:w-1/2 sm:p-3 lg:p-4">
            <div className="relative h-full w-full max-h-130">
              <Image
                src="/2years-aniversary/2years.png"
                alt="Celebrating 2 years and 500+ success stories"
                fill
                className="object-contain object-center drop-shadow-2xl"
                sizes="(max-width: 640px) 45vw, 445px"
                priority
              />
            </div>
          </div>

          {/* Left content — stretches past center like the Figma frame */}
          <div className="relative z-10 flex w-[80%] flex-col px-5 py-6 sm:px-8 sm:py-8 md:w-[62%] lg:px-10 lg:py-10">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#C7B0E4] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1F0047] sm:text-xs">
              <Image
                src="/iwd/iwd-time-icon.svg"
                width={18}
                height={18}
                alt=""
                className="animate-vibrate shrink-0"
              />
              Limited-Time Anniversary Celebration
            </span>

            <DialogTitle className="mt-4 font-clash-display! text-3xl leading-[1.1] font-semibold text-white sm:text-4xl lg:text-[2.65rem]">
              Celebrating <span className="text-[#FFE082]">500+</span> Success Stories
            </DialogTitle>

            <p className="mt-3 text-base md:text-lg font-semibold">Your Story Could Be Next.{" "}</p>
            <p className="text-base md:text-lg font-semibold text-[#FFE082] sm:text-lg">
              <em className="not-italic font-bold">
                "Every Program is 50% off for 24hrs”</em>
            </p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-[15px]">
              For two years we've helped aspiring professionals gain real-world experience, build job-ready portfolios, and launch global tech careers.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-4 md:gap-5">
              <CountdownRing
                value={totalHours}
                label="Hours"
                progress={totalHours / 24}
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
            <p className="mt-2 text-xs text-white/70">
              Until the anniversary offer closes
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={claimHref}
                onClick={() => onOpenChange(false)}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-[#FFE082] px-5 text-sm font-bold text-[#0F4652] transition hover:border-white/80 hover:bg-transparent hover:font-semibold hover:text-white"
              >
                Claim My 50% Discount
                <ArrowIcon className="bg-[#156374] text-base text-[#FFE082] transition group-hover:bg-[#FFE082] group-hover:text-[#156374]" />
              </Link>
              <Link
                href={clarityHref}
                onClick={() => onOpenChange(false)}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/80 bg-transparent px-5 text-sm font-semibold text-white transition hover:border-transparent hover:bg-[#FFE082] hover:font-bold hover:text-[#0F4652]"
              >
                Book Clarity Session
                <ArrowIcon className="bg-[#FFE082] text-[#156374] transition group-hover:bg-[#156374] group-hover:text-[#FFE082]" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <Image
                  src="/images/svgs/country/CAD.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="rounded-full"
                />
                <Image
                  src="/images/svgs/country/USA.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="-ml-1.5 rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white">
                  <span className="font-semibold">
                    {SPOTS_CLAIMED} of {SPOTS_TOTAL} spots claimed
                  </span>{" "}
                  {/* <span className="text-white/75">
                    {PEOPLE_HIRED} people hired toward our next 500
                  </span> */}
                </p>
                {/* <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-[#F2C94C]"
                    style={{ width: `${claimedPct}%` }}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SpecialOfferModal;
