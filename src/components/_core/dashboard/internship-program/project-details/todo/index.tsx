"use client";

import { useMemo } from "react";
import StageProjectSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useStageProjectScheduleData } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { buildClassroomTaskHref } from "@/lib/utils/task-href";
import type { InternProject } from "@/features/interns-project/internship-project.types";
import { useGetInternshipProgress } from "@/features/interns-project/use-get-internship-progress";
import ProjectSummary from "./project-summary";

type TodoProps = {
  project: InternProject;
};

const Todo = ({ project }: TodoProps) => {
  const {
    weekRange,
    weeks,
    projectHref,
    firstTaskHref,
    isLoading,
    isError,
    isEmpty,
    refetch,
  } = useStageProjectScheduleData(project);

  const {
    data: enrollmentProgress,
    currentTask,
  } = useGetInternshipProgress();

  const stageProgress = useMemo(() => {
    const careerStage = project.careerStage?.trim().toLowerCase();
    if (!careerStage) return 0;

    const match = enrollmentProgress?.careerStages?.find(
      (stage) => stage.stage?.trim().toLowerCase() === careerStage,
    );

    const percent = match?.percent;
    if (typeof percent !== "number" || Number.isNaN(percent)) return 0;
    return Math.min(100, Math.max(0, Math.round(percent)));
  }, [enrollmentProgress?.careerStages, project.careerStage]);

  const projectSlug = project.slug?.trim() || null;
  const continueHref =
    currentTask && currentTask.projectId === project.id && projectSlug
      ? buildClassroomTaskHref({
          projectSlug,
          todoId: currentTask.todoId,
          typeId: currentTask.type?.id,
        })
      : (firstTaskHref ?? projectHref ?? null);

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
          firstTaskHref={firstTaskHref}
          continueHref={undefined}
          defaultOpen
          standalone
          showProgress
          progress={stageProgress}
        />
      )}
    </section>
  );
};

export default Todo;
