"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  EllipsisVertical,
  Eye,
  FileText,
  ListChecks,
  Search,
  SlidersHorizontal,
  Type,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKS = ["Week 1", "Week 2", "Week 3"] as const;
const DAYS = ["All", "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"] as const;

type TodoCategory = "Task" | "Activity";
type TodoType = "Text" | "Document";

type TodoItem = {
  id: number;
  title: string;
  week: (typeof WEEKS)[number];
  day: Exclude<(typeof DAYS)[number], "All">;
  type: TodoType;
  category: TodoCategory;
};

const TODO_ITEMS: TodoItem[] = [
  { id: 1, title: "Brand research moodboard", week: "Week 1", day: "Mon", type: "Text", category: "Task" },
  { id: 2, title: "Brand research moodboard", week: "Week 1", day: "Mon", type: "Document", category: "Activity" },
  { id: 3, title: "Brand research moodboard", week: "Week 1", day: "Tue", type: "Text", category: "Activity" },
  { id: 4, title: "Review customer interview notes", week: "Week 1", day: "Wed", type: "Document", category: "Task" },
  { id: 5, title: "Draft dashboard requirements", week: "Week 1", day: "Thur", type: "Text", category: "Task" },
  { id: 6, title: "Prepare stakeholder update", week: "Week 1", day: "Fri", type: "Document", category: "Task" },
  { id: 7, title: "Map ticket resolution workflow", week: "Week 1", day: "Sat", type: "Text", category: "Task" },
  { id: 8, title: "Analyze support ticket data", week: "Week 1", day: "Sun", type: "Document", category: "Activity" },
  { id: 9, title: "Create initial report outline", week: "Week 1", day: "Tue", type: "Text", category: "Task" },
  { id: 10, title: "Build dashboard wireframe", week: "Week 2", day: "Mon", type: "Document", category: "Task" },
  { id: 11, title: "Review mentor feedback", week: "Week 3", day: "Wed", type: "Text", category: "Activity" },
];

const DAY_LABELS: Record<Exclude<(typeof DAYS)[number], "All">, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thur: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

function ProjectSummary() {
  return (
    <>
      <div className="rounded-xl bg-[#F7F9FA] px-5 py-4 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#4285F4]">
            G
          </span>
          <h2 className="max-w-3xl text-xl leading-tight font-semibold text-[#34445E] sm:text-2xl">
            Tenant Retention Optimization: Building an Interactive Power BI
            Dashboard for...
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
          <Building2 className="size-3.5" aria-hidden />
          Healthcare
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
          <CalendarDays className="size-3.5" aria-hidden />
          3 weeks duration
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
          <User className="size-3.5" aria-hidden />
          Jennifer Okeke contributor
        </span>
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

function TypeLabel({ type }: { type: TodoType }) {
  const Icon = type === "Document" ? FileText : Type;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex size-5 items-center justify-center rounded-full bg-[#EEF2F6] text-[#78909C]">
        <Icon className="size-3" aria-hidden />
      </span>
      {type}
    </span>
  );
}

const Todo = () => {
  const [activeWeek, setActiveWeek] =
    useState<(typeof WEEKS)[number]>("Week 1");
  const [activeDay, setActiveDay] =
    useState<(typeof DAYS)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<"All" | TodoCategory>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [openActionId, setOpenActionId] = useState<number | null>(null);

  const weekItems = TODO_ITEMS.filter((item) => item.week === activeWeek);
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return TODO_ITEMS.filter((item) => {
      const matchesWeek = item.week === activeWeek;
      const matchesDay = activeDay === "All" || item.day === activeDay;
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesSearch =
        !query || item.title.toLowerCase().includes(query);

      return matchesWeek && matchesDay && matchesCategory && matchesSearch;
    });
  }, [activeDay, activeWeek, categoryFilter, searchQuery]);

  return (
    <section className="space-y-6">
      <ProjectSummary />

      <div>
        <div className="flex items-end gap-6 border-b border-[#E2E8F0]">
          {WEEKS.map((week) => {
            const isActive = week === activeWeek;
            return (
              <button
                key={week}
                type="button"
                onClick={() => setActiveWeek(week)}
                className={cn(
                  "relative cursor-pointer pb-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#156374]"
                    : "text-[#BCD0D5] hover:text-[#78909C]",
                )}
              >
                {week}
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#156374]" />
                ) : null}
              </button>
            );
          })}
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
                <th className="px-3 py-3">TYPE</th>
                <th className="px-3 py-3">CATEGORY</th>
                <th className="px-3 py-3 text-center">ACTIONS</th>
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
                    <td className="px-3 py-4">{DAY_LABELS[item.day]}</td>
                    <td className="px-3 py-4">
                      <TypeLabel type={item.type} />
                    </td>
                    <td className="px-3 py-4">{item.category}</td>
                    <td className="relative px-3 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionId((current) =>
                            current === item.id ? null : item.id,
                          )
                        }
                        aria-label={`Actions for ${item.title}`}
                        aria-expanded={openActionId === item.id}
                        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#E8F0F3] text-[#156374] hover:bg-[#D9E8EC]"
                      >
                        <EllipsisVertical className="size-4" aria-hidden />
                      </button>

                      {openActionId === item.id ? (
                        <div className="absolute top-12 right-3 z-20 w-44 rounded-xl border border-[#E2E8F0] bg-white p-1.5 text-left shadow-lg">
                          <Link
                            href="/dashboard/internship-program-5173/classroom/id"
                            onClick={() => setOpenActionId(null)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#173740] transition-colors hover:bg-[#E8F0F3] hover:text-[#156374]"
                          >
                            <Eye className="size-4" aria-hidden />
                            View in classroom
                          </Link>
                        </div>
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
