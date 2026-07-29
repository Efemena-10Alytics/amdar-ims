"use client";

import { useMemo } from "react";
import type {
  DaySchedule,
  DayStatus,
  TaskStatus,
  WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import {
  InternProjectCareerStage,
  type InternProject,
  type InternProjectTodo,
} from "@/features/interns-project/internship-project.types";
import { useGetProjectByStage } from "@/features/interns-project/use-get-project-by-stage";
import { useGetTodosByProjectId } from "@/features/interns-project/use-get-todos-by-project-id";

const DAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function pickId(value: unknown): number | string | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") return value;
  return null;
}

function normalizeDayLabel(dayOfWeek: string): string {
  const trimmed = dayOfWeek.trim();
  const match = DAY_ORDER.find(
    (day) => day.toLowerCase() === trimmed.toLowerCase(),
  );
  return match ?? trimmed;
}

function deriveDayStatus(tasks: { status: TaskStatus }[]): DayStatus {
  if (!tasks.length) return "not-started";
  if (tasks.every((task) => task.status === "done")) return "completed";
  if (tasks.some((task) => task.status === "active" || task.status === "done")) {
    return "in-progress";
  }
  return "not-started";
}

function mapTodosToWeekSchedules(todos: InternProjectTodo[]): WeekSchedule[] {
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
          status: "todo" as TaskStatus,
          href: `/dashboard/internship-program-5173/classroom/${todo.id}`,
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

function buildProjectHref(project: InternProject): string {
  const slug = project.slug?.trim();
  if (slug) {
    return `/dashboard/internship-program-5173/projects/${slug}`;
  }
  return `/dashboard/internship-program-5173/projects/${project.id}`;
}

export function useStageProjectScheduleData(
  careerStage: InternProjectCareerStage,
) {
  const enrollmentQuery = useGetUserEnrollment();
  const cohortId =
    pickId(enrollmentQuery.data?.cohort_id) ??
    pickId(enrollmentQuery.data?.cohort?.id) ??
    48;
  const programId =
    pickId(enrollmentQuery.data?.program_id) ??
    pickId(enrollmentQuery.data?.program?.id) ??
    25;

  const projectsQuery = useGetProjectByStage({
    cohortId,
    programId,
    careerStage,
  });

  const project = projectsQuery.data?.[0] ?? null;
  const todosQuery = useGetTodosByProjectId(project?.id);

  const weeks = useMemo(
    () => mapTodosToWeekSchedules(todosQuery.data ?? []),
    [todosQuery.data],
  );

  const isLoading =
    enrollmentQuery.isLoading ||
    projectsQuery.isLoading ||
    (Boolean(project?.id) && todosQuery.isLoading);

  const isError =
    enrollmentQuery.isError || projectsQuery.isError || todosQuery.isError;

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
      await Promise.all([
        enrollmentQuery.refetch(),
        projectsQuery.refetch(),
        todosQuery.refetch(),
      ]);
    },
  };
}
