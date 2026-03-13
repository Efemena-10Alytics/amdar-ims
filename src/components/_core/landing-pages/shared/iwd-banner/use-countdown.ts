"use client";

import { useState, useEffect } from "react";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

/**
 * Default IWD campaign countdown: 48h cycles from March 7 00:00, campaign ends April 4 23:59:59.
 * Returns the next cycle end date, or null if campaign has ended.
 */
export function getDefaultCountdownEnd(): Date | null {
  const now = new Date();
  const year = now.getFullYear();
  const campaignStart = new Date(year, 2, 7, 0, 0, 0, 0); // March 7
  const campaignEnd = new Date(year, 3, 4, 23, 59, 59, 999); // April 4

  if (now.getTime() >= campaignEnd.getTime()) return null;
  if (now.getTime() < campaignStart.getTime()) return campaignStart;

  const elapsed = now.getTime() - campaignStart.getTime();
  const cycleIndex = Math.floor(elapsed / FORTY_EIGHT_HOURS_MS);
  const currentCycleEnd = new Date(
    campaignStart.getTime() + (cycleIndex + 1) * FORTY_EIGHT_HOURS_MS,
  );

  if (currentCycleEnd.getTime() > campaignEnd.getTime()) {
    return campaignEnd;
  }
  return currentCycleEnd;
}

/** Parse "YYYY-MM-DD" as end of day (23:59:59). */
export function parseEndDate(endDate: string): Date | null {
  const d = new Date(endDate + "T23:59:59");
  return isNaN(d.getTime()) ? null : d;
}

export type CountdownResult = {
  days: number;
  hrs: number;
  mins: number;
  secs: number;
  ended: boolean;
};

export function useCountdown(
  getEndDate: () => Date | null,
): CountdownResult {
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
