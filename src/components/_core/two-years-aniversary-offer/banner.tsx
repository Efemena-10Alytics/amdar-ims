"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CLARITY_HREF_DEFAULT =
  "https://calendly.com/efemena-amdari/how-we-can-help-you-land-a-job-through-work-exp-clone";

const TICKER_SEGMENTS = [
  "🎉 500+ Amdari Interns Hired in the UK",
  "Now Recruiting the Next 500",
  "Special Offer Inside",
  "Limited Spots",
] as const;

/** Enough repeats that the -50% scroll loop never shows a gap on wide screens. */
const MARQUEE_REPEATS = 4;

const BANNER_GRADIENTS = {
  home: "linear-gradient(90deg, #FFB53B 0%, #432D09 108.82%)",
  internship: "linear-gradient(89.96deg, #092A31 0.04%, #1C8197 47.13%)",
} as const;

export type AnniversaryBannerVariant = keyof typeof BANNER_GRADIENTS;

export type AnniversaryBannerProps = {
  className?: string;
  clarityHref?: string;
  variant?: AnniversaryBannerVariant;
};

export function AnniversaryBanner({
  className,
  clarityHref = CLARITY_HREF_DEFAULT,
  variant = "internship",
}: AnniversaryBannerProps) {
  const segment = TICKER_SEGMENTS.join(" • ");
  const items = Array.from({ length: MARQUEE_REPEATS }, () => segment);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: BANNER_GRADIENTS[variant] }}
      role="region"
      aria-label="Amdari 2-year anniversary offer"
    >
      <div className="app-width flex h-16 items-center gap-3 sm:h-18 sm:gap-4 md:h-20">
        <div className="relative h-14 w-16 shrink-0 self-center sm:h-16 sm:w-20 md:h-18 md:w-22">
          <Image
            src="/2years-aniversary/2years.png"
            alt="Celebrating 2 years and 500+ success stories"
            fill
            className="object-contain object-left"
            sizes="88px"
            priority
          />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden mask-[linear-gradient(90deg,transparent,black_12px,black_calc(100%-12px),transparent)]">
          <div
            className="flex w-max shrink-0 items-center whitespace-nowrap text-xs font-medium text-white sm:text-sm"
            style={{ animation: "scroll-strip 45s linear infinite" }}
            aria-hidden
          >
            {[...items, ...items].map((text, index) => (
              <span
                key={`${text}-${index}`}
                className="flex items-center gap-3 px-1.5"
              >
                <span>{text}</span>
                <span className="text-white/45">•</span>
              </span>
            ))}
          </div>
          <p className="sr-only">{TICKER_SEGMENTS.join(". ")}.</p>
        </div>

        <Link
          href={clarityHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md bg-[#FFE082] px-4 py-2 text-xs font-semibold text-[#0F4652] transition hover:bg-[#FFD56A] sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Book Clarity
        </Link>
      </div>
    </div>
  );
}

export default AnniversaryBanner;
