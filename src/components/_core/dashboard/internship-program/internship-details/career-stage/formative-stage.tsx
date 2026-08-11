"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import { useEnrollmentCohortProgramIds } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";
import { useGetProjectByStage } from "@/features/interns-project/use-get-project-by-stage";

const FORMATIVE_DESCRIPTION =
  "Builds applied competence through structured project execution, guided practice, and progressive skill development.";

const FormativeStage = () => {
  const { cohortId, programId, isLoading, isError, refetch } =
    useEnrollmentCohortProgramIds();
  const projectsQuery = useGetProjectByStage({
    cohortId: cohortId ?? undefined,
    programId: programId ?? undefined,
    careerStage: InternProjectCareerStage.Formative,
  });

  return (
    <CareerStageSchedule
      description={FORMATIVE_DESCRIPTION}
      tone="upcoming"
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

export default FormativeStage;
