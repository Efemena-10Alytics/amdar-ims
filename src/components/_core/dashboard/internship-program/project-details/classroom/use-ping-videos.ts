"use client";

import { useEffect, useRef } from "react";
import { pingClassroomVideo } from "@/features/presence/presence-api";
import { useAuthStore } from "@/store/auth-store";

const PING_INTERVAL_MS = 30_000;

function getTokenFromAuthUser(user: Record<string, unknown> | null): string | null {
  if (!user) return null;
  const token = user.token;
  return typeof token === "string" && token.length > 0 ? token : null;
}

/**
 * While authenticated and a classroom video is playing, POSTs video-watch
 * pings every 30s. Pauses when the player is not playing or the tab is
 * hidden. Fail soft — ping errors never surface to the UI.
 */
export function usePingVideos(isPlaying: boolean) {
  const user = useAuthStore((s) => s.user);
  const token = getTokenFromAuthUser(user);
  const isAuthed = !!token;
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!isAuthed || !isPlaying || typeof window === "undefined") return;

    const sendPing = () => {
      if (!isPlayingRef.current) return;
      if (document.visibilityState !== "visible") return;

      void pingClassroomVideo().catch(() => {
        // Fail soft: video presence must never break the UI.
      });
    };

    sendPing();

    const intervalId = window.setInterval(sendPing, PING_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") sendPing();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isAuthed, isPlaying]);
}
