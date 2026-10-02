"use client";

import Link from "next/link";
import { Building2, CalendarDays, User } from "lucide-react";
import StageProjectSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useStageProjectScheduleData } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { formatDurationLabel } from "../project-content";
import type { InternProject } from "@/features/interns-project/internship-project.types";
import { useGetInternshipProgress } from "@/features/interns-project/use-get-internship-progress";

function buildCurrentTaskHref({
  projectSlug,
  todoId,
  typeId,
}: {
  projectSlug: string;
  todoId: number;
  typeId?: number | null;
}) {
  const base = `/dashboard/internship-program/projects/${encodeURIComponent(projectSlug)}/classroom/${todoId}`;
  return typeId != null ? `${base}?type=${typeId}` : base;
}

function ProjectSummary({
  project,
  continueHref,
}: {
  project: InternProject;
  continueHref?: string | null;
}) {
  const durationLabel = formatDurationLabel(project.duration);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#F7F9FA] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.logoPreview || "/favicon.svg"}
            alt={project.companyName || project.title}
            className="mt-1 size-5 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 space-y-3">
            <h2 className="text-xl leading-snug font-semibold text-[#34445E] sm:text-2xl">
              {project.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {project.industry ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#78909C]">
                  <Building2 className="size-3.5" aria-hidden />
                  {project.industry}
                </span>
              ) : null}
              {durationLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#78909C]">
                  <CalendarDays className="size-3.5" aria-hidden />
                  {durationLabel}
                </span>
              ) : null}
              {project.companyName ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#78909C]">
                  <User className="size-3.5" aria-hidden />
                  {project.companyName} contributor
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {continueHref ? (
          <Link
            href={continueHref}
            className="inline-flex mt-5 h-11 w-full max-w-[14.5rem] cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-6 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
          >
            Continue task
          </Link>
        ) : null}
      </div>

    </div>
  );
}

type TodoProps = {
  project: InternProject;
};

const Todo = ({ project }: TodoProps) => {
  const {
    weekRange,
    weeks,
    projectHref,
    preAssessmentDone,
    isLoading,
    isError,
    isEmpty,
    refetch,
  } = useStageProjectScheduleData(project);

  const { currentTask, preAssessmentDone: progressPreDone } =
    useGetInternshipProgress();

  const projectSlug = project.slug?.trim() || currentTask?.projectSlug?.trim() || null;
  const continueHref =
    (preAssessmentDone || progressPreDone) &&
      currentTask &&
      currentTask.projectId === project.id &&
      projectSlug
      ? buildCurrentTaskHref({
        projectSlug,
        todoId: currentTask.todoId,
        typeId: currentTask.type?.id,
      })
      : projectHref ?? null;

  return (
    <section className="space-y-6">
      <ProjectSummary project={project} continueHref={continueHref} />

      {isLoading ? (
        <div className="rounded-xl border border-[#86E9AA] bg-[#EDFCF2] px-5 py-10 text-center text-sm text-[#64748B]">
          Loading project schedule...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-[#86E9AA] bg-[#EDFCF2] px-5 py-10 text-center">
          <p className="text-sm text-[#64748B]">
            Something went wrong while loading this project schedule.
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
        </div>
      ) : isEmpty || !weeks.length ? (
        <div className="rounded-xl border border-[#86E9AA] bg-[#EDFCF2] px-5 py-10 text-center text-sm text-[#64748B]">
          No schedule is available for this project yet.
        </div>
      ) : (
        <StageProjectSchedule
          projectTitle="Project task"
          weekRange={weekRange}
          weeks={weeks}
          tone="active"
          projectHref={projectHref}
          continueHref={undefined}
          defaultOpen
          standalone
          showProgress
        />
      )}
    </section>
  );
};

export default Todo;
