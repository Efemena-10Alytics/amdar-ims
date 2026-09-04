"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import type { StageProjectScheduleTone } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useEnrollmentCohortProgramIds } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";
import { useGetProjectByStage } from "@/features/interns-project/use-get-project-by-stage";

const UNIFORMITY_DESCRIPTION =
  "Establishes a consistent operational baseline by ensuring alignment in foundational knowledge, tools, and professional working standards.";

type UniformityStageProps = {
  tone?: StageProjectScheduleTone;
};

const UniformityStage = ({ tone = "active" }: UniformityStageProps) => {
  const { cohortId, programId, isLoading, isError, refetch } =
    useEnrollmentCohortProgramIds();
  const projectsQuery = useGetProjectByStage({
    cohortId: cohortId ?? undefined,
    programId: programId ?? undefined,
    careerStage: InternProjectCareerStage.Uniformity,
  });

  return (
    <CareerStageSchedule
      description={UNIFORMITY_DESCRIPTION}
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

export default UniformityStage;
