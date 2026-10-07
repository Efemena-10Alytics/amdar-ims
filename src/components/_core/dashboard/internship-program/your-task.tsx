"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarDays, FileSpreadsheet, User } from "lucide-react";
import {
  formatCareerStageLabel,
  formatDurationLabel,
} from "@/components/_core/dashboard/internship-program/project-details/project-content";
import { useGetCurrentProject } from "@/features/interns-project/use-get-current-project";
import { useGetInternshipProgress } from "@/features/interns-project/use-get-internship-progress";

type YourTaskProps = {
  imageSrc?: string;
};

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

function buildProjectHref(slug?: string | null) {
  const trimmed = slug?.trim();
  if (!trimmed) return null;
  return `/dashboard/internship-program/projects/${encodeURIComponent(trimmed)}`;
}

function getInitial(name?: string | null) {
  const trimmed = name?.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

const YourTask = ({
  imageSrc = "/images/svgs/illustration/Smug 2.svg",
}: YourTaskProps) => {
  const currentProjectQuery = useGetCurrentProject();
  const {
    currentTask,
    preAssessmentDone,
    isLoading: isProgressLoading,
  } = useGetInternshipProgress();

  const current = currentProjectQuery.data;
  const project = current?.project;
  const isProjectLoading = currentProjectQuery.isLoading;
  const isLoading = isProjectLoading || isProgressLoading;

  const projectSlug =
    project?.slug?.trim() || currentTask?.projectSlug?.trim() || null;
  const projectHref = buildProjectHref(projectSlug);
  const taskHref =
    currentTask && projectSlug
      ? buildCurrentTaskHref({
        projectSlug,
        todoId: currentTask.todoId,
        typeId: currentTask.type?.id,
      })
      : null;

  if (!isLoading && !project && !currentTask) {
    return null;
  }

  const stageTitle = formatCareerStageLabel(project?.careerStage ?? "");
  const rawDuration =
    formatDurationLabel(project?.duration) ?? project?.duration;
  const durationLabel = rawDuration
    ? /duration/i.test(rawDuration)
      ? rawDuration
      : `${rawDuration} duration`
    : null;
  const logoSrc = project?.logoPreview || "/favicon.svg";
  const displayTitle =
    project?.title?.trim() ||
    currentTask?.todoTitle?.trim() ||
    (isLoading ? "Loading..." : "Current task");
  const startLabel = preAssessmentDone ? "Continue task" : "Start task";

  return (
    <section className="space-y-0">
      {/* Current task */}
      <div className="rounded-t-2xl border border-[#F3D5A3] bg-[#F9E7C7] px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt=""
                className="mt-1 size-5 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <h3 className="min-w-0 flex-1 text-[22px] leading-tight font-semibold text-[#233A43] lg:text-[28px] lg:leading-9">
                    {displayTitle}
                  </h3>

                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {project?.industry ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
                  <Building2 className="size-3.5" aria-hidden />
                  {project.industry}
                </span>
              ) : null}
              {durationLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
                  <CalendarDays className="size-3.5" aria-hidden />
                  {durationLabel}
                </span>
              ) : null}

            </div>

            {taskHref ? (
              <Link
                href={taskHref}
                className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-6 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
              >
                {startLabel}
              </Link>
            ) : null}
          </div>

          <div className="hidden shrink-0 self-end sm:block">
            <Image
              src={imageSrc}
              alt={`${stageTitle || "Stage"} buddy`}
              width={120}
              height={140}
              className="h-auto w-24 object-contain lg:w-28"
            />
          </div>
        </div>
      </div>

      {/* Current project — attached below, outside the amber card */}
      <div className="rounded-b-2xl border border-dashed border-[#3B82F6] bg-[#C2D8FC] px-5 py-4 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="size-2 animate-pulse rounded-full bg-[#E11D48]"
            aria-hidden
          />
          <p className="text-sm font-medium text-[#173740]">
            See where others are
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt=""
              className="size-5 shrink-0 rounded-full object-cover"
            />
            <p className="min-w-0 truncate text-sm font-semibold text-[#233A43] sm:text-base">
              {displayTitle}
            </p>
          </div>

          {projectHref ? (
            <Link
              href={projectHref}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#3B82F6] bg-[#A5C6FB] px-4 text-sm font-semibold text-[#3B82F6] transition hover:bg-[#94BBFA]"
            >
              <FileSpreadsheet className="size-4" aria-hidden />
              See project
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default YourTask;
