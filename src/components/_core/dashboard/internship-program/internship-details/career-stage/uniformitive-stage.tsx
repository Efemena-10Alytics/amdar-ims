"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";

const UNIFORMITY_DESCRIPTION =
  "Establishes a consistent operational baseline by ensuring alignment in foundational knowledge, tools, and professional working standards.";

const UniformityStage = () => {
  return (
    <CareerStageSchedule
      careerStage={InternProjectCareerStage.Uniformity}
      description={UNIFORMITY_DESCRIPTION}
      tone="active"
    />
  );
};

export default UniformityStage;
