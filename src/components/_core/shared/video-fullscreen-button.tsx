"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoFullscreenButtonProps = {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
};

export function VideoFullscreenButton({
  isFullscreen,
  onToggle,
  className,
}: VideoFullscreenButtonProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white/90 text-[#173740] transition hover:bg-white",
        className,
      )}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize2 className="h-3.5 w-3.5" />
      ) : (
        <Maximize2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
