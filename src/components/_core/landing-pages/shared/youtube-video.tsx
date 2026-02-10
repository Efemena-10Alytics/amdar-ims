"use client";

import React from "react";
import { cn } from "@/lib/utils";

/** Extract YouTube video ID from a watch URL or embed path. */
export function getYoutubeVideoId(urlOrId: string): string | null {
  const match = urlOrId.match(/(?:v=|\/vi\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : urlOrId.length === 11 ? urlOrId : null;
}

/** Get YouTube thumbnail image URL from a watch URL or video ID. */
export function getYoutubeThumbnail(urlOrId: string): string {
  const videoId = getYoutubeVideoId(urlOrId);
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/** Get embed URL for YouTube (no autoplay by default). */
export function getYoutubeEmbedUrl(
  urlOrId: string,
  options?: { autoplay?: boolean }
): string {
  const videoId = getYoutubeVideoId(urlOrId);
  if (!videoId) return "";
  const params = new URLSearchParams();
  if (options?.autoplay) params.set("autoplay", "1");
  const query = params.toString();
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ""}`;
}

export interface YoutubeVideoProps {
  /** YouTube watch URL (e.g. https://www.youtube.com/watch?v=...) or video ID */
  videoUrl: string;
  /** Optional aspect ratio class; default is aspect-video */
  className?: string;
  /** Start playing when loaded */
  autoplay?: boolean;
  /** Allow fullscreen */
  allowFullScreen?: boolean;
  title?: string;
}

/**
 * Embeds a playable YouTube video via iframe. Use for modals or inline playback.
 */
export function YoutubeVideo({
  videoUrl,
  className,
  autoplay = false,
  allowFullScreen = true,
  title = "YouTube video",
}: YoutubeVideoProps) {
  const embedUrl = getYoutubeEmbedUrl(videoUrl, { autoplay });
  const videoId = getYoutubeVideoId(videoUrl);

  if (!videoId || !embedUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-gray-200 text-gray-500",
          className
        )}
      >
        Invalid video URL
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg bg-black", className)}
      style={{ aspectRatio: "16/9" }}
    >
      <iframe
        src={embedUrl}
        title={title}
        allow={
          [
            "accelerometer",
            "autoplay",
            "clipboard-write",
            "encrypted-media",
            "gyroscope",
            "picture-in-picture",
            allowFullScreen && "fullscreen",
          ]
            .filter(Boolean)
            .join("; ") as string
        }
        allowFullScreen={allowFullScreen}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
