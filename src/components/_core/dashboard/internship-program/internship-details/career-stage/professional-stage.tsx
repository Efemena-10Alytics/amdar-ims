"use client";

import CareerStageSchedule from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-schedule";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";

const PROFESSIONAL_DESCRIPTION =
  "Consolidates professional readiness through polished delivery, stakeholder communication, and portfolio-grade outcomes.";

const ProfessionalStage = () => {
  return (
    <CareerStageSchedule
      careerStage={InternProjectCareerStage.Professional}
      description={PROFESSIONAL_DESCRIPTION}
      tone="locked"
    />
  );
};

export default ProfessionalStage;
