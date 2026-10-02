"use client";

import { useMemo, useState } from "react";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpekerIcon } from "@/components/_core/dashboard/internship-program/svg";
import {
  LIVE_SESSION_DAYS,
  type LiveSession,
  type LiveSessionDayCategory,
} from "@/features/live-session/live-session.types";
import { useGetLiveSessions } from "@/features/live-session/use-get-live-session";

const DAY_FILTERS = [
  { label: "Everyday", value: "everyday" },
  { label: "Mon", value: "mon" },
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thur", value: "thu" },
  { label: "Fri", value: "fri" },
] as const;

type DayFilterValue = (typeof DAY_FILTERS)[number]["value"];

const DAY_LABEL: Record<LiveSessionDayCategory, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thur",
  fri: "Fri",
};

const DAY_ORDER: Record<string, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
};

function getTodayCategory(): LiveSessionDayCategory | null {
  const day = new Date().getDay(); // 0 Sun … 6 Sat
  const map: Record<number, LiveSessionDayCategory | null> = {
    0: null,
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: null,
  };
  return map[day] ?? null;
}

function normalizeDay(category?: string | null): LiveSessionDayCategory | null {
  const value = category?.trim().toLowerCase();
  if (!value) return null;
  if ((LIVE_SESSION_DAYS as readonly string[]).includes(value)) {
    return value as LiveSessionDayCategory;
  }
  return null;
}

function formatClock(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/am|pm/i.test(trimmed)) {
    return trimmed.replace(/\s+/g, " ");
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    let hours = Number(match[1]);
    const minutes = match[2];
    const suffix = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return minutes === "00" ? `${hours}${suffix}` : `${hours}:${minutes}${suffix}`;
  }

  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? "pm" : "am";
    const displayHour = hours % 12 || 12;
    return minutes === 0
      ? `${displayHour}${suffix}`
      : `${displayHour}:${String(minutes).padStart(2, "0")}${suffix}`;
  }

  return trimmed;
}

function formatSessionSchedule(session: LiveSession): string {
  const day = normalizeDay(session.category);
  const dayLabel = day ? DAY_LABEL[day] : session.category;
  const start = formatClock(session.startTime);
  const end = formatClock(session.endTime);
  if (!start || !end) return dayLabel;
  return `${dayLabel} ${start} - ${end} WAT`;
}

function formatSessionType(sessionType?: string | null): string {
  const value = sessionType?.trim().toLowerCase();
  if (value === "mentorship") return "Mentorship";
  if (value === "drop-in-session" || value === "drop_in_session") {
    return "Drop-in Session";
  }
  if (!sessionType?.trim()) return "Live session";
  return sessionType
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function SessionTypeIcon({ active }: { active: boolean }) {
  if (!active) {
    return (
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E4EEF1] text-[#6B8A94]"
        aria-hidden
      >
        <SpekerIcon className="size-[15px]" />
      </span>
    );
  }

  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#C7F5D8] text-[#1F5D36]"
      aria-hidden
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-[#ACF0C5]">
        <SpekerIcon className="size-[15px]" />
      </span>
    </span>
  );
}

function LiveSessionCard({
  session,
  isToday,
}: {
  session: LiveSession;
  isToday: boolean;
}) {
  const href = session.link?.trim() || null;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
        isToday
          ? "border-[#86E9AA] bg-[#EDFCF2]"
          : "border-[#E8EEF1] bg-white",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <SessionTypeIcon active={isToday} />
        <div className="min-w-0 space-y-2">
          <div>
            <p
              className={cn(
                "text-base font-semibold",
                isToday ? "text-[#173740]" : "text-[#64748B]",
              )}
            >
              {formatSessionType(session.sessionType)}
            </p>
            {session.description?.trim() ? (
              <p
                className={cn(
                  "mt-0.5 text-sm",
                  isToday ? "text-[#475467]" : "text-[#94A3B8]",
                )}
              >
                {session.description}
              </p>
            ) : null}
          </div>
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-medium",
              isToday
                ? "bg-[#CFF6DA] text-[#1F7A4A]"
                : "bg-[#E8EEF1] text-[#78909C]",
            )}
          >
            {formatSessionSchedule(session)}
          </span>
        </div>
      </div>

      {isToday ? (
        <a
          href={href ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!href}
          onClick={(event) => {
            if (!href) event.preventDefault();
          }}
          className={cn(
            "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition",
            href
              ? "cursor-pointer border-[#3B82F6] bg-[#C2D8FC] text-[#3B82F6] hover:bg-[#B3CDFA]"
              : "cursor-not-allowed border-[#9DB8C0] bg-[#E8EEF1] text-[#9DB8C0]",
          )}
        >
          <Video className="size-4" aria-hidden />
          Join session
        </a>
      ) : null}
    </article>
  );
}

export default function LiveSession() {
  const [dayFilter, setDayFilter] = useState<DayFilterValue>("everyday");
  const todayCategory = getTodayCategory();

  const requestCategory =
    dayFilter === "everyday" ? undefined : dayFilter;

  const { sessions, isLoading, isError, errorMessage, refetch } =
    useGetLiveSessions({
      category: requestCategory,
    });

  const visibleSessions = useMemo(() => {
    const filtered =
      dayFilter === "everyday"
        ? sessions
        : sessions.filter(
            (session) => normalizeDay(session.category) === dayFilter,
          );

    return [...filtered].sort((a, b) => {
      const dayA = normalizeDay(a.category);
      const dayB = normalizeDay(b.category);
      const orderA = dayA != null ? (DAY_ORDER[dayA] ?? 99) : 99;
      const orderB = dayB != null ? (DAY_ORDER[dayB] ?? 99) : 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [dayFilter, sessions]);

  return (
    <section className="min-w-0 space-y-4">
      <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-6">
        {DAY_FILTERS.map((filter) => {
          const isActive = dayFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setDayFilter(filter.value)}
              className={cn(
                "h-10 w-full cursor-pointer rounded-md border text-sm font-medium transition",
                isActive
                  ? "border-[#4E93A0] bg-[#4E93A0] text-white"
                  : "border-[#DCE5E9] bg-[#F8FAFC] text-[#78909C] hover:border-[#9DB8C0]",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <p className="py-8 text-sm text-[#94A3B8]">Loading live sessions...</p>
      ) : isError ? (
        <div className="space-y-2 py-8">
          <p className="text-sm text-[#C0392B]">
            {errorMessage || "Failed to load live sessions."}
          </p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="cursor-pointer text-xs font-medium text-[#156374] underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : visibleSessions.length ? (
        <div className="space-y-3">
          {visibleSessions.map((session) => {
            const sessionDay = normalizeDay(session.category);
            const isToday =
              sessionDay != null &&
              todayCategory != null &&
              sessionDay === todayCategory;

            return (
              <LiveSessionCard
                key={session.id}
                session={session}
                isToday={isToday}
              />
            );
          })}
        </div>
      ) : (
        <p className="py-8 text-sm text-[#94A3B8]">
          No live sessions found for this day.
        </p>
      )}
    </section>
  );
}
