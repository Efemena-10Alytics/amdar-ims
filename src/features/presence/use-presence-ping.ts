"use client";

import { useEffect, useRef } from "react";
import { pingPresence } from "@/features/presence/presence-api";
import { useAuthStore } from "@/store/auth-store";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

const PING_INTERVAL_MS = 45_000;
const IDLE_MS = 90_000;
const ACTIVITY_THROTTLE_MS = 1_000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

function getTokenFromAuthUser(user: Record<string, unknown> | null): string | null {
  if (!user) return null;
  const token = user.token;
  return typeof token === "string" && token.length > 0 ? token : null;
}

/**
 * While authenticated and actively using the app, POSTs presence pings every 45s.
 * Skips when the tab is hidden or the user has been idle for 90s+.
 * Fail soft — ping errors never surface to the UI.
 */
export function usePresencePing() {
  const user = useAuthStore((s) => s.user);
  const token = getTokenFromAuthUser(user);
  const isAuthed = !!token;

  const { cohortId, programId } = useSelectedEnrollmentIds();
  const cohortIdRef = useRef(cohortId);
  const programIdRef = useRef(programId);
  const lastActivityAtRef = useRef(Date.now());
  const lastThrottleAtRef = useRef(0);

  useEffect(() => {
    cohortIdRef.current = cohortId;
    programIdRef.current = programId;
  }, [cohortId, programId]);

  useEffect(() => {
    if (!isAuthed || typeof window === "undefined") return;

    lastActivityAtRef.current = Date.now();

    const markActivity = () => {
      const now = Date.now();
      if (now - lastThrottleAtRef.current < ACTIVITY_THROTTLE_MS) return;
      lastThrottleAtRef.current = now;
      lastActivityAtRef.current = now;
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, markActivity, { passive: true });
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastActivityAtRef.current >= IDLE_MS) return;

      void pingPresence({
        cohortId: cohortIdRef.current,
        programId: programIdRef.current,
      }).catch(() => {
        // Fail soft: presence must never break the UI.
      });
    }, PING_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, markActivity);
      }
    };
  }, [isAuthed]);
}
