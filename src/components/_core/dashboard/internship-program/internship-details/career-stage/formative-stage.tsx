"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";

const FORMATIVE_DESCRIPTION =
  "Builds applied competence through structured project execution, guided practice, and progressive skill development.";

const FormativeStage = () => {
  return (
    <CareerStageSchedule
      careerStage={InternProjectCareerStage.Formative}
      description={FORMATIVE_DESCRIPTION}
      tone="upcoming"
    />
  );
};

export default FormativeStage;
