"use client";

import { AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type InfoToastBannerProps = {
  message: string;
  onDismiss: () => void;
  className?: string;
  variant?: "info" | "danger";
};

const VARIANT_STYLES = {
  info: {
    container: "bg-[#D1E3FF] text-[#3E63A8] border border-[#3E63A8]",
    icon: "text-[#3E63A8]",
    dismiss:
      "text-[#3E63A8] hover:bg-[#3E63A8]/15 focus-visible:ring-[#3E63A8]/35",
  },
  danger: {
    container: "bg-[#FEE2E2] text-[#B91C1C] border border-[#B91C1C]",
    icon: "text-[#B91C1C]",
    dismiss:
      "text-[#B91C1C] hover:bg-[#B91C1C]/15 focus-visible:ring-[#B91C1C]/35",
  },
} as const;

export function InfoToastBanner({
  message,
  onDismiss,
  className,
  variant = "info",
}: InfoToastBannerProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = variant === "danger" ? AlertCircle : Info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed right-4 top-4 z-50 flex max-w-md items-start gap-3 rounded-xl p-4 shadow-lg",
        styles.container,
        className,
      )}
    >
      <Icon
        className={cn("size-5 shrink-0 mt-0.5", styles.icon)}
        aria-hidden
        strokeWidth={2}
      />
      <p className="min-w-0 flex-1 text-sm leading-snug">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className={cn(
          "mt-0.5 shrink-0 rounded-md p-1 transition-colors focus:outline-none focus-visible:ring-2",
          styles.dismiss,
        )}
        aria-label="Dismiss"
      >
        <X className="size-4" aria-hidden strokeWidth={2} />
      </button>
    </div>
  );
}
