"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import type { StageProjectScheduleTone } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useEnrollmentCohortProgramIds } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";
import { useGetProjectByStage } from "@/features/interns-project/use-get-project-by-stage";

const EMERGING_DESCRIPTION =
  "Strengthens emerging professional judgment through denser delivery cycles, peer critique, and outcome-focused iteration.";

type EmergingStageProps = {
  tone?: StageProjectScheduleTone;
};

const EmergingStage = ({ tone = "locked" }: EmergingStageProps) => {
  const { cohortId, programId, isLoading, isError, refetch } =
    useEnrollmentCohortProgramIds();
  const projectsQuery = useGetProjectByStage({
    cohortId: cohortId ?? undefined,
    programId: programId ?? undefined,
    careerStage: InternProjectCareerStage.Emerging,
  });

  return (
    <CareerStageSchedule
      description={EMERGING_DESCRIPTION}
      tone={tone}
      projects={projectsQuery.data ?? []}
      isProjectsLoading={isLoading || projectsQuery.isLoading}
      isProjectsError={isError || projectsQuery.isError}
      onRetryProjects={() => {
        void refetch();
        void projectsQuery.refetch();
      }}
    />
  );
};

export default EmergingStage;
