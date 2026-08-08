"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  EllipsisVertical,
  Eye,
  ListChecks,
  Search,
  SlidersHorizontal,
  User,
} from "lucide-react";
import type {
  InternProject,
  InternProjectTodo,
} from "@/features/interns-project/internship-project.types";
import { useGetTodosByProjectId } from "@/features/interns-project/use-get-todos-by-project-id";
import { formatDurationLabel } from "../project-content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DAYS = ["All", "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"] as const;

type DayFilter = (typeof DAYS)[number];
type TodoCategory = "Task" | "Activity";

type TodoRow = {
  id: number;
  title: string;
  week: number;
  weekLabel: string;
  day: Exclude<DayFilter, "All">;
  dayLabel: string;
  typeCount: number;
  category: TodoCategory;
};

const DAY_SHORT_BY_LABEL: Record<string, Exclude<DayFilter, "All">> = {
  sunday: "Sun",
  sun: "Sun",
  monday: "Mon",
  mon: "Mon",
  tuesday: "Tue",
  tue: "Tue",
  wednesday: "Wed",
  wed: "Wed",
  thursday: "Thur",
  thur: "Thur",
  thu: "Thur",
  friday: "Fri",
  fri: "Fri",
  saturday: "Sat",
  sat: "Sat",
};

const DAY_LABELS: Record<Exclude<DayFilter, "All">, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thur: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

function mapDayOfWeek(dayOfWeek: string): Exclude<DayFilter, "All"> {
  const key = dayOfWeek.trim().toLowerCase();
  return DAY_SHORT_BY_LABEL[key] ?? "Mon";
}

