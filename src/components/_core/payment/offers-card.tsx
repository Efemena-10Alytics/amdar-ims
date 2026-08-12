"use client";

import Image from "next/image";
import { INTERNSHIP_OFFERS } from "@/constants/internship-offers";
import { usePromoCountdown } from "@/components/_core/landing-pages/shared/iwd-banner/use-countdown";
import { cn } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

export type OffersCardProps = {
  className?: string;
};

/**
 * Checkout sidebar card listing everything bundled with the internship, with
 * the same rolling countdown used by the internship page banners.
 */
const OffersCard = ({ className }: OffersCardProps) => {
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
              OFFERS YOU GET
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
          {INTERNSHIP_OFFERS.map((offer) => (
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
      </div>
    </section>
  );
};

export default OffersCard;
