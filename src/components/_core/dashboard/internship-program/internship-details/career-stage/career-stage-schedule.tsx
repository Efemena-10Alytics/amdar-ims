"use client";

import StageProjectSchedule, {
  type StageProjectScheduleTone,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useStageProjectScheduleData } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import type { InternProject } from "@/features/interns-project/internship-project.types";

function StageStateMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border-t border-[#C8E6D0] px-3 py-6 sm:px-4">
      <p className="text-sm text-[#64748B]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex h-9 cursor-pointer items-center rounded-full bg-[#156374] px-4 text-sm font-medium text-white hover:bg-[#124F5D]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

function SingleProjectSchedule({
  description,
  tone,
  project,
  showDescription,
  defaultOpen,
}: {
  description: string;
  tone: StageProjectScheduleTone;
  project: InternProject;
  showDescription: boolean;
  defaultOpen: boolean;
}) {
  const {
    projectTitle,
    weekRange,
    weeks,
    projectHref,
    isLoading,
    isError,
    isEmpty,
    refetch,
  } = useStageProjectScheduleData(project);

  if (isLoading) {
    return <StageStateMessage message="Loading project schedule..." />;
  }

  if (isError) {
    return (
      <StageStateMessage
        message="Something went wrong while loading this project schedule."
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (isEmpty || !projectTitle || !weeks.length) {
    return (
      <StageStateMessage message="No schedule is available for this project yet." />
    );
  }

  return (
    <StageProjectSchedule
      description={showDescription ? description : undefined}
      projectTitle={projectTitle}
      weekRange={weekRange}
      weeks={weeks}
      tone={tone}
      projectHref={projectHref}
      defaultOpen={defaultOpen}
    />
  );
}

type CareerStageScheduleProps = {
  description: string;
  tone: StageProjectScheduleTone;
  projects: InternProject[];
  isProjectsLoading?: boolean;
  isProjectsError?: boolean;
  onRetryProjects?: () => void;
};

export default function CareerStageSchedule({
  description,
  tone,
  projects,
  isProjectsLoading = false,
  isProjectsError = false,
  onRetryProjects,
}: CareerStageScheduleProps) {
  if (isProjectsLoading) {
    return <StageStateMessage message="Loading project schedule..." />;
  }

  if (isProjectsError) {
    return (
      <StageStateMessage
        message="Something went wrong while loading this stage."
        onRetry={onRetryProjects}
      />
    );
  }

  if (!projects.length) {
    return (
      <StageStateMessage message="No published project is available for this stage yet." />
    );
  }

  const sortedProjects = [...projects].sort((a, b) => {
    const aCurrent = a.isCurrent ? 1 : 0;
    const bCurrent = b.isCurrent ? 1 : 0;
    return bCurrent - aCurrent;
  });
  const hasCurrentProject = sortedProjects.some((project) => project.isCurrent);

  return (
    <div className="space-y-3">
      {sortedProjects.map((project, index) => (
        <SingleProjectSchedule
          key={project.id}
          description={description}
          tone={tone}
          project={project}
          showDescription={index === 0}
          defaultOpen={
            hasCurrentProject ? Boolean(project.isCurrent) : index === 0
          }
        />
      ))}
    </div>
  );
}
