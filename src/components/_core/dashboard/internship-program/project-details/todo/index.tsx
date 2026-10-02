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

      {continueHref ? (
        <Link
          href={continueHref}
          className="inline-flex h-11 w-full max-w-56 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-6 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
        >
          Continue task
        </Link>
      ) : null}
    </>
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
        />
      )}
    </section>
  );
};

export default Todo;
