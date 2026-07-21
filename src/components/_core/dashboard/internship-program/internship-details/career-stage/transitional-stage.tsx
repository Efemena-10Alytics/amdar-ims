"use client";

import StageProjectSchedule, {
  type WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";

const TRANSITIONAL_DESCRIPTION =
  "Transitions learners from guided execution to independent ownership of project outcomes and decision-making.";

const PROJECT_TITLE =
  "Optimizing Customer Churn Prediction for a Subscription Platform";

const WEEK_SCHEDULES: WeekSchedule[] = [
  {
    id: "week-7",
    label: "Week 7",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "scope-handoff",
            label: "Confirm scope and ownership handoff",
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
            id: "feature-plan",
            label: "Define feature plan and delivery milestones",
            status: "todo",
          },
          {
            id: "risk-log",
            label: "Create risk and dependency log",
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
            id: "baseline-model",
            label: "Build baseline churn model",
            status: "todo",
          },
        ],
      },
    ],
  },
  {
    id: "week-8",
    label: "Week 8",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "model-tuning",
            label: "Tune model and validate performance",
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
            id: "stakeholder-update",
            label: "Share stakeholder progress update",
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
            id: "decision-doc",
            label: "Document key product decisions",
            status: "todo",
          },
        ],
      },
    ],
  },
];

const TransitionalStage = () => {
  return (
    <StageProjectSchedule
      description={TRANSITIONAL_DESCRIPTION}
      projectTitle={PROJECT_TITLE}
      weekRange="Week 7-10"
      weeks={WEEK_SCHEDULES}
      tone="locked"
    />
  );
};

export default TransitionalStage;
