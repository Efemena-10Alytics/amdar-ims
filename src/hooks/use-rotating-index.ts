"use client";

import { useEffect, useState } from "react";

const DEFAULT_INTERVAL_MS = 3000;

export type UseRotatingIndexOptions = {
  /** Milliseconds each item stays on screen. Defaults to 3000. */
  intervalMs?: number;
  /** Freeze the rotation — used to hold the current item while hovered. */
  paused?: boolean;
};

/**
 * Cycle an index from 0 to `length - 1`, wrapping back to the start.
 *
 * Each caller keeps its own timer, so two rotating elements on the same page
 * drift apart rather than flipping in lockstep.
 */
export function useRotatingIndex(
  length: number,
  { intervalMs = DEFAULT_INTERVAL_MS, paused = false }: UseRotatingIndexOptions = {},
): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || length <= 1) return;
    const id = setInterval(
      () => setIndex((current) => (current + 1) % length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [paused, length, intervalMs]);

  // Guards against reading past the end if `length` shrinks between renders.
  return length > 0 ? index % length : 0;
}
