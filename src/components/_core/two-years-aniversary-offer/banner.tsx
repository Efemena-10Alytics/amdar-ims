"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const CLAIM_HREF_DEFAULT = "/internship";

const TICKER_SEGMENTS = [
  "BLACK FRIDAY OFFER: Get 10 tailored job applications, your visa pack and 1 year of CV-to-Job Matching. 10 Slots. 24 hours only.",
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
  claimHref?: string;
  variant?: AnniversaryBannerVariant;
};

function BlackFridayBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 116 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-11 w-auto sm:h-12 md:h-13", className)}
      aria-label="Black Friday 2026"
    >
      {/* Top tilted dark badge: 🔥 BLACK */}
      <g transform="rotate(-5 54 24)">
        <rect
          x="12"
          y="7"
          width="78"
          height="28"
          rx="5"
          fill="#0E1417"
          stroke="#273238"
          strokeWidth="1"
        />
        <text
          x="20"
          y="26"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="800"
          fontFamily="var(--font-clash-display), system-ui, sans-serif"
          letterSpacing="0.04em"
        >
          🔥BLACK
        </text>
      </g>

      {/* Middle tilted teal badge: FRIDAY */}
      <g transform="rotate(-4 58 48)">
        <rect x="6" y="31" width="98" height="30" rx="5.5" fill="#155E70" />
        <text
          x="55"
          y="51.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="16"
          fontWeight="800"
          fontFamily="var(--font-clash-display), system-ui, sans-serif"
          letterSpacing="0.06em"
        >
          FRIDAY
        </text>
      </g>

      {/* Bottom small pill: 2026 */}
      <g transform="rotate(-4 57 62)">
        <rect
          x="41"
          y="55"
          width="32"
          height="13"
          rx="6.5"
          fill="#0E1417"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="0.75"
        />
        <text
          x="57"
          y="64"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.06em"
        >
          2026
        </text>
      </g>
    </svg>
  );
}

export function AnniversaryBanner({
  className,
  clarityHref,
  claimHref = CLAIM_HREF_DEFAULT,
  variant = "home",
}: AnniversaryBannerProps) {
  const segment = TICKER_SEGMENTS.join(" • ");
  const items = Array.from({ length: MARQUEE_REPEATS }, () => segment);
  const href = claimHref || clarityHref || CLAIM_HREF_DEFAULT;

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: BANNER_GRADIENTS[variant] }}
      role="region"
      aria-label="Amdari Black Friday offer"
    >
      <div className="app-width flex h-13 items-center gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center pr-3 border-r border-white/25">
          <BlackFridayBadge />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden mask-[linear-gradient(90deg,transparent,black_12px,black_calc(100%-12px),transparent)]">
          <div
            className="flex w-max shrink-0 items-center whitespace-nowrap text-xs text-white sm:text-sm md:text-base"
            style={{ animation: "scroll-strip 45s linear infinite" }}
            aria-hidden
          >
            {[...items, ...items].map((text, index) => (
              <span
                key={`${text}-${index}`}
                className="flex items-center gap-3 px-1.5"
              >
                <span>{text}</span>
                <span className="text-white/45">✦</span>
              </span>
            ))}
          </div>
          <p className="sr-only">{TICKER_SEGMENTS.join(". ")}.</p>
        </div>

        <div className="flex shrink-0 items-center pl-3 border-l border-white/25">
          <Link
            href={href}
            className="shrink-0 rounded-md bg-[#FFE082] px-4 h-8 flex items-center text-xs font-semibold text-[#156374] font-display transition hover:bg-[#FFD56A] sm:px-5 sm:text-sm"
          >
            Claim offer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AnniversaryBanner;
