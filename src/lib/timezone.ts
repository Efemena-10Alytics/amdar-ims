/** Backend session clocks are authored in GMT+1 (Africa/Lagos; no DST). */
export const SOURCE_TIME_ZONE = "Africa/Lagos";
const SOURCE_UTC_OFFSET = "+01:00";

export type ClockParts = {
  hours: number;
  minutes: number;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** IANA timezone from the browser; falls back to Africa/Lagos on the server. */
export function getBrowserTimeZone(): string {
  if (typeof Intl === "undefined") return SOURCE_TIME_ZONE;
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || SOURCE_TIME_ZONE
    );
  } catch {
    return SOURCE_TIME_ZONE;
  }
}

/** Short timezone label for UI (e.g. GMT, BST, EST). */
export function getBrowserTimeZoneLabel(
  timeZone: string = getBrowserTimeZone(),
): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      timeZoneName: "short",
    }).formatToParts(new Date());
    return (
      parts.find((part) => part.type === "timeZoneName")?.value?.trim() ||
      timeZone
    );
  } catch {
    return timeZone;
  }
}

/**
 * Parse clock strings from the API / UI copy.
 * Accepts `14:00`, `14:00:00`, `2pm`, `2:30pm`, `2 pm`.
 */
export function parseClockToParts(value?: string | null): ClockParts | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, "");

  const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
  if (ampmMatch) {
    let hours = Number(ampmMatch[1]);
    const minutes = Number(ampmMatch[2] ?? "0");
    const suffix = ampmMatch[3];
    if (!Number.isFinite(hours) || hours < 1 || hours > 12) return null;
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 59) return null;
    if (suffix === "pm" && hours < 12) hours += 12;
    if (suffix === "am" && hours === 12) hours = 0;
    return { hours, minutes };
  }

  const twentyFourMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourMatch) {
    const hours = Number(twentyFourMatch[1]);
    const minutes = Number(twentyFourMatch[2]);
    if (!Number.isFinite(hours) || hours < 0 || hours > 23) return null;
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 59) return null;
    return { hours, minutes };
  }

  return null;
}

function getCalendarPartsInZone(
  date: Date,
  timeZone: string,
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return {
    year: Number.isFinite(year) ? year : date.getUTCFullYear(),
    month: Number.isFinite(month) ? month : date.getUTCMonth() + 1,
    day: Number.isFinite(day) ? day : date.getUTCDate(),
  };
}

function formatClockInZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;
  const dayPeriod = parts
    .find((part) => part.type === "dayPeriod")
    ?.value?.toLowerCase();

  if (!hour || !dayPeriod) {
    return date.toLocaleTimeString("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (minute === "00") return `${hour}${dayPeriod}`;
  return `${hour}:${minute}${dayPeriod}`;
}

/**
 * Convert a GMT+1 wall-clock string to the viewer's local timezone.
 * Falls back to the original string when parsing fails.
 */
export function convertGmtPlus1Clock(
  value: string,
  timeZone: string = getBrowserTimeZone(),
): string {
  const clock = parseClockToParts(value);
  if (!clock) return value.trim();

  try {
    const { year, month, day } = getCalendarPartsInZone(
      new Date(),
      SOURCE_TIME_ZONE,
    );
    const iso = `${year}-${pad2(month)}-${pad2(day)}T${pad2(clock.hours)}:${pad2(clock.minutes)}:00${SOURCE_UTC_OFFSET}`;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return value.trim();
    return formatClockInZone(date, timeZone);
  } catch {
    return value.trim();
  }
}

/**
 * Convert a GMT+1 start/end pair into a local range with timezone label.
 * Example: `"2pm - 11pm BST"`.
 */
export function formatGmtPlus1Range(
  start: string,
  end: string,
  timeZone: string = getBrowserTimeZone(),
): string {
  const startLocal = convertGmtPlus1Clock(start, timeZone);
  const endLocal = convertGmtPlus1Clock(end, timeZone);
  const label = getBrowserTimeZoneLabel(timeZone);

  if (!startLocal && !endLocal) return label;
  if (!startLocal) return `${endLocal} ${label}`.trim();
  if (!endLocal) return `${startLocal} ${label}`.trim();
  return `${startLocal} - ${endLocal} ${label}`;
}
