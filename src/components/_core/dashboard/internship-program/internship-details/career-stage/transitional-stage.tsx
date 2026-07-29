"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";

const TRANSITIONAL_DESCRIPTION =
  "Transitions learners from guided execution to independent ownership of project outcomes and decision-making.";

const TransitionalStage = () => {
  return (
    <CareerStageSchedule
      careerStage={InternProjectCareerStage.Transitional}
      description={TRANSITIONAL_DESCRIPTION}
      tone="locked"
    />
  );
};

export default TransitionalStage;
