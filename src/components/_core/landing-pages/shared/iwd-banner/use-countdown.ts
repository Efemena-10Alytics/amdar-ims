"use client";

import { useCallback, useState, useEffect } from "react";
import { useGetPromoUrgency } from "@/features/payment/use-get-promo-time";

/**
 * The promo countdown is a rolling cycle rather than a fixed campaign deadline,
 * so it can never display more than this many hours. Mirrors
 * `promo_urgency.countdown_cycle_hours` on the API.
 */
const CYCLE_HOURS = 12;
const CYCLE_MS = CYCLE_HOURS * 60 * 60 * 1000;

/** Matches `promo_urgency.countdown_anchor` so the fallback lines up with the API. */
const CYCLE_ANCHOR_MS = Date.UTC(2026, 0, 1, 0, 0, 0);

/**
 * Next boundary of the rolling cycle. Used when the API has not responded yet
 * or returned something unusable — always in the future, never a full cycle away.
 */
export function getRollingCycleEnd(now: number = Date.now()): Date {
  const completedCycles = Math.floor((now - CYCLE_ANCHOR_MS) / CYCLE_MS);
  return new Date(CYCLE_ANCHOR_MS + (completedCycles + 1) * CYCLE_MS);
}

/** @deprecated Kept for the legacy sales banner. Prefer {@link usePromoCountdown}. */
export function getDefaultCountdownEnd(): Date | null {
  return getRollingCycleEnd();
}

/** Parse "YYYY-MM-DD" as end of day (23:59:59). */
export function parseEndDate(endDate: string): Date | null {
  const d = new Date(endDate + "T23:59:59");
  return isNaN(d.getTime()) ? null : d;
}

/** Parse an absolute ISO-8601 timestamp. */
export function parseEndAt(endAt?: string | null): Date | null {
  if (!endAt) return null;
  const d = new Date(endAt);
  return isNaN(d.getTime()) ? null : d;
}

export type CountdownResult = {
  days: number;
  hrs: number;
  mins: number;
  secs: number;
  ended: boolean;
};

export function useCountdown(getEndDate: () => Date | null): CountdownResult {
  const [diff, setDiff] = useState(() => {
    const end = getEndDate();
    if (!end) return -1;
    return Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    const tick = () => {
      const end = getEndDate();
      if (!end) {
        setDiff(-1);
        return;
      }
      setDiff(Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [getEndDate]);

  if (diff < 0) {
    return { days: 0, hrs: 0, mins: 0, secs: 0, ended: true };
  }
  const days = Math.floor(diff / 86400);
  const hrs = Math.floor((diff % 86400) / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  return { days, hrs, mins, secs, ended: false };
}

/**
 * Single source of truth for every promo countdown on the internship and
 * payment pages. Resolves, in order:
 *
 * 1. `seconds_remaining` measured from when the response arrived — immune to a
 *    skewed client clock
 * 2. the absolute `end_at` timestamp
 * 3. a locally computed rolling cycle, if the API is unreachable
 *
 * Anything already elapsed or further out than one cycle falls through to the
 * rolling cycle, so the display is guaranteed to sit between 00:00:00 and 12:00:00
 * and never freezes on "Ended".
 */
export function usePromoCountdown(): CountdownResult {
  const { data, dataUpdatedAt } = useGetPromoUrgency();
  const secondsRemaining = data?.seconds_remaining;
  const endAt = data?.end_at;

  const getEndDate = useCallback((): Date => {
    const now = Date.now();

    let candidate: number | null = null;
    if (typeof secondsRemaining === "number" && dataUpdatedAt > 0) {
      candidate = dataUpdatedAt + secondsRemaining * 1000;
    } else {
      candidate = parseEndAt(endAt)?.getTime() ?? null;
    }

    if (candidate === null || candidate <= now || candidate - now > CYCLE_MS) {
      return getRollingCycleEnd(now);
    }
    return new Date(candidate);
  }, [secondsRemaining, endAt, dataUpdatedAt]);

  return useCountdown(getEndDate);
}
