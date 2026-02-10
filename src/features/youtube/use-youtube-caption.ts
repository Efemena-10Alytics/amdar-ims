"use client";

import { useEffect, useState } from "react";

/**
 * Fetches the video title (caption) from YouTube via our oEmbed API,
 * in the same way we derive thumbnails from the YouTube URL.
 */
async function fetchYoutubeCaption(videoUrl: string): Promise<string | null> {
  const params = new URLSearchParams({ url: videoUrl });
  const res = await fetch(`/api/youtube-oembed?${params}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { title?: string };
  return data.title ?? null;
}

export interface YoutubeCaptionsResult {
  /** videoUrl -> title from YouTube, or null if fetch failed */
  captions: Record<string, string | null>;
  /** true once all requested URLs have been attempted (success or failure) */
  isLoaded: boolean;
}

/**
 * Fetches captions (titles) for multiple YouTube URLs in parallel,
 * same idea as thumbnails: derive caption from the YouTube link via oEmbed.
 */
export function useYoutubeCaptions(videoUrls: string[]): YoutubeCaptionsResult {
  const [captions, setCaptions] = useState<Record<string, string | null>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoUrls.length === 0) {
      setIsLoaded(true);
      return;
    }

    let cancelled = false;
    const unique = Array.from(new Set(videoUrls));

    Promise.all(
      unique.map(async (url) => {
        const title = await fetchYoutubeCaption(url);
        return { url, title } as const;
      })
    ).then((results) => {
      if (cancelled) return;
      setCaptions(
        results.reduce<Record<string, string | null>>(
          (acc, { url, title }) => ({ ...acc, [url]: title }),
          {}
        )
      );
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [videoUrls.join(",")]);

  return { captions, isLoaded };
}
