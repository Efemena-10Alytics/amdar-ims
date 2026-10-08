"use client";

import { useMemo } from "react";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpekerIcon } from "@/components/_core/dashboard/internship-program/svg";
import OfficeHour from "@/components/_core/dashboard/internship-program/internship-details/career-center/office-hour";
import {
  LIVE_SESSION_DAYS,
  type LiveSession,
  type LiveSessionDayCategory,
} from "@/features/live-session/live-session.types";
import { useGetLiveSessions } from "@/features/live-session/use-get-live-session";

const DAY_LABEL: Record<LiveSessionDayCategory, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thur",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const DAY_ORDER: Record<LiveSessionDayCategory, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

function getTodayCategory(): LiveSessionDayCategory {
  const day = new Date().getDay(); // 0 Sun … 6 Sat
  const map: Record<number, LiveSessionDayCategory> = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };
  return map[day] ?? "sun";
}

/** Sort key relative to today: active day first, then remaining days wrap around. */
function daySortOffset(
  day: LiveSessionDayCategory | null,
  today: LiveSessionDayCategory,
): number {
  if (day == null) return 99;
  const todayOrder = DAY_ORDER[today];
  const dayOrder = DAY_ORDER[day];
  return (dayOrder - todayOrder + LIVE_SESSION_DAYS.length) % LIVE_SESSION_DAYS.length;
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

function LiveSessionList({
  todayCategory,
  visibleSessions,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: {
  todayCategory: LiveSessionDayCategory;
  visibleSessions: LiveSession[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <p className="py-8 text-sm text-[#94A3B8]">Loading live sessions...</p>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2 py-8">
        <p className="text-sm text-[#C0392B]">
          {errorMessage || "Failed to load live sessions."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer text-xs font-medium text-[#156374] underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!visibleSessions.length) {
    return (
      <p className="py-8 text-sm text-[#94A3B8]">No live sessions found.</p>
    );
  }

  return (
    <div className="min-w-0 space-y-3">
      {visibleSessions.map((session) => {
        const sessionDay = normalizeDay(session.category);
        const isToday = sessionDay != null && sessionDay === todayCategory;

        return (
          <LiveSessionCard
            key={session.id}
            session={session}
            isToday={isToday}
          />
        );
      })}
    </div>
  );
}

export default function LiveSession() {
  const todayCategory = getTodayCategory();

  const { sessions, isLoading, isError, errorMessage, refetch } =
    useGetLiveSessions();

  const visibleSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const offsetA = daySortOffset(normalizeDay(a.category), todayCategory);
      const offsetB = daySortOffset(normalizeDay(b.category), todayCategory);
      if (offsetA !== offsetB) return offsetA - offsetB;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [sessions, todayCategory]);

  return (
    <section className="min-w-0">
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <OfficeHour />
        </div>

        <LiveSessionList
          todayCategory={todayCategory}
          visibleSessions={visibleSessions}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    </section>
  );
}
