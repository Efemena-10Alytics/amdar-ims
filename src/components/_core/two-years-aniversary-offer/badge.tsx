import Image from "next/image";
import { cn } from "@/lib/utils";

export type SpecialOfferBadgeProps = {
  className?: string;
};

export function SpecialOfferBadge({ className }: SpecialOfferBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-[#FFE788] px-2.5 py-1 shadow-sm",
        className,
      )}
    >
      <Image
        src="/iwd/iwd-time-icon.svg"
        width={18}
        height={18}
        alt=""
        className="animate-vibrate shrink-0"
      />
      <span className="text-xs font-semibold text-[#0C3640] sm:text-sm">
        Special Offer
      </span>
    </span>
  );
}

export default SpecialOfferBadge;
