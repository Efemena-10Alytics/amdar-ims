"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * These clips are vertical (9:16), so prefer YouTube's original-aspect-ratio
 * thumbnail — `maxresdefault` is a 16:9 frame with the portrait video
 * pillarboxed inside it. `oar2` isn't documented and 404s on some videos, so
 * fall back through the guaranteed sizes.
 */
const thumbCandidates = (videoId: string) => [
  `https://img.youtube.com/vi/${videoId}/oar2.jpg`,
  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
];

/** Shared across the ads landing pages so the same clips stay in sync everywhere. */
export const TESTIMONIALS = [
  { id: "testi1", videoId: "5by-nylIolQ", name: "Jerry", role: "Data Analytics" },
  {
    id: "testi2",
    videoId: "_GlHg0z2NDI",
    name: "Amdari Graduates",
    role: "Multiple success stories",
  },
  {
    id: "testi3",
    videoId: "JP_mL0e3_0I",
    name: "Chinenye",
    role: "Project Management",
  },
];

type TestimonialVideoThumbProps = {
  onPlay: () => void;
  label: string;
  videoId?: string;
  className?: string;
};

export function TestimonialVideoThumb({
  onPlay,
  label,
  videoId,
  className,
}: TestimonialVideoThumbProps) {
  const sources = videoId ? thumbCandidates(videoId) : [];
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[sourceIndex];

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play testimonial video — ${label}`}
      className={cn(
        "group relative flex aspect-[9/12] w-full cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-br from-[#156374]/60 to-[#061A20]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          // Falls through oar2 → maxresdefault → hqdefault; if all fail the
          // gradient behind stays visible.
          onError={() => setSourceIndex((i) => i + 1)}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : null}

      {/* Keeps the play button and the caption below legible over any frame. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#061A20]/80 via-[#061A20]/20 to-[#061A20]/30" />

      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#FFE082] shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-110">
        <Play className="ml-0.5 h-[15px] w-[15px] fill-[#0C2730] text-[#0C2730]" />
      </div>
    </button>
  );
}

type TestimonialVideoModalProps = {
  videoId: string;
  onClose: () => void;
  title?: string;
};

export function TestimonialVideoModal({
  videoId,
  onClose,
  title = "Amdari testimonial",
}: TestimonialVideoModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const stopPropagation = useCallback(
    (event: React.MouseEvent) => event.stopPropagation(),
    [],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div onClick={stopPropagation} className="relative w-full max-w-[400px]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
        <iframe
          className="aspect-[9/16] w-full rounded-2xl border-0 bg-black"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );
}
