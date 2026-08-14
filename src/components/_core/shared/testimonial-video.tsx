"use client";

import { useCallback, useEffect } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
};

export function TestimonialVideoThumb({
  onPlay,
  label,
  className,
}: TestimonialVideoThumbProps) {
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
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFE082] transition-transform duration-200 group-hover:scale-110">
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
