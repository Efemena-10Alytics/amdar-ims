"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import type { StageProjectScheduleTone } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useEnrollmentCohortProgramIds } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";
import { useGetProjectByStage } from "@/features/interns-project/use-get-project-by-stage";

const COLLABORATIVE_DESCRIPTION =
  "Develops collaborative delivery habits across shared ownership, communication rituals, and cross-functional execution.";

type CollaborativeStageProps = {
  tone?: StageProjectScheduleTone;
};

const CollaborativeStage = ({ tone = "locked" }: CollaborativeStageProps) => {
  const { cohortId, programId, isLoading, isError, refetch } =
    useEnrollmentCohortProgramIds();
  const projectsQuery = useGetProjectByStage({
    cohortId: cohortId ?? undefined,
    programId: programId ?? undefined,
    careerStage: InternProjectCareerStage.Collaborative,
  });

  return (
    <CareerStageSchedule
      description={COLLABORATIVE_DESCRIPTION}
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

export default CollaborativeStage;
