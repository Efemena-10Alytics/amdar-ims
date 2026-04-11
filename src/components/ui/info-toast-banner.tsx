"use client";

import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type InfoToastBannerProps = {
  message: string;
  onDismiss: () => void;
  className?: string;
};

export function InfoToastBanner({
  message,
  onDismiss,
  className,
}: InfoToastBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed right-4 top-4 z-50 flex max-w-md items-start gap-3 rounded-xl p-4 shadow-lg",
        "bg-[#D1E3FF] text-[#3E63A8] border border-[#3E63A8]",
        className,
      )}
    >
      <Info
        className="size-5 shrink-0 text-[#3E63A8] mt-0.5"
        aria-hidden
        strokeWidth={2}
      />
      <p className="min-w-0 flex-1 text-sm leading-snug">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-0.5 shrink-0 rounded-md p-1 text-[#3E63A8] transition-colors hover:bg-[#3E63A8]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3E63A8]/35"
        aria-label="Dismiss"
      >
        <X className="size-4" aria-hidden strokeWidth={2} />
      </button>
    </div>
  );
}
