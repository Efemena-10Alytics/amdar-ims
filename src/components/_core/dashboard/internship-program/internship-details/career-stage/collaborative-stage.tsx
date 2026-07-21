"use client";

import StageProjectSchedule, {
  type WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";

const COLLABORATIVE_DESCRIPTION =
  "Develops collaborative delivery habits across shared ownership, communication rituals, and cross-functional execution.";

const PROJECT_TITLE =
  "Coordinating a Cross-Functional Product Launch Dashboard";

const WEEK_SCHEDULES: WeekSchedule[] = [
  {
    id: "week-13",
    label: "Week 13",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "team-kickoff",
            label: "Facilitate cross-functional kickoff",
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
            id: "shared-board",
            label: "Set up shared delivery board",
            status: "todo",
          },
          {
            id: "raci",
            label: "Agree RACI across workstreams",
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
            id: "sync-cadence",
            label: "Establish sync cadence and updates",
            status: "todo",
          },
        ],
      },
    ],
  },
  {
    id: "week-14",
    label: "Week 14",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "integration",
            label: "Integrate team deliverables into dashboard",
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
            id: "blocker-review",
            label: "Resolve cross-team blockers",
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
            id: "launch-readiness",
            label: "Complete launch readiness checklist",
            status: "todo",
          },
        ],
      },
    ],
  },
];

const CollaborativeStage = () => {
  return (
    <StageProjectSchedule
      description={COLLABORATIVE_DESCRIPTION}
      projectTitle={PROJECT_TITLE}
      weekRange="Week 13-14"
      weeks={WEEK_SCHEDULES}
      tone="locked"
    />
  );
};

export default CollaborativeStage;
