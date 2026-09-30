"use client";

import { useMemo } from "react";
import type {
  DaySchedule,
  DayStatus,
  ProjectScheduleTab,
  TaskStatus,
  WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import type {
  InternProject,
  InternProjectTodo,
  InternProjectTodoTypeStatus,
  ProjectAssessment,
} from "@/features/interns-project/internship-project.types";
import { useGetProjectAssessments } from "@/features/interns-project/use-get-project-assessments";
import { useGetTodosByProjectId } from "@/features/interns-project/use-get-todos-by-project-id";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

const DAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function useEnrollmentCohortProgramIds() {
  const { cohortId, programId, hasSelection } = useSelectedEnrollmentIds();

  return {
    cohortId,
    programId,
    isLoading: !hasSelection,
    isError: false,
    refetch: async () => undefined,
  };
}

function capitalizeDayLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function normalizeDayLabel(dayOfWeek: string): string {
  const trimmed = dayOfWeek.trim();
  const match = DAY_ORDER.find(
    (day) => day.toLowerCase() === trimmed.toLowerCase(),
  );
  return match ?? capitalizeDayLabel(trimmed);
}

/**
 * Maps API type statuses onto a todo-level task status.
 * `null` types are ignored (legacy / never touched). If every type is null,
 * the schedule badge stays hidden.
 */
function deriveTaskStatus(todo: InternProjectTodo): TaskStatus | null {
  const statuses = (todo.types ?? [])
    .map((type) => type.status)
    .filter(
      (status): status is InternProjectTodoTypeStatus =>
        status === "pending" || status === "completed",
    );

  if (statuses.length === 0) return null;
  if (statuses.every((status) => status === "completed")) return "done";
  return "todo";
}

function deriveDayStatus(tasks: { status: TaskStatus | null }[]): DayStatus | null {
  const known = tasks
    .map((task) => task.status)
    .filter((status): status is TaskStatus => status != null);

  if (!known.length) return null;
  if (known.every((status) => status === "done")) return "completed";
  if (tasks.length >= 2 && known.some((status) => status === "done")) {
    return "in-progress";
  }
  return "not-started";
}

function mapTodosToWeekSchedules(
  todos: InternProjectTodo[],
  projectSlug?: string | null,
): WeekSchedule[] {
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.week !== b.week) return a.week - b.week;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.id - b.id;
  });

  const weekMap = new Map<number, Map<string, InternProjectTodo[]>>();

  for (const todo of sortedTodos) {
    const dayLabel = normalizeDayLabel(todo.dayOfWeek);
    if (!weekMap.has(todo.week)) {
      weekMap.set(todo.week, new Map());
    }
    const dayMap = weekMap.get(todo.week)!;
    if (!dayMap.has(dayLabel)) {
      dayMap.set(dayLabel, []);
    }
    dayMap.get(dayLabel)!.push(todo);
  }

  const slug = projectSlug?.trim();

  return Array.from(weekMap.entries()).map(([weekNumber, dayMap]) => {
    const days: DaySchedule[] = Array.from(dayMap.entries())
      .sort(([dayA], [dayB]) => {
        const indexA = DAY_ORDER.findIndex(
          (day) => day.toLowerCase() === dayA.toLowerCase(),
        );
        const indexB = DAY_ORDER.findIndex(
          (day) => day.toLowerCase() === dayB.toLowerCase(),
        );
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      })
      .map(([dayLabel, dayTodos]) => {
        const tasks = dayTodos.map((todo) => ({
          id: String(todo.id),
          label: todo.title,
          status: deriveTaskStatus(todo),
          href: slug
            ? `/dashboard/internship-program/projects/${encodeURIComponent(slug)}/classroom/${todo.id}`
            : undefined,
        }));

        return {
          id: dayLabel.toLowerCase(),
          label: dayLabel,
          status: deriveDayStatus(tasks),
          tasks,
        };
      });

    return {
      id: `week-${weekNumber}`,
      kind: "week" as const,
      label: `Week ${weekNumber}`,
      days,
    };
  });
}

function deriveAssessmentStatus(
  assessment: ProjectAssessment | null | undefined,
): DayStatus | null {
  if (!assessment) return null;
  if (assessment.my_latest_submission) return "completed";
  if (assessment.is_locked) return "not-started";
  if (assessment.can_attempt) return "not-started";
  return "not-started";
}

