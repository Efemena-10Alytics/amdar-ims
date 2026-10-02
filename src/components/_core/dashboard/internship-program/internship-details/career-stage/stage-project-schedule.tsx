"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Folder, Loader, Lock, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustmDropdownIcon } from "@/components/_core/dashboard/internship-program/svg";
import { RichTextContent } from "@/components/_core/dashboard/internship-program/project-details/project-content";
import AssessmentResult from "@/components/_core/dashboard/internship-program/project-details/assessment/assessment-result";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import {
  INTERN_PROJECT_ASSESSMENTS_QUERY_KEY,
} from "@/features/interns-project/use-get-project-assessments";
import { normalizeReadinessSubmitResultData } from "@/features/readiness-test/normalize-submit-result";
import type {
  ProjectAssessment,
  ProjectAssessmentType,
} from "@/features/interns-project/internship-project.types";
import type { ReadinessTestQuizForm } from "@/features/readiness-test/types";

export type DayStatus = "completed" | "in-progress" | "not-started";
export type TaskStatus = "done" | "in-progress" | "todo";

export type DayTask = {
  id: string;
  label: string;
  status: TaskStatus | null;
  href?: string;
};

export type DaySchedule = {
  id: string;
  label: string;
  /** Null when every type status is null (legacy / never touched). */
  status: DayStatus | null;
  tasks: DayTask[];
};

export type ProjectScheduleTabKind =
  | "week"
  | "pre-assessment"
  | "post-assessment";

export type AssessmentTabMeta = {
  title: string;
  description: string | null;
  status: DayStatus | null;
  isLocked: boolean;
  lockedReason: string | null;
  ctaLabel: string;
  isAvailable: boolean;
  projectId?: number;
  assessmentType?: ProjectAssessmentType;
  source?: ProjectAssessment | null;
};

export type ProjectScheduleTab = {
  id: string;
  kind: ProjectScheduleTabKind;
  label: string;
  days: DaySchedule[];
  assessment?: AssessmentTabMeta;
  /** When true, the tab cannot be selected (e.g. gated on pre-assessment). */
  isDisabled?: boolean;
  disabledReason?: string | null;
};

/** @deprecated Prefer `ProjectScheduleTab` — kept for existing week-only callers. */
export type WeekSchedule = ProjectScheduleTab;

export type StageProjectScheduleTone = "active" | "upcoming" | "locked";

type StageProjectScheduleProps = {
  description?: string;
  projectTitle: string;
  weekRange: string;
  weeks: ProjectScheduleTab[];
  tone?: StageProjectScheduleTone;
  projectHref?: string;
  continueHref?: string;
  continueLabel?: string;
  defaultOpen?: boolean;
  /** When true, omit the stage-card top border wrapper (project Task tab). */
  standalone?: boolean;
  /** Show circular progress in the card header (Task tab). */
  showProgress?: boolean;
};

const TONE_STYLES: Record<
  StageProjectScheduleTone,
  {
    sectionBorder: string;
    cardBorder: string;
    cardBg: string;
    divider: string;
    iconBg: string;
    iconText: string;
  }
> = {
  active: {
    sectionBorder: "border-[#C8E6D0]",
    cardBorder: "border-[#86E9AA]",
    cardBg: "bg-[#EDFCF2]",
    divider: "border-[#C8E6D0]",
    iconBg: "bg-[#34C759]",
    iconText: "text-white",
  },
  upcoming: {
    sectionBorder: "border-[#F0D9C4]",
    cardBorder: "border-[#F0D9C4]",
    cardBg: "bg-[#FFEFD9]",
    divider: "border-[#F5E6D8]",
    iconBg: "bg-[#2B6CB0]",
    iconText: "text-white",
  },
  locked: {
    sectionBorder: "border-[#E2E8F0]",
    cardBorder: "border-[#E2E8F0]",
    cardBg: "bg-[#F1F5F9]",
    divider: "border-[#E2E8F0]",
    iconBg: "bg-[#94A3B8]",
    iconText: "text-white",
  },
};

