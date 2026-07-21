"use client";

import StageProjectSchedule, {
  type WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";

const EMERGING_DESCRIPTION =
  "Strengthens emerging professional judgment through denser delivery cycles, peer critique, and outcome-focused iteration.";

const PROJECT_TITLE =
  "Launching a Self-Serve Insights Portal for Operations Teams";

const WEEK_SCHEDULES: WeekSchedule[] = [
  {
    id: "week-11",
    label: "Week 11",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "portal-requirements",
            label: "Finalize portal requirements with ops leads",
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
            id: "ia-design",
            label: "Design information architecture",
            status: "todo",
          },
          {
            id: "access-model",
            label: "Define role-based access model",
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
            id: "pilot-build",
            label: "Build pilot portal screens",
            status: "todo",
          },
        ],
      },
    ],
  },
  {
    id: "week-12",
    label: "Week 12",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "peer-review",
            label: "Run peer critique session",
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
            id: "iteration",
            label: "Iterate based on critique feedback",
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
            id: "pilot-handoff",
            label: "Prepare pilot handoff package",
            status: "todo",
          },
        ],
      },
    ],
  },
];

const EmergingStage = () => {
  return (
    <StageProjectSchedule
      description={EMERGING_DESCRIPTION}
      projectTitle={PROJECT_TITLE}
      weekRange="Week 11-12"
      weeks={WEEK_SCHEDULES}
      tone="locked"
    />
  );
};

export default EmergingStage;
