"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";

const EMERGING_DESCRIPTION =
  "Strengthens emerging professional judgment through denser delivery cycles, peer critique, and outcome-focused iteration.";

const EmergingStage = () => {
  return (
    <CareerStageSchedule
      careerStage={InternProjectCareerStage.Emerging}
      description={EMERGING_DESCRIPTION}
      tone="locked"
    />
  );
};

export default EmergingStage;
