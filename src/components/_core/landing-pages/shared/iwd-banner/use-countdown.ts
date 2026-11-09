"use client";

import { useCallback, useState, useEffect } from "react";

/**
 * The promo countdown is a rolling cycle rather than a fixed campaign deadline,
 * so it can never display more than this many hours.
 */
const CYCLE_HOURS = 24;
const CYCLE_MS = CYCLE_HOURS * 60 * 60 * 1000;

/** Default daily reset: 5:00pm in UTC+1 (16:00 UTC). */
const DEFAULT_CYCLE_HOUR_UTC = 16;

/** Fixed calendar day used only to place the daily reset hour. */
const CYCLE_ANCHOR_DATE_UTC = Date.UTC(2026, 8, 5);

/**
 * Next boundary of the rolling cycle — always in the future, never more than
 * one full cycle away. `anchorHourUtc` is the hour the cycle starts each day.
 */
export function getRollingCycleEnd(
  now: number = Date.now(),
  anchorHourUtc: number = DEFAULT_CYCLE_HOUR_UTC,
): Date {
  const anchorMs = CYCLE_ANCHOR_DATE_UTC + anchorHourUtc * 60 * 60 * 1000;
  const completedCycles = Math.floor((now - anchorMs) / CYCLE_MS);
  return new Date(anchorMs + (completedCycles + 1) * CYCLE_MS);
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
 * Single source of truth for every promo countdown. Uses a local 24h rolling
 * cycle so the timer stays between 00:00:00 and 24:00:00 and never freezes
 * on "Ended".
 */
export function usePromoCountdown(anchorHourUtc?: number): CountdownResult {
  const getEndDate = useCallback(
    (): Date => getRollingCycleEnd(Date.now(), anchorHourUtc),
    [anchorHourUtc],
  );
  return useCountdown(getEndDate);
}
