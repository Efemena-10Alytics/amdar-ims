"use client";

import { useMemo, useState } from "react";
import { useGetPromoUrgency } from "@/features/payment/use-get-promo-time";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { cn } from "@/lib/utils";

/** Milliseconds each pill stays on screen before the next one takes over. */
export const URGENCY_PILL_INTERVAL_MS = 3000;

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

/** 3 live urgency numbers + the static perks. */
export const URGENCY_PILL_COUNT = 3 + STATIC_PILLS.length;

export type UrgencyPillsProps = {
  /**
   * Which pill to show. Pass this to drive several instances from one timer so
   * they can never land on the same pill; omit it and the component rotates
   * itself.
   */
  index?: number;
  /**
   * Whether to render the screen-reader list of every pill. Turn it off on all
   * but one instance so the list is not announced twice.
   */
  announceList?: boolean;
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
  index: controlledIndex,
  announceList = true,
  pillClassName,
  className,
}: UrgencyPillsProps) {
  const { data } = useGetPromoUrgency();
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

  // When an index is passed in, the parent owns both the timer and pausing.
  const isControlled = controlledIndex !== undefined;
  const selfIndex = useRotatingIndex(pills.length, {
    intervalMs: URGENCY_PILL_INTERVAL_MS,
    paused: paused || isControlled,
  });
  const index = (isControlled ? controlledIndex : selfIndex) % pills.length;
  const active = pills[index];

  return (
    <div
      className={cn("flex min-w-0", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Announced once instead of re-reading on every rotation. */}
      {announceList ? (
        <p className="sr-only">
          {pills
            .map((pill) => [pill.value, pill.label].filter(Boolean).join(" "))
            .join(". ")}
        </p>
      ) : null}

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
