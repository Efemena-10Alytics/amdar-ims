"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetPromoUrgency } from "@/features/payment/use-get-promo-time";
import { cn } from "@/lib/utils";

/** Milliseconds each pill stays on screen before the next one takes over. */
const ROTATE_INTERVAL_MS = 3000;

/**
 * Shown until the promo-urgency call resolves, so the pill never renders an
 * empty slot or a jarring 0.
 */
const FALLBACK_URGENCY = {
  registered: 24,
  registered_interval_hours: 2,
  slots_left: 6,
  viewing: 18,
} as const;

/** Perks that never change — copy lives here, not on the API. */
const STATIC_PILLS: { value?: string; label: string }[] = [
  { value: "4K+", label: "Success story" },
  { label: "Life time support and access to the platform" },
  { value: "3", label: "Guaranteed Interviews" },
  { value: "3", label: "Months Free Access to CVMatchly" },
];

export type UrgencyPillsProps = {
  /** Extra classes for the pill itself (background/text colour per surface). */
  pillClassName?: string;
  className?: string;
};

/**
 * Rotating social-proof pill: one item visible at a time, cycling through the
 * live urgency numbers and the static perks.
 *
 * Each mounted instance keeps its own timer, so two on the same page drift
 * apart rather than flipping in lockstep.
 */
export default function UrgencyPills({
  pillClassName,
  className,
}: UrgencyPillsProps) {
  const { data } = useGetPromoUrgency();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const registered =
    typeof data?.registered === "number"
      ? data.registered
      : FALLBACK_URGENCY.registered;
  const intervalHours =
    typeof data?.registered_interval_hours === "number"
      ? data.registered_interval_hours
      : FALLBACK_URGENCY.registered_interval_hours;
  const slotsLeft =
    typeof data?.slots_left === "number"
      ? data.slots_left
      : FALLBACK_URGENCY.slots_left;
  const viewing =
    typeof data?.viewing === "number" ? data.viewing : FALLBACK_URGENCY.viewing;

  const pills = useMemo(
    () => [
      {
        value: String(registered),
        label: `Registered in past ${intervalHours} ${
          intervalHours === 1 ? "hour" : "hours"
        }`,
      },
      { value: String(slotsLeft), label: "Slots left" },
      { value: String(viewing), label: "people viewing now" },
      ...STATIC_PILLS,
    ],
    [registered, intervalHours, slotsLeft, viewing],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((current) => (current + 1) % pills.length),
      ROTATE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused, pills.length]);

  const active = pills[index % pills.length];

  return (
    <div
      className={cn("flex min-w-0", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Announced once instead of re-reading on every rotation. */}
      <p className="sr-only">
        {pills
          .map((pill) => [pill.value, pill.label].filter(Boolean).join(" "))
          .join(". ")}
      </p>

      <span
        key={index}
        aria-hidden
        className={cn(
          "animate-pill-in inline-flex items-center gap-1.5 rounded-full px-3 py-2",
          "bg-[#EADCF8] text-[#092A31] text-xs whitespace-nowrap",
          pillClassName,
        )}
      >
        <span aria-hidden>🔥</span>
        {active.value ? (
          <span className="font-semibold">{active.value}</span>
        ) : null}
        <span>{active.label}</span>
      </span>
    </div>
  );
}
