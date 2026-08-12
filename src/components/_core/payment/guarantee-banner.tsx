"use client";

import { useState } from "react";
import { INTERNSHIP_GUARANTEES } from "@/constants/internship-guarantees";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { cn } from "@/lib/utils";

/** Longer sentences than the urgency pills, so they get more reading time. */
const ROTATE_INTERVAL_MS = 4000;

export type GuaranteeBannerProps = {
  className?: string;
};

/**
 * Yellow band closing the checkout enrollment card, cycling through the
 * programme's outcome guarantees one at a time.
 */
const GuaranteeBanner = ({ className }: GuaranteeBannerProps) => {
  const [paused, setPaused] = useState(false);
  const index = useRotatingIndex(INTERNSHIP_GUARANTEES.length, {
    intervalMs: ROTATE_INTERVAL_MS,
    paused,
  });

  return (
    <div
      className={cn(
        "mt-5 flex min-h-16 items-center justify-center",
        "rounded-b-xl border border-dashed border-[#C9A227] bg-amdari-yellow",
        "px-6 py-3.5 text-center text-sm font-semibold text-primary sm:text-base",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Announced once instead of re-reading on every rotation. */}
      <p className="sr-only">{INTERNSHIP_GUARANTEES.join(". ")}.</p>

      <p key={index} aria-hidden className="animate-pill-in">
        <span aria-hidden>💐</span> {INTERNSHIP_GUARANTEES[index]}
      </p>
    </div>
  );
};

export default GuaranteeBanner;
