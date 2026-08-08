"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User } from "lucide-react";
import {
  formatCareerStageLabel,
  formatDurationLabel,
} from "@/components/_core/dashboard/internship-program/project-details/project-content";
import { useGetCurrentProject } from "@/features/interns-project/use-get-current-project";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";

function pickId(value: unknown): number | string | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") return value;
  return null;
}

type YourTaskProps = {
  imageSrc?: string;
};

const YourTask = ({
  imageSrc = "/images/svgs/illustration/Smug 2.svg",
}: YourTaskProps) => {
  const enrollmentQuery = useGetUserEnrollment();
  const cohortId =
    pickId(enrollmentQuery.data?.cohort_id) ??
    pickId(enrollmentQuery.data?.cohort?.id);
  const programId =
    pickId(enrollmentQuery.data?.program_id) ??
    pickId(enrollmentQuery.data?.program?.id);

  const currentProjectQuery = useGetCurrentProject(cohortId, programId);
  const current = currentProjectQuery.data;
  const project = current?.project;
  const isLoading = enrollmentQuery.isLoading || currentProjectQuery.isLoading;

  if (!isLoading && !project) {
    return null;
  }

  const stageTitle = formatCareerStageLabel(project?.careerStage ?? "");
  const rawDuration = formatDurationLabel(project?.duration) ?? project?.duration;
  const durationLabel = rawDuration
    ? /duration/i.test(rawDuration)
      ? rawDuration
      : `${rawDuration} duration`
    : "—";
  const projectHref = project?.slug
    ? `/dashboard/internship-program/projects/${encodeURIComponent(project.slug)}`
    : null;
  const logoSrc =
    project?.logoPreview || "/favicon.svg";

  return (
    <section className="rounded-2xl border border-[#F3D5A3] bg-[#F9E7C7] px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt=""
              className="mt-1 size-5 shrink-0 rounded-full object-cover"
            />
            <h3 className="max-w-200 text-[22px] leading-9 font-semibold text-[#233A43] lg:text-[32px]">
              {isLoading ? "Loading project..." : project?.title}
            </h3>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {project?.industry ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
                {project.industry}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
              <CalendarDays className="size-3.5" />
              {isLoading ? "—" : durationLabel}
            </span>
            {project?.contributor ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
                <User className="size-3.5" />
                {project.contributor} contributor
              </span>
            ) : null}
          </div>

          {projectHref ? (
            <Link
              href={projectHref}
              className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
            >
              Continue project
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 inline-flex h-10 cursor-not-allowed items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white opacity-70"
            >
              Continue project
            </button>
          )}
        </div>

        <div className="hidden shrink-0 pr-20 sm:block">
          <Image
            src={imageSrc}
            alt={`${stageTitle || "Stage"} buddy`}
            width={92}
            height={108}
            className="h-auto w-23 object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default YourTask;
