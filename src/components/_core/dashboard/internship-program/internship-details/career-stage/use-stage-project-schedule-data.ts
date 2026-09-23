"use client";

import { useMemo } from "react";
import type {
  DaySchedule,
  DayStatus,
  TaskStatus,
  WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import type { InternProject, InternProjectTodo, InternProjectTodoTypeStatus } from "@/features/interns-project/internship-project.types";
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
      label: `Week ${weekNumber}`,
      days,
    };
  });
}

function buildWeekRange(weeks: WeekSchedule[]): string {
  if (!weeks.length) return "";
  const numbers = weeks
    .map((week) => Number(week.id.replace("week-", "")))
    .filter((value) => Number.isFinite(value));
  if (!numbers.length) return weeks[0]?.label ?? "";
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return min === max ? `Week ${min}` : `Week ${min}-${max}`;
}

function buildProjectHref(project: InternProject): string | undefined {
  const slug = project.slug?.trim();
  if (!slug) return undefined;
  return `/dashboard/internship-program/projects/${encodeURIComponent(slug)}`;
}

/** Builds week/day schedule UI data from a published stage project + its todos. */
export function useStageProjectScheduleData(project: InternProject | null) {
  const todosQuery = useGetTodosByProjectId(project?.id);

  const weeks = useMemo(
    () => mapTodosToWeekSchedules(todosQuery.data ?? [], project?.slug),
    [project?.slug, todosQuery.data],
  );

  const isLoading = Boolean(project?.id) && todosQuery.isLoading;
  const isError = todosQuery.isError;

  return {
    project,
    weeks,
    weekRange: buildWeekRange(weeks),
    projectTitle: project?.title ?? "",
    projectHref: project ? buildProjectHref(project) : undefined,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && (!project || weeks.length === 0),
    refetch: async () => {
      await todosQuery.refetch();
    },
  };
}
