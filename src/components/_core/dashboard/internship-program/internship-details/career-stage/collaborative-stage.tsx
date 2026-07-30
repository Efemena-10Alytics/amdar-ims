"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";

const COLLABORATIVE_DESCRIPTION =
  "Develops collaborative delivery habits across shared ownership, communication rituals, and cross-functional execution.";

const CollaborativeStage = () => {
  return (
    <CareerStageSchedule
      careerStage={InternProjectCareerStage.Collaborative}
      description={COLLABORATIVE_DESCRIPTION}
      tone="locked"
    />
  );
};

export default CollaborativeStage;
