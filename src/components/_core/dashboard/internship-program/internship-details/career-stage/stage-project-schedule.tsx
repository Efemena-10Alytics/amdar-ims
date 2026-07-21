"use client";

import { useState } from "react";
import { Check, ChevronDown, Folder, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export type DayStatus = "completed" | "in-progress" | "not-started";
export type TaskStatus = "done" | "active" | "todo";

export type DayTask = {
  id: string;
  label: string;
  status: TaskStatus;
  href?: string;
};

export type DaySchedule = {
  id: string;
  label: string;
  status: DayStatus;
  tasks: DayTask[];
};

export type WeekSchedule = {
  id: string;
  label: string;
  days: DaySchedule[];
};

export type StageProjectScheduleTone = "active" | "upcoming" | "locked";

type StageProjectScheduleProps = {
  description: string;
  projectTitle: string;
  weekRange: string;
  weeks: WeekSchedule[];
  tone?: StageProjectScheduleTone;
};

const TONE_STYLES: Record<
  StageProjectScheduleTone,
  {
    sectionBorder: string;
    cardBorder: string;
    cardBg: string;
    bodyBg: string;
    divider: string;
  }
> = {
  active: {
    sectionBorder: "border-[#C8E6D0]",
    cardBorder: "border-[#9FD4B0]",
    cardBg: "bg-[#DDF3E4]",
    bodyBg: "bg-[#E8F7EC]",
    divider: "border-[#C8E6D0]",
  },
  upcoming: {
    sectionBorder: "border-[#F0D9C4]",
    cardBorder: "border-[#F0D9C4]",
    cardBg: "bg-[#FFEFD9]",
    bodyBg: "bg-[#FFF4EA]",
    divider: "border-[#F0D9C4]",
  },
  locked: {
    sectionBorder: "border-[#E2E8F0]",
    cardBorder: "border-[#E2E8F0]",
    cardBg: "bg-[#F1F5F9]",
    bodyBg: "bg-[#F8FAFC]",
    divider: "border-[#E2E8F0]",
  },
};

function DayStatusBadge({ status }: { status: DayStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F7A4A]">
        <span className="size-1.5 rounded-full bg-[#1F7A4A]" aria-hidden />
        Completed
      </span>
    );
  }

  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C47A1B]">
        <span className="size-1.5 rounded-full bg-[#C47A1B]" aria-hidden />
        In-progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8]">
      <span className="size-1.5 rounded-full bg-[#94A3B8]" aria-hidden />
      Not started
    </span>
  );
}

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <span className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-transparent text-[#1F7A4A]">
        <Check className="size-3" strokeWidth={3} aria-hidden />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-transparent text-[#C47A1B]">
        <Loader className="size-3.5 animate-spin" strokeWidth={2.5} aria-hidden />
      </span>
    );
  }

  return (
    <span
      className="relative z-10 size-5 shrink-0 rounded-full border-2 border-[#CBD5E1] bg-transparent"
      aria-hidden
    />
  );
}

function DaySection({
  day,
  dividerClass,
}: {
  day: DaySchedule;
  dividerClass: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn("border-b last:border-b-0", dividerClass)}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-2 py-3 text-left"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#173740] transition-transform",
            !isOpen && "-rotate-90",
          )}
          aria-hidden
        />
        <span className="text-sm font-semibold text-[#173740]">{day.label}</span>
        <span className="ml-auto">
          <DayStatusBadge status={day.status} />
        </span>
      </button>

      {isOpen ? (
        <ul className="relative mb-3 ml-6 space-y-3 pb-1">
          {day.tasks.map((task, taskIndex) => (
            <li key={task.id} className="relative flex items-start gap-3">
              {taskIndex < day.tasks.length - 1 ? (
                <span
                  className="absolute top-5 -bottom-3 left-2.5 w-px -translate-x-1/2 bg-[#B7E0C4]"
                  aria-hidden
                />
              ) : null}
              <TaskStatusIcon status={task.status} />
              {task.href ? (
                <a
                  href={task.href}
                  className="text-sm font-medium text-[#156374] underline-offset-2 hover:underline"
                >
                  {task.label}
                </a>
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    task.status === "todo" ? "text-[#94A3B8]" : "text-[#173740]",
                  )}
                >
                  {task.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function StageProjectSchedule({
  description,
  projectTitle,
  weekRange,
  weeks,
  tone = "active",
}: StageProjectScheduleProps) {
  const [activeWeekId, setActiveWeekId] = useState(weeks[0]?.id ?? "");
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const styles = TONE_STYLES[tone];
  const activeWeek = weeks.find((week) => week.id === activeWeekId) ?? weeks[0];

  if (!activeWeek) return null;

  return (
    <div className={cn("border-t px-3 pb-4 pt-3 sm:px-4", styles.sectionBorder)}>
      <p className="text-sm leading-relaxed text-[#64748B]">{description}</p>

      <div
        className={cn(
          "mt-4 overflow-hidden rounded-xl border",
          styles.cardBorder,
          styles.cardBg,
        )}
      >
        <button
          type="button"
          onClick={() => setIsProjectOpen((value) => !value)}
          className="flex w-full cursor-pointer items-start gap-3 px-3 py-3 text-left sm:px-4"
        >
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2B6CB0] text-white">
            <Folder className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#173740] sm:text-base">
              {projectTitle}
            </p>
            <p className="mt-0.5 text-xs text-[#64748B] sm:text-sm">{weekRange}</p>
          </div>
          <ChevronDown
            className={cn(
              "mt-1 size-4 shrink-0 text-[#64748B] transition-transform",
              !isProjectOpen && "-rotate-90",
            )}
            aria-hidden
          />
        </button>

        {isProjectOpen ? (
          <div
            className={cn(
              "border-t px-3 pb-3 pt-2 sm:px-4",
              styles.cardBorder,
              styles.bodyBg,
            )}
          >
            <div className={cn("flex items-end gap-5 border-b", styles.divider)}>
              {weeks.map((week) => {
                const isActive = week.id === activeWeekId;
                return (
                  <button
                    key={week.id}
                    type="button"
                    onClick={() => setActiveWeekId(week.id)}
                    className={cn(
                      "relative cursor-pointer pb-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "text-[#156374]"
                        : "text-[#94A3B8] hover:text-[#64748B]",
                    )}
                  >
                    {week.label}
                    {isActive ? (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#156374]" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-1">
              {activeWeek.days.map((day) => (
                <DaySection
                  key={`${activeWeek.id}-${day.id}`}
                  day={day}
                  dividerClass={styles.divider}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
