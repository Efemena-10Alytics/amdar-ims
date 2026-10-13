"use client";

export type WelcomeCountdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const EMPTY_WELCOME_COUNTDOWN: WelcomeCountdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

/** Display name from `get-user-info` — uses `firstName`. */
export function getWelcomeDisplayName(
  user: Record<string, unknown> | null | undefined,
) {
  if (!user) return "there";

  const firstName = user.firstName;
  if (typeof firstName === "string" && firstName.trim()) {
    return firstName.trim();
  }

  return "there";
}

function parseTargetTime(targetDateStr: string | null) {
  if (!targetDateStr?.trim()) return null;
  const target = new Date(`${targetDateStr.trim()}T00:00:00`).getTime();
  return Number.isNaN(target) ? null : target;
}

export function getCountdownTo(targetDateStr: string | null): WelcomeCountdown {
  const target = parseTargetTime(targetDateStr);
  if (target == null) return EMPTY_WELCOME_COUNTDOWN;

  const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));

  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
  };
}

export function hasProgramStarted(startDateStr: string | null) {
  const start = parseTargetTime(startDateStr);
  if (start == null) return true;
  return Date.now() >= start;
}

export function resolveEndDate(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  durationWeeks: number | null | undefined,
) {
  if (endDate?.trim()) return endDate.trim();
  if (!startDate?.trim() || durationWeeks == null || durationWeeks <= 0) {
    return null;
  }

  const start = new Date(`${startDate.trim()}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  start.setDate(start.getDate() + durationWeeks * 7);
  return start.toISOString().slice(0, 10);
}

function CountdownUnit({
  value,
  shortLabel,
  longLabel,
  valueClassName,
  labelClassName,
}: {
  value: number;
  shortLabel: string;
  longLabel: string;
  valueClassName: string;
  labelClassName: string;
}) {
  return (
    <div className="flex min-w-10 flex-col items-center px-1.5 sm:min-w-12 sm:px-2">
      <span className={valueClassName}>{String(value).padStart(2, "0")}</span>
      <span className={labelClassName}>
        <span className="@[40rem]:hidden">{shortLabel}</span>
        <span className="hidden @[40rem]:inline">{longLabel}</span>
      </span>
    </div>
  );
}

export function WelcomeCountdownRow({
  countdown,
  variant,
}: {
  countdown: WelcomeCountdown;
  variant: "prestart" | "active";
}) {
  const isPrestart = variant === "prestart";
  const valueClassName = isPrestart
    ? "text-2xl font-bold tabular-nums text-[#0B2B33] @[40rem]:text-3xl"
    : "text-2xl font-bold tabular-nums text-[#0B2B33] sm:text-3xl";
  const labelClassName = isPrestart
    ? "mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#8A7350] sm:text-xs"
    : "mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5C4A2E] sm:text-xs";
  const separatorClassName = isPrestart
    ? "pb-4 text-2xl font-bold text-[#0B2B33]/50 @[40rem]:text-3xl"
    : "pb-4 text-xl font-bold text-[#0B2B33]/55 sm:text-2xl";

  const units = [
    { value: countdown.days, shortLabel: "Days", longLabel: "Days" },
    { value: countdown.hours, shortLabel: "Hrs", longLabel: "Hours" },
    { value: countdown.minutes, shortLabel: "Mins", longLabel: "Minutes" },
    { value: countdown.seconds, shortLabel: "Secs", longLabel: "Seconds" },
  ] as const;

  return (
    <div className="inline-flex items-center">
      {units.map((unit, index) => (
        <div key={unit.longLabel} className="inline-flex items-center">
          {index > 0 ? <span className={separatorClassName}>:</span> : null}
          <CountdownUnit
            value={unit.value}
            shortLabel={unit.shortLabel}
            longLabel={unit.longLabel}
            valueClassName={valueClassName}
            labelClassName={labelClassName}
          />
        </div>
      ))}
    </div>
  );
}
