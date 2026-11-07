"use client";

import Image from "next/image";
import Link from "next/link";
import { BLACK_FRIDAY_OFFERS } from "@/constants/internship-offers";
import { usePromoCountdown } from "@/components/_core/landing-pages/shared/iwd-banner/use-countdown";
import { cn } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

export type OffersCardProps = {
  className?: string;
  /** Whether to show the "See all offers" button linking to /fast-track. */
  showSeeAllButton?: boolean;
  /** Optional custom href for the "See all offers" button (defaults to /fast-track). */
  seeAllHref?: string;
};

/**
 * Sidebar card listing the Black Friday perks bundled with the internship,
 * with the same rolling countdown used by the internship page banners.
 */
const OffersCard = ({
  className,
  showSeeAllButton = false,
  seeAllHref = "/fast-track",
}: OffersCardProps) => {
  const { hrs, mins, secs } = usePromoCountdown();

  return (
    <section className={cn("rounded-2xl bg-[#C8DDE3] p-2.5", className)}>
      <div className="rounded-xl bg-amdari-yellow p-4">
        <div className="flex items-start gap-2">
          <Image
            src="/iwd/iwd-time-icon.svg"
            width={28}
            height={28}
            alt=""
            className="animate-vibrate shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-clash-display text-lg font-bold text-primary">
              BLACK FRIDAY OFFERS YOU GET
            </h2>
            <p className="mt-0.5 text-xs text-[#334155]">
              Ending soon!{" "}
              <span className="font-mono font-semibold tabular-nums text-red-600">
                {pad(hrs)} : {pad(mins)} : {pad(secs)}
              </span>
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {BLACK_FRIDAY_OFFERS.map((offer) => (
            <li
              key={offer}
              className={cn(
                "rounded-full bg-[#E8CC76] px-4 py-2.5",
                "text-xs font-normal text-[#092A31]",
              )}
            >
              <span aria-hidden>💐 </span> {offer}
            </li>
          ))}
        </ul>

        {showSeeAllButton && (
          <Link
            href={seeAllHref}
            className="mt-4 block w-full rounded-xl bg-[#156374] py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#0C3640]"
          >
            See all offers
          </Link>
        )}
      </div>
    </section>
  );
};

export default OffersCard;