function buildAssessmentTab({
  kind,
  label,
  assessment,
  projectId,
  isDisabled = false,
  disabledReason = null,
}: {
  kind: "pre-assessment" | "post-assessment";
  label: string;
  assessment: ProjectAssessment | null | undefined;
  projectId?: number;
  isDisabled?: boolean;
  disabledReason?: string | null;
}): ProjectScheduleTab {
  const status = deriveAssessmentStatus(assessment);
  const isComplete = status === "completed";
  const isLocked = assessment?.is_locked === true || isDisabled;

  return {
    id: kind,
    kind,
    label,
    days: [],
    isDisabled,
    disabledReason,
    assessment: {
      title: assessment?.title?.trim() || label,
      description: assessment?.description ?? null,
      status,
      isLocked,
      lockedReason: isDisabled
        ? disabledReason
        : (assessment?.locked_reason ?? null),
      ctaLabel: isComplete
        ? "View assessment"
        : kind === "pre-assessment"
          ? "Start pre-assessment"
          : "Start post assessment",
      isAvailable: assessment != null,
      projectId,
      assessmentType: kind === "pre-assessment" ? "pre" : "post",
      source: assessment ?? null,
    },
  };
}

function buildWeekRange(tabs: ProjectScheduleTab[]): string {
  const weekTabs = tabs.filter((tab) => tab.kind === "week");
  if (!weekTabs.length) return "";
  const numbers = weekTabs
    .map((week) => Number(week.id.replace("week-", "")))
    .filter((value) => Number.isFinite(value));
  if (!numbers.length) return weekTabs[0]?.label ?? "";
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return min === max ? `Week ${min}` : `Week ${min}-${max}`;
}

function buildProjectHref(project: InternProject): string | undefined {
  const slug = project.slug?.trim();
  if (!slug) return undefined;
  return `/dashboard/internship-program/projects/${encodeURIComponent(slug)}`;
}

function buildAssessmentHref(project: InternProject): string | undefined {
  const base = buildProjectHref(project);
  if (!base) return undefined;
  return `${base}?tab=assessment`;
}

/** Builds week/day schedule UI data from a published stage project + its todos. */
export function useStageProjectScheduleData(project: InternProject | null) {
  const todosQuery = useGetTodosByProjectId(project?.id);
  const assessmentsQuery = useGetProjectAssessments(project?.id);

  const weeks = useMemo(() => {
    const weekTabs = mapTodosToWeekSchedules(
      todosQuery.data ?? [],
      project?.slug,
    );
    const assessments = assessmentsQuery.data;
    // Only gate on a published pre-assessment; if none exists, weeks stay open.
    const preAssessmentDone =
      !assessments?.pre || Boolean(assessments.pre.my_latest_submission);
    const lockReason = "Complete the pre-assessment to unlock this section.";
    const tabs: ProjectScheduleTab[] = [];

    // Always surface pre/post tabs so the card matches the product schedule,
    // even when the specialist has not published an assessment yet.
    tabs.push(
      buildAssessmentTab({
        kind: "pre-assessment",
        label: "Pre-assessment",
        assessment: assessments?.pre,
        projectId: project?.id,
      }),
    );
    tabs.push(
      ...weekTabs.map((tab) =>
        preAssessmentDone
          ? tab
          : {
              ...tab,
              isDisabled: true,
              disabledReason: lockReason,
            },
      ),
    );
    tabs.push(
      buildAssessmentTab({
        kind: "post-assessment",
        label: "Post assessment",
        assessment: assessments?.post,
        projectId: project?.id,
        isDisabled: !preAssessmentDone,
        disabledReason: preAssessmentDone ? null : lockReason,
      }),
    );

    return tabs;
  }, [assessmentsQuery.data, project, todosQuery.data]);

  const isLoading =
    Boolean(project?.id) &&
    (todosQuery.isLoading || assessmentsQuery.isLoading);
  const isError = todosQuery.isError || assessmentsQuery.isError;
  const preAssessmentDone =
    !assessmentsQuery.data?.pre ||
    Boolean(assessmentsQuery.data.pre.my_latest_submission);

  return {
    project,
    weeks,
    weekRange: buildWeekRange(weeks),
    projectTitle: project?.title ?? "",
    projectHref: project ? buildProjectHref(project) : undefined,
    assessmentHref: project ? buildAssessmentHref(project) : undefined,
    preAssessmentDone,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && !project,
    refetch: async () => {
      await Promise.all([todosQuery.refetch(), assessmentsQuery.refetch()]);
    },
  };
}
