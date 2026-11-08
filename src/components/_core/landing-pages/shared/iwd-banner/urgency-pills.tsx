"use client";

import { useState } from "react";
import { BLACK_FRIDAY_OFFERS } from "@/constants/internship-offers";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { cn } from "@/lib/utils";

/** Milliseconds each pill stays on screen before the next one takes over. */
export const URGENCY_PILL_INTERVAL_MS = 3000;

/** The 4 Black Friday perks shown in the rotating purple pills. */
const STATIC_PILLS: { icon?: string; value?: string; label: string }[] = [
  { icon: "🔥", label: BLACK_FRIDAY_OFFERS[0] },
  { icon: "👀", label: BLACK_FRIDAY_OFFERS[2] },
  { icon: "🔥", label: BLACK_FRIDAY_OFFERS[1] },
  { icon: "🔥", label: BLACK_FRIDAY_OFFERS[3] },
];

export const URGENCY_PILL_COUNT = STATIC_PILLS.length;

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
 * 4 Black Friday perks.
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
  const [paused, setPaused] = useState(false);

  // When an index is passed in, the parent owns both the timer and pausing.
  const isControlled = controlledIndex !== undefined;
  const selfIndex = useRotatingIndex(STATIC_PILLS.length, {
    intervalMs: URGENCY_PILL_INTERVAL_MS,
    paused: paused || isControlled,
  });
  const index =
    (isControlled ? controlledIndex : selfIndex) % STATIC_PILLS.length;
  const active = STATIC_PILLS[index];

  return (
    <div
      className={cn("flex min-w-0", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Announced once instead of re-reading on every rotation. */}
      {announceList ? (
        <p className="sr-only">
          {STATIC_PILLS.map((pill) =>
            [pill.value, pill.label].filter(Boolean).join(" "),
          ).join(". ")}
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
        <span aria-hidden>{active.icon ?? "🔥"}</span>
        {active.value ? (
          <span className="font-semibold">{active.value}</span>
        ) : null}
        <span>{active.label}</span>
      </span>
    </div>
  );
}
