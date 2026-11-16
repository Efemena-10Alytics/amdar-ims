"use client";

import { useEffect, useRef } from "react";
import { pingClassroom } from "@/features/presence/presence-api";
import { useAuthStore } from "@/store/auth-store";

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
 * While authenticated and actively viewing a classroom page, POSTs classroom
 * dwell pings every 45s. Skips when the tab is hidden or the user has been
 * idle for 90s+. Fail soft — ping errors never surface to the UI.
 *
 * Mount only on the internship classroom page (separate from platform presence).
 */
export function usePingClassroom() {
  const user = useAuthStore((s) => s.user);
  const token = getTokenFromAuthUser(user);
  const isAuthed = !!token;

  const lastActivityAtRef = useRef(Date.now());
  const lastThrottleAtRef = useRef(0);

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

      void pingClassroom().catch(() => {
        // Fail soft: classroom presence must never break the UI.
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
