"use client";

import StageProjectSchedule, {
  type WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";

const PROFESSIONAL_DESCRIPTION =
  "Consolidates professional readiness through polished delivery, stakeholder communication, and portfolio-grade outcomes.";

const PROJECT_TITLE =
  "Delivering an Executive-Ready Performance Insights Brief";

const WEEK_SCHEDULES: WeekSchedule[] = [
  {
    id: "week-15",
    label: "Week 15",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "executive-outline",
            label: "Draft executive insights outline",
            status: "todo",
          },
        ],
      },
      {
        id: "tuesday",
        label: "Tuesday",
        status: "not-started",
        tasks: [
          {
            id: "visual-polish",
            label: "Polish visuals for executive readability",
            status: "todo",
          },
          {
            id: "narrative",
            label: "Refine recommendation narrative",
            status: "todo",
          },
        ],
      },
      {
        id: "wednesday",
        label: "Wednesday",
        status: "not-started",
        tasks: [
          {
            id: "dry-run",
            label: "Run stakeholder presentation dry run",
            status: "todo",
          },
        ],
      },
    ],
  },
  {
    id: "week-16",
    label: "Week 16",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "final-deck",
            label: "Finalize presentation deck",
            status: "todo",
          },
        ],
      },
      {
        id: "tuesday",
        label: "Tuesday",
        status: "not-started",
        tasks: [
          {
            id: "portfolio-pack",
            label: "Package portfolio-ready artifacts",
            status: "todo",
          },
        ],
      },
      {
        id: "wednesday",
        label: "Wednesday",
        status: "not-started",
        tasks: [
          {
            id: "capstone-submit",
            label: "Submit professional stage capstone",
            status: "todo",
          },
        ],
      },
    ],
  },
];

const ProfessionalStage = () => {
  return (
    <StageProjectSchedule
      description={PROFESSIONAL_DESCRIPTION}
      projectTitle={PROJECT_TITLE}
      weekRange="Week 15-16"
      weeks={WEEK_SCHEDULES}
      tone="locked"
    />
  );
};

export default ProfessionalStage;
