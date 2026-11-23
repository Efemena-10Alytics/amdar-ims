"use client";

import { usePaymentCountdown } from "@/features/payment/use-payment-countdown";
import { cn } from "@/lib/utils";

export function PaymentStatusCountdown({
  secondsRemaining,
  anchorKey,
  variant,
  onExpire,
}: {
  secondsRemaining: number | null;
  anchorKey: string;
  variant: "warning" | "danger";
  onExpire?: () => void;
}) {
  const { days, hours, minutes, seconds } = usePaymentCountdown({
    secondsRemaining,
    anchorKey,
    onExpire,
  });

  if (secondsRemaining == null) return null;

  const isWarning = variant === "warning";

  const units = [
    { value: String(days), label: "DAYS" },
    { value: String(hours).padStart(2, "0"), label: "HOURS" },
    { value: String(minutes).padStart(2, "0"), label: "MINUTES" },
    { value: String(seconds).padStart(2, "0"), label: "SECONDS" },
  ] as const;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border px-3 py-1.5 tabular-nums",
        isWarning
          ? "border-[#E8C565] bg-[#FCE596] text-[#0F2A33]"
          : "border-[#EF4444] bg-[#FBC8C8] text-[#7F1D1D]",
      )}
      aria-label="Payment deadline countdown"
    >
      {units.map((unit, index) => (
        <div key={unit.label} className="inline-flex items-center">
          {index > 0 ? (
            <span
              aria-hidden
              className={cn(
                "px-1 pb-3 text-base font-bold leading-none",
                isWarning ? "text-[#0F2A33]/75" : "text-[#7F1D1D]/80",
              )}
            >
              :
            </span>
          ) : null}
          <div className="flex min-w-9 flex-col items-center">
            <span className="text-base font-bold leading-tight sm:text-lg">
              {unit.value}
            </span>
            <span
              className={cn(
                "text-[9px] font-medium tracking-wider uppercase",
                isWarning ? "text-[#5C4A1E]" : "text-[#7F1D1D]/85",
              )}
            >
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
