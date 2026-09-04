"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import type { StageProjectScheduleTone } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useEnrollmentCohortProgramIds } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";
import { useGetProjectByStage } from "@/features/interns-project/use-get-project-by-stage";

const TRANSITIONAL_DESCRIPTION =
  "Transitions learners from guided execution to independent ownership of project outcomes and decision-making.";

type TransitionalStageProps = {
  tone?: StageProjectScheduleTone;
};

const TransitionalStage = ({ tone = "locked" }: TransitionalStageProps) => {
  const { cohortId, programId, isLoading, isError, refetch } =
    useEnrollmentCohortProgramIds();
  const projectsQuery = useGetProjectByStage({
    cohortId: cohortId ?? undefined,
    programId: programId ?? undefined,
    careerStage: InternProjectCareerStage.Transitional,
  });

  return (
    <CareerStageSchedule
      description={TRANSITIONAL_DESCRIPTION}
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

export default TransitionalStage;
