"use client";

import { useEffect, useRef, useState } from "react";

export type PaymentCountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function splitCountdown(totalSeconds: number): PaymentCountdownParts {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { days, hours, minutes, seconds };
}

/**
 * Counts down from `secondsRemaining` provided by the backend rather than
 * comparing `deadline_at` against the user's device clock.
 */
export function usePaymentCountdown({
  secondsRemaining,
  anchorKey,
  onExpire,
}: {
  secondsRemaining: number | null | undefined;
  anchorKey: string;
  onExpire?: () => void;
}): PaymentCountdownParts {
  const [tickState, setTickState] = useState<{
    key: string;
    seconds: number;
  }>({
    key: anchorKey,
    seconds: Math.max(0, Math.floor(secondsRemaining ?? 0)),
  });

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (secondsRemaining == null || secondsRemaining <= 0) return;

    const targetMs = Date.now() + secondsRemaining * 1000;
    let expireNotified = false;

    const intervalId = window.setInterval(() => {
      const next = Math.max(0, Math.round((targetMs - Date.now()) / 1000));
      setTickState({ key: anchorKey, seconds: next });

      if (next === 0 && !expireNotified) {
        expireNotified = true;
        onExpireRef.current?.();
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [anchorKey, secondsRemaining]);

  const activeSeconds =
    secondsRemaining == null
      ? 0
      : tickState.key === anchorKey
        ? tickState.seconds
        : Math.max(0, Math.floor(secondsRemaining));

  return splitCountdown(activeSeconds);
}
