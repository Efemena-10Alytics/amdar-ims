"use client";

import { usePresencePing } from "@/features/presence/use-presence-ping";

/** Mount in authenticated shells to keep active-time presence pings running. */
export function PresencePing() {
  usePresencePing();
  return null;
}