function mapTodoToRow(todo: InternProjectTodo): TodoRow {
  const sortedTypes = [...(todo.types ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const primaryType = sortedTypes[0];

  return {
    id: todo.id,
    title: todo.title,
    week: todo.week,
    weekLabel: `Week ${todo.week}`,
    day: mapDayOfWeek(todo.dayOfWeek),
    dayLabel: DAY_LABELS[mapDayOfWeek(todo.dayOfWeek)],
    typeCount: sortedTypes.length,
    category: primaryType?.submissionRequired ? "Task" : "Activity",
  };
}

function ProjectSummary({ project }: { project: InternProject }) {
  const durationLabel = formatDurationLabel(project.duration);

  return (
    <>
      <div className="rounded-xl bg-[#F7F9FA] px-5 py-4 sm:px-7">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.logoPreview || "/favicon.svg"}
            alt={project.companyName || project.title}
            className="mt-0.5 size-5 shrink-0 rounded-full object-cover"
          />
          <h2 className="max-w-3xl text-xl leading-tight font-semibold text-[#34445E] sm:text-2xl">
            {project.title}
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {project.industry ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
            <Building2 className="size-3.5" aria-hidden />
            {project.industry}
          </span>
        ) : null}
        {durationLabel ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
            <CalendarDays className="size-3.5" aria-hidden />
            {durationLabel}
          </span>
        ) : null}
        {project.companyName ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
            <User className="size-3.5" aria-hidden />
            {project.companyName}
          </span>
        ) : null}
      </div>
    </>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-xl border-t-2 border-[#156374] bg-[#E8F0F3] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#64748B]">{label}</p>
          <p className="mt-1 text-xl font-semibold text-[#173740]">{value}</p>
        </div>
        <span className="flex size-6 items-center justify-center rounded-md bg-[#C9DDE2] text-[#156374]">
          <ListChecks className="size-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

function TypeCountLabel({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex size-5 items-center justify-center rounded-full bg-[#EEF2F6] text-[#78909C]">
        <ListChecks className="size-3" aria-hidden />
      </span>
      {count} {count === 1 ? "Action" : "Actions"}
    </span>
  );
}

type TodoProps = {
  project: InternProject;
};

const Todo = ({ project }: TodoProps) => {
  const { data: todos = [], isLoading, isError, refetch } =
    useGetTodosByProjectId(project.id);

  const rows = useMemo(() => todos.map(mapTodoToRow), [todos]);
  const weekOptions = useMemo(() => {
    const weeks = Array.from(new Set(rows.map((row) => row.week))).sort(
      (a, b) => a - b,
    );
    return weeks.map((week) => ({ value: week, label: `Week ${week}` }));
  }, [rows]);

  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState<DayFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<"All" | TodoCategory>("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!weekOptions.length) {
      setActiveWeek(null);
      return;
    }
    if (activeWeek == null || !weekOptions.some((week) => week.value === activeWeek)) {
      setActiveWeek(weekOptions[0]?.value ?? null);
    }
  }, [activeWeek, weekOptions]);

  const weekItems = useMemo(
    () =>
      activeWeek == null
        ? []
        : rows.filter((item) => item.week === activeWeek),
    [activeWeek, rows],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return weekItems.filter((item) => {
      const matchesDay = activeDay === "All" || item.day === activeDay;
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesSearch =
        !query || item.title.toLowerCase().includes(query);

      return matchesDay && matchesCategory && matchesSearch;
    });
  }, [activeDay, categoryFilter, searchQuery, weekItems]);

  if (isLoading) {
    return (
      <section className="rounded-xl bg-[#F7F9FA] px-5 py-10 text-center text-sm text-[#64748B]">
        Loading todos...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-xl bg-[#F7F9FA] px-5 py-10 text-center">
        <p className="text-sm text-[#64748B]">
          Something went wrong while loading todos.
        </p>
        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-full bg-[#156374] px-5 text-sm font-medium text-white hover:bg-[#124F5D]"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <ProjectSummary project={project} />

      <div>
        <div className="flex items-end gap-6 overflow-x-auto border-b border-[#E2E8F0]">
          {weekOptions.length ? (
            weekOptions.map((week) => {
              const isActive = week.value === activeWeek;
              return (
                <button
                  key={week.value}
                  type="button"
                  onClick={() => setActiveWeek(week.value)}
                  className={cn(
                    "relative shrink-0 cursor-pointer pb-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#156374]"
                      : "text-[#BCD0D5] hover:text-[#78909C]",
                  )}
                >
                  {week.label}
                  {isActive ? (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#156374]" />
                  ) : null}
                </button>
              );
            })
          ) : (
            <p className="pb-2 text-sm text-[#94A3B8]">No weeks available</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {DAYS.map((day) => {
            const isActive = day === activeDay;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                className={cn(
                  "h-10 cursor-pointer rounded-md border text-sm font-medium transition",
                  isActive
                    ? "border-[#4E93A0] bg-[#4E93A0] text-white"
                    : "border-[#DCE5E9] bg-[#F8FAFC] text-[#78909C] hover:border-[#9DB8C0]",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Total todo" value={weekItems.length} />
          <SummaryCard
            label="All task"
            value={weekItems.filter((item) => item.category === "Task").length}
          />
          <SummaryCard
            label="All activity"
            value={weekItems.filter((item) => item.category === "Activity").length}
          />
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-[#173740]">Todo list</h3>

          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]"
                aria-hidden
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search todo"
                className="h-10 w-full rounded-xl border border-[#DCE5E9] bg-[#F8FAFC] pr-3 pl-9 text-sm text-[#173740] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl bg-[#D9E8EC] px-3 text-sm font-medium text-[#156374]"
              >
                <SlidersHorizontal className="size-4" aria-hidden />
                Filter
              </button>

              {showFilters ? (
                <div className="absolute top-12 right-0 z-20 w-36 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg">
                  {(["All", "Task", "Activity"] as const).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(category);
                        setShowFilters(false);
                      }}
                      className={cn(
                        "block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm",
                        categoryFilter === category
                          ? "bg-[#E8F0F3] font-medium text-[#156374]"
                          : "text-[#64748B] hover:bg-[#F8FAFC]",
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left">
            <thead>
              <tr className="text-xs font-semibold text-[#64748B]">
                <th className="px-3 py-3">TODO TITLE</th>
                <th className="px-3 py-3">DAY</th>
                <th className="px-3 py-3">Activity Type</th>
                <th className="px-3 py-3">CATEGORY</th>
                <th className="px-3 py-3 text-center">More</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length ? (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#F1F5F9] text-sm text-[#173740]"
                  >
                    <td className="px-3 py-4 font-medium">{item.title}</td>
                    <td className="px-3 py-4">{item.dayLabel}</td>
                    <td className="px-3 py-4">
                      <TypeCountLabel count={item.typeCount} />
                    </td>
                    <td className="px-3 py-4">{item.category}</td>
                    <td className="px-3 py-4 text-center">
                      {project.slug ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label={`Actions for ${item.title}`}
                              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#E8F0F3] text-[#156374] hover:bg-[#D9E8EC]"
                            >
                              <EllipsisVertical className="size-4" aria-hidden />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-full max-w-64 rounded-xl border-[#E2E8F0] p-1.5"
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/internship-program/projects/${encodeURIComponent(project.slug)}/classroom/${item.id}`}
                                className="cursor-pointer font-medium text-[#173740] focus:bg-[#E8F0F3] focus:text-[#156374]"
                              >
                                <Eye className="size-4" aria-hidden />
                                View in classroom
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-10 text-center text-sm text-[#94A3B8]"
                  >
                    No todos found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Todo;
