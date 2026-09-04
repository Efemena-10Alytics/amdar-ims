import { cn } from "@/lib/utils";

function OfferClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" fill="#C44B3A" />
      <circle cx="10" cy="10" r="6.75" fill="#FFE788" />
      <path
        d="M10 5.5V10L12.75 12.25"
        stroke="#C44B3A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="3.25" r="0.9" fill="#C44B3A" />
    </svg>
  );
}

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
      <OfferClockIcon className="size-4 shrink-0" />
      <span className="text-xs font-semibold text-[#0C3640] sm:text-sm">
        Special Offer
      </span>
    </span>
  );
}

export default SpecialOfferBadge;
