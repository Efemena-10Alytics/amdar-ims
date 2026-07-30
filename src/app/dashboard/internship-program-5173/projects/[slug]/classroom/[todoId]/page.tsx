"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Lightbulb,
  LoaderCircle,
  Play,
} from "lucide-react";
import { formatCareerStageLabel, RichTextContent } from "@/components/_core/dashboard/internship-program/project-details/project-content";
import SubmitTodoDrawer from "@/components/_core/dashboard/internship-program/project-details/classroom/submit-todo-drawer";
import type { InternProjectTodo } from "@/features/interns-project/internship-project.types";
import { useGetMyTodoSubmission } from "@/features/interns-project/use-get-my-todo-submission";
import { useGetProjectBySlug } from "@/features/interns-project/use-get-project-by-slug";
import { useGetTodoById } from "@/features/interns-project/use-get-todo-by-id";
import { useGetTodosByProjectId } from "@/features/interns-project/use-get-todos-by-project-id";
import { cn } from "@/lib/utils";

type TaskStatus = "done" | "active" | "todo";

function capitalizeDay(day?: string | null) {
  const value = day?.trim();
  if (!value) return "Untitled";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function TaskIcon({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return <Check className="size-3.5 text-[#24875B]" strokeWidth={2.5} />;
  }

  if (status === "active") {
    return <LoaderCircle className="size-3.5 animate-spin text-[#4D9DAA]" />;
  }

  return <Circle className="size-3.5 text-[#AFC0C5]" />;
}

function ClassroomHeader({
  backHref,
  careerStage,
  weekLabel,
}: {
  backHref: string;
  careerStage?: string | null;
  weekLabel?: string | null;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-base font-semibold text-[#173740]"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-[#EDF1F2] text-[#94A3B8]">
          <ArrowLeft className="size-4" />
        </span>
        Classroom
      </Link>

      <div className="flex items-center gap-1">
        {careerStage ? (
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#C9F2D7] px-3 text-xs font-medium text-[#286344]">
            <CircleDot className="size-4" />
            {formatCareerStageLabel(careerStage)}
          </span>
        ) : null}
        {weekLabel ? (
          <span className="inline-flex h-8 items-center rounded-full bg-[#C9F2D7] px-3 text-xs font-medium text-[#286344]">
            • {weekLabel}
          </span>
        ) : null}
      </div>
    </header>
  );
}

function resolveTodoSubmissionId(todo: InternProjectTodo): number | null {
  if (typeof todo.submissionId === "number") return todo.submissionId;
  if (typeof todo.latestSubmission?.id === "number") {
    return todo.latestSubmission.id;
  }
  if (typeof todo.submission?.id === "number") return todo.submission.id;
  if (Array.isArray(todo.submissions) && typeof todo.submissions[0]?.id === "number") {
    return todo.submissions[0].id;
  }
  return null;
}

function LessonPanel({
  todo,
  careerStage,
  projectId,
}: {
  todo: InternProjectTodo;
  careerStage?: string | null;
  projectId: number;
}) {
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const { data: mySubmission = null } = useGetMyTodoSubmission(
    projectId,
    todo.id,
  );
  const hasSubmittedSolution = Boolean(mySubmission?.id);
  const sortedTypes = [...(todo.types ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const videoType = sortedTypes.find(
    (type) => type.contentType === "video" && type.videoUrl,
  );
  const submissionType =
    sortedTypes.find((type) => type.submissionRequired) ?? sortedTypes[0];
  const solutionFormats = submissionType?.solutionFormat ?? null;
  const submissionId = resolveTodoSubmissionId(todo);

  return (
    <div className="space-y-2">
      <section className="overflow-hidden rounded-xl bg-[#F6F9FA]">
        <button
          type="button"
          onClick={() => setIsOverviewOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-[#DCE6E9] px-4 py-3 text-left"
        >
          <h1 className="text-lg font-medium text-[#123F49]">{todo.title}</h1>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#A8CED5] text-[#156374]">
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                !isOverviewOpen && "-rotate-90",
              )}
            />
          </span>
        </button>

        {isOverviewOpen ? (
          <div className="px-4 py-3">
            <RichTextContent
              value={todo.description}
              className="max-w-3xl text-sm text-[#6F8196]"
            />

            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-48 flex-1">
                <p className="mb-1 text-sm font-medium text-[#173740]">
                  Week {todo.week} · {capitalizeDay(todo.dayOfWeek)}
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#9DE5B8]">
                  <div className="h-full w-[7%] rounded-full bg-[#24875B]" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitOpen(true)}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#FFE49A] px-4 text-sm font-medium text-[#7C5A16] hover:bg-[#FFDC7A]"
              >
                <Lightbulb className="size-4 fill-current" />
                {hasSubmittedSolution
                  ? "View Solution"
                  : "Submit your solution"}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-[#DCE6E9] bg-[#F8FAFB] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[#173740]">
          Watch video
        </h2>

        <div className="group relative aspect-video min-h-72 overflow-hidden rounded-xl bg-[#142A2F]">
          <Image
            src="/images/pngs/about/about-img-video.png"
            alt={todo.title}
            fill
            priority
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/10" />
          {videoType?.videoUrl ? (
            <a
              href={videoType.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-5 left-5 inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-white"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#22869A] ring-4 ring-[#22869A]/35 transition-transform group-hover:scale-105">
                <Play className="ml-0.5 size-4 fill-white" />
              </span>
              Play to watch
            </a>
          ) : (
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-3 text-sm font-medium text-white/80">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#22869A]/70">
                <Play className="ml-0.5 size-4 fill-white" />
              </span>
              No video available
            </span>
          )}
        </div>
      </section>

      <SubmitTodoDrawer
        open={isSubmitOpen}
        onOpenChange={setIsSubmitOpen}
        careerStage={careerStage}
        solutionFormats={solutionFormats}
        projectId={projectId}
        todoId={todo.id}
        submissionId={submissionId}
      />
    </div>
  );
}

function ProjectTodoPanel({
  slug,
  todos,
  activeTodoId,
}: {
  slug: string;
  todos: InternProjectTodo[];
  activeTodoId: string;
}) {
  const weekOptions = useMemo(() => {
    const weeks = Array.from(new Set(todos.map((todo) => todo.week))).sort(
      (a, b) => a - b,
    );
    return weeks;
  }, [todos]);

  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState("");

  useEffect(() => {
    if (!weekOptions.length) {
      setActiveWeek(null);
      return;
    }
    if (activeWeek == null || !weekOptions.includes(activeWeek)) {
      setActiveWeek(weekOptions[0] ?? null);
    }
  }, [activeWeek, weekOptions]);

  const weekTodos = useMemo(
    () =>
      activeWeek == null
        ? []
        : todos
            .filter((todo) => todo.week === activeWeek)
            .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    [activeWeek, todos],
  );

  const dayGroups = useMemo(() => {
    const map = new Map<string, InternProjectTodo[]>();
    for (const todo of weekTodos) {
      const day = capitalizeDay(todo.dayOfWeek);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(todo);
    }
    return Array.from(map.entries());
  }, [weekTodos]);

  useEffect(() => {
    if (!dayGroups.length) {
      setOpenDay("");
      return;
    }
    const activeDay =
      dayGroups.find(([, items]) =>
        items.some((todo) => String(todo.id) === activeTodoId),
      )?.[0] ?? dayGroups[0]?.[0];
    setOpenDay(activeDay ?? "");
  }, [activeTodoId, dayGroups]);

  return (
    <aside className="sticky top-6 self-start rounded-xl border border-[#DCE6E9] bg-[#F8FAFB] p-3 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
      <div className="flex items-end gap-6 overflow-x-auto border-b border-[#DFE8EB]">
        {weekOptions.length ? (
          weekOptions.map((week) => (
            <button
              key={week}
              type="button"
              onClick={() => setActiveWeek(week)}
              className={cn(
                "relative shrink-0 cursor-pointer pb-2 text-sm font-medium",
                activeWeek === week ? "text-[#156374]" : "text-[#B6CFD4]",
              )}
            >
              Week {week}
              {activeWeek === week ? (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#156374]" />
              ) : null}
            </button>
          ))
        ) : (
          <p className="pb-2 text-sm text-[#94A3B8]">No weeks</p>
        )}
      </div>

      <div className="flex h-44 items-center justify-center">
        <Image
          src="/images/svgs/illustration/Super Excited 3.svg"
          alt="Classroom buddy"
          width={112}
          height={122}
          className="h-32 w-auto object-contain"
        />
      </div>

      <div className="rounded-xl bg-white p-3 shadow-[0_6px_24px_rgba(15,70,82,0.04)]">
        <h2 className="mb-3 text-sm font-medium text-[#34445E]">
          Project Todo
        </h2>

        <div className="space-y-2">
          {dayGroups.length ? (
            dayGroups.map(([dayName, items]) => {
              const isOpen = dayName === openDay;
              return (
                <div
                  key={dayName}
                  className="overflow-hidden rounded-md bg-[#E4EEF1]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDay((current) =>
                        current === dayName ? "" : dayName,
                      )
                    }
                    className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-xs font-medium text-[#315762]"
                  >
                    {dayName}
                    {isOpen ? (
                      <ChevronDown className="size-3.5 text-[#156374]" />
                    ) : (
                      <ChevronRight className="size-3.5 text-[#156374]" />
                    )}
                  </button>

                  {isOpen ? (
                    <div className="space-y-2 bg-[#F0F5F6] px-3 py-2.5">
                      {items.map((item) => {
                        const isActive = String(item.id) === activeTodoId;
                        return (
                          <Link
                            key={item.id}
                            href={`/dashboard/internship-program-5173/projects/${encodeURIComponent(slug)}/classroom/${item.id}`}
                            className="flex items-start gap-2 text-[11px] leading-4 text-[#667B8C]"
                          >
                            <TaskIcon status={isActive ? "active" : "todo"} />
                            <span
                              className={cn(
                                isActive &&
                                  "text-[#397886] underline underline-offset-2",
                              )}
                            >
                              {item.title}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <p className="px-2 py-3 text-xs text-[#94A3B8]">
              No todos for this week.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function ClassroomPage() {
  const params = useParams<{
    slug?: string | string[];
    todoId?: string | string[];
  }>();
  const slugParam = params?.slug;
  const todoIdParam = params?.todoId;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const todoId = Array.isArray(todoIdParam) ? todoIdParam[0] : todoIdParam;

  const projectQuery = useGetProjectBySlug(slug);
  const project = projectQuery.data;
  const todosQuery = useGetTodosByProjectId(project?.id);
  const todoQuery = useGetTodoById(project?.id, todoId);

  const backHref = slug
    ? `/dashboard/internship-program-5173/projects/${encodeURIComponent(slug)}`
    : "/dashboard/internship-program-5173";

  if (projectQuery.isLoading || todosQuery.isLoading || todoQuery.isLoading) {
    return (
      <main className="px-4 py-10 text-center text-sm text-[#64748B] lg:px-6">
        Loading classroom...
      </main>
    );
  }

  if (
    projectQuery.isError ||
    todosQuery.isError ||
    todoQuery.isError ||
    !project ||
    !todoQuery.data ||
    !slug ||
    !todoId
  ) {
    return (
      <main className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center lg:px-6">
        <p className="text-sm text-[#64748B]">
          Something went wrong while loading this classroom todo.
        </p>
        <Link
          href={backHref}
          className="inline-flex h-10 items-center rounded-full bg-[#156374] px-5 text-sm font-medium text-white hover:bg-[#124F5D]"
        >
          Back to project
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-5 px-4 py-6 lg:px-6">
      <ClassroomHeader
        backHref={backHref}
        careerStage={project.careerStage}
        weekLabel={`Week ${todoQuery.data.week}`}
      />
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <LessonPanel
          todo={todoQuery.data}
          careerStage={project.careerStage}
          projectId={project.id}
        />
        <ProjectTodoPanel
          slug={slug}
          todos={todosQuery.data ?? []}
          activeTodoId={todoId}
        />
      </div>
    </main>
  );
}
