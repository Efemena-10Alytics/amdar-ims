"use client";

import { INTERNSHIP_OFFERS } from "@/constants/internship-offers";
import { cn } from "@/lib/utils";

/** Enough repeats that the -50% scroll loop never shows a gap on wide screens. */
const MARQUEE_REPEATS = 3;

export type OffersStripProps = {
  className?: string;
};

/**
 * Yellow strip above the checkout: a fixed "Offers you get!" label with the
 * perk list scrolling past it.
 */
export default function OffersStrip({ className }: OffersStripProps) {
  const items = Array.from({ length: MARQUEE_REPEATS }).flatMap(() => [
    ...INTERNSHIP_OFFERS,
  ]);

  return (
    <div className={cn("w-full bg-amdari-yellow", className)}>
      <div className="app-width flex items-center gap-4 py-2.5">
        <div className="shrink-0 rounded-l-2xl bg-[#1D444D] px-2 py-2 text-xs font-semibold font-display text-[#FFE082] sm:text-sm">
          Offers you get!
        </div>

        <div className="flex min-w-0 flex-1 overflow-x-hidden">
          {/* Duplicated inline so the -50% translate loops seamlessly. */}
          <div
            className="flex shrink-0 items-center gap-6 whitespace-nowrap text-xs font-semibold text-primary sm:text-sm"
            style={{ animation: "scroll-strip 90s linear infinite" }}
            aria-hidden
          >
            {[...items, ...items].map((offer, index) => (
              <span
                key={`${offer}-${index}`}
                className="flex items-center gap-6"
              >
                <span>💐 {offer}</span>
                <span className="text-primary/40">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The scrolling copy is decorative; expose the list once for assistive tech. */}
      <p className="sr-only">Offers you get: {INTERNSHIP_OFFERS.join(", ")}.</p>
    </div>
  );
}