function computeScheduleProgress(weeks: ProjectScheduleTab[]): number {
  let total = 0;
  let done = 0;

  for (const week of weeks) {
    if (week.kind === "week") {
      for (const day of week.days) {
        for (const task of day.tasks) {
          if (task.status == null) continue;
          total += 1;
          if (task.status === "done") done += 1;
          else if (task.status === "in-progress") done += 0.5;
        }
      }
      continue;
    }

    if (week.assessment?.status != null) {
      total += 1;
      if (week.assessment.status === "completed") done += 1;
      else if (week.assessment.status === "in-progress") done += 0.5;
    }
  }

  if (!total) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

function ScheduleProgressRing({ progress }: { progress: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex size-10 shrink-0 items-center justify-center"
      aria-label={`${progress}% complete`}
    >
      <svg className="size-10 -rotate-90" viewBox="0 0 40 40" aria-hidden>
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#C8E6D0"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#34C759"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold text-[#34C759]">
        {progress === 100 ? "100" : `${progress}%`}
      </span>
    </div>
  );
}

function DayStatusBadge({ status }: { status: DayStatus | null }) {
  if (status == null) {
    return null;
  }

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

function TaskStatusIcon({ status }: { status: TaskStatus | null }) {
  if (status === "done") {
    return (
      <span className="relative z-10 flex size-5 shrink-0 items-center justify-center text-[#1F7A4A]">
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
      </span>
    );
  }

  if (status === "in-progress") {
    return (
      <span className="relative z-10 flex size-5 shrink-0 items-center justify-center text-[#C47A1B]">
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
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center text-[#173740] transition-transform",
            isOpen && "rotate-90",
          )}
          aria-hidden
        >
          <CustmDropdownIcon />
        </span>
        <span className="text-sm font-semibold text-[#173740]">{day.label}</span>
        <span className="ml-auto">
          <DayStatusBadge status={day.status} />
        </span>
      </button>

      {isOpen ? (
        <ul className="relative mb-3 ml-6 space-y-3 pb-1">
          {day.tasks.map((task, taskIndex) => {
            const isActiveTask =
              task.status === "done" || task.status === "in-progress";

            return (
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
                    className={cn(
                      "text-sm font-medium underline-offset-2",
                      isActiveTask
                        ? "text-[#156374] underline"
                        : "text-[#94A3B8] hover:underline",
                    )}
                  >
                    {task.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActiveTask ? "text-[#173740]" : "text-[#94A3B8]",
                    )}
                  >
                    {task.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const DEFAULT_DURATION_MINUTES = 10;

function toDurationMinutes(durationSeconds: number | null | undefined) {
  if (durationSeconds == null) return DEFAULT_DURATION_MINUTES;
  return Math.round(durationSeconds / 60);
}

function toQuizForm(source: ProjectAssessment): ReadinessTestQuizForm {
  return { id: source.id, fields: source.fields };
}

function AssessmentPanel({ assessment }: { assessment: AssessmentTabMeta }) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const source = assessment.source ?? null;
  const isPreAssessment = assessment.assessmentType !== "post";
  const savedResult = source?.my_latest_submission
    ? normalizeReadinessSubmitResultData(source.my_latest_submission)
    : null;
  const hasQuestions = (source?.question_count ?? 0) > 0;
  const canOpen =
    !assessment.isLocked &&
    hasQuestions &&
    (savedResult != null || source?.can_attempt === true);
  const durationMinutes = toDurationMinutes(source?.duration);
  const drawerTitle = isPreAssessment ? "Pre-assessment" : "Post-assessment";

  const handleSubmitted = async () => {
    if (assessment.projectId == null) return;
    await queryClient.invalidateQueries({
      queryKey: INTERN_PROJECT_ASSESSMENTS_QUERY_KEY(assessment.projectId),
    });
  };

  return (
    <div className="mt-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#173740]">
          {assessment.title}
        </p>
        {assessment.description?.trim() ? (
          <RichTextContent
            value={assessment.description}
            className="mt-1 text-sm text-[#64748B] [&_p]:m-0"
          />
        ) : !assessment.isAvailable ? (
          <p className="mt-1 text-sm text-[#94A3B8]">
            Your specialist hasn&apos;t set up this assessment yet.
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {assessment.isLocked ? (
          <p className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8]">
            <Lock className="size-3.5 shrink-0" aria-hidden />
            {assessment.lockedReason?.trim() || "This assessment is locked."}
          </p>
        ) : canOpen && source ? (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex cursor-pointer text-sm font-semibold text-[#156374] underline underline-offset-2 transition hover:text-[#124F5D]"
          >
            {assessment.ctaLabel}
          </button>
        ) : (
          <span />
        )}

        <DayStatusBadge status={assessment.status} />
      </div>

      {source ? (
        <ReadinessTestDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          form={toQuizForm(source)}
          durationMinutes={durationMinutes}
          title={drawerTitle}
          finishLabel="Finish assessment"
          savedResult={savedResult}
          allowRetake={false}
          renderResult={(result) => (
            <AssessmentResult
              result={result}
              maxScore={source.max_score}
              isPreAssessment={isPreAssessment}
              fields={source.fields}
              answers={source.my_latest_submission?.answers ?? []}
              onClose={() => setIsDrawerOpen(false)}
            />
          )}
          onSubmitted={handleSubmitted}
        />
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
  projectHref,
  continueHref,
  continueLabel = "Continue project",
  defaultOpen = true,
  standalone = false,
  showProgress = false,
}: StageProjectScheduleProps) {
  const [activeWeekId, setActiveWeekId] = useState(weeks[0]?.id ?? "");
  const [isProjectOpen, setIsProjectOpen] = useState(defaultOpen);
  const styles = TONE_STYLES[tone];
  const activeWeek = weeks.find((week) => week.id === activeWeekId) ?? weeks[0];
  const actionHref = continueHref ?? projectHref;
  const progress = useMemo(() => computeScheduleProgress(weeks), [weeks]);

  useEffect(() => {
    if (!weeks.length) {
      setActiveWeekId("");
      return;
    }

    const active = weeks.find((week) => week.id === activeWeekId);
    if (!active || active.isDisabled) {
      const firstEnabled =
        weeks.find((week) => !week.isDisabled) ?? weeks[0];
      setActiveWeekId(firstEnabled?.id ?? "");
    }
  }, [activeWeekId, weeks]);

  if (!activeWeek) return null;

  return (
    <div
      className={cn(
        !standalone && "border-t px-3 pb-4 pt-3 sm:px-4",
        !standalone && styles.sectionBorder,
      )}
    >
      {description?.trim() ? (
        <p className="text-sm leading-relaxed text-[#64748B]">{description}</p>
      ) : null}

      <div
        className={cn(
          "overflow-hidden rounded-xl border",
          description?.trim() ? "mt-4" : !standalone && "mt-0",
          styles.cardBorder,
          styles.cardBg,
        )}
      >
        <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
          <button
            type="button"
            onClick={() => setIsProjectOpen((value) => !value)}
            className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left"
            aria-expanded={isProjectOpen}
          >
            <span
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                styles.iconBg,
                styles.iconText,
              )}
            >
              {tone === "active" ? (
                <Settings2 className="size-4" aria-hidden />
              ) : (
                <Folder className="size-4" aria-hidden />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#173740] sm:text-base">
                {projectTitle}
              </p>
              {weekRange ? (
                <p className="mt-0.5 text-xs text-[#64748B] sm:text-sm">
                  {weekRange}
                </p>
              ) : null}
            </div>
          </button>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {showProgress ? (
                <ScheduleProgressRing progress={progress} />
              ) : null}

              <button
                type="button"
                onClick={() => setIsProjectOpen((value) => !value)}
                className="flex size-6 cursor-pointer items-center justify-center rounded text-[#64748B]"
                aria-label={
                  isProjectOpen
                    ? "Collapse project schedule"
                    : "Expand project schedule"
                }
                aria-expanded={isProjectOpen}
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center transition-transform",
                    isProjectOpen && "rotate-90",
                  )}
                  aria-hidden
                >
                  <CustmDropdownIcon />
                </span>
              </button>
            </div>

            {!showProgress && actionHref ? (
              <Link
                href={actionHref}
                className="mr-1 text-right text-sm font-semibold whitespace-nowrap text-[#156374] underline underline-offset-2 transition hover:text-[#124F5D]"
              >
                {continueLabel}
              </Link>
            ) : null}
          </div>
        </div>

        {isProjectOpen ? (
          <div className={cn("border-t px-4 pt-2 pb-4 sm:px-5", styles.divider)}>
            <div
              className={cn(
                "flex items-end gap-5 overflow-x-auto border-b",
                styles.divider,
              )}
            >
              {weeks.map((week) => {
                const isActive = week.id === activeWeekId;
                const isDisabled = week.isDisabled === true;
                return (
                  <button
                    key={week.id}
                    type="button"
                    disabled={isDisabled}
                    title={
                      isDisabled
                        ? (week.disabledReason ?? undefined)
                        : undefined
                    }
                    onClick={() => {
                      if (isDisabled) return;
                      setActiveWeekId(week.id);
                    }}
                    className={cn(
                      "relative flex shrink-0 items-center gap-1.5 pb-2.5 text-sm font-semibold transition-colors",
                      isDisabled
                        ? "cursor-not-allowed text-[#94A3B8]"
                        : isActive
                          ? "cursor-pointer text-[#156374]"
                          : "cursor-pointer text-[#94A3B8] hover:text-[#64748B]",
                    )}
                  >
                    {week.label}
                    {isDisabled ? (
                      <Lock className="size-3 shrink-0" aria-hidden />
                    ) : null}
                    {isActive && !isDisabled ? (
                      <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-[#156374]" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-1">
              {activeWeek.kind === "week" ? (
                activeWeek.days.length ? (
                  activeWeek.days.map((day) => (
                    <DaySection
                      key={`${activeWeek.id}-${day.id}`}
                      day={day}
                      dividerClass={styles.divider}
                    />
                  ))
                ) : (
                  <p className="py-4 text-sm text-[#94A3B8]">
                    No tasks scheduled for this week yet.
                  </p>
                )
              ) : activeWeek.assessment ? (
                <AssessmentPanel assessment={activeWeek.assessment} />
              ) : (
                <p className="py-4 text-sm text-[#94A3B8]">
                  Assessment details are unavailable.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
