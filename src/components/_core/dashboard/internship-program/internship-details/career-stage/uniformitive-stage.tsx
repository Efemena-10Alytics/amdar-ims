"use client";

import StageProjectSchedule, {
  type WeekSchedule,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";

const UNIFORMITY_DESCRIPTION =
  "Establishes a consistent operational baseline by ensuring alignment in foundational knowledge, tools, and professional working standards.";

const PROJECT_TITLE =
  "Designing a Customer Service Ticketing Tracker for a Telecom Provider";

const WEEK_SCHEDULES: WeekSchedule[] = [
  {
    id: "week-1",
    label: "Week 1",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "completed",
        tasks: [
          {
            id: "download-materials",
            label: "Download materials & data set",
            status: "done",
            href: "#",
          },
        ],
      },
      {
        id: "tuesday",
        label: "Tuesday",
        status: "in-progress",
        tasks: [
          {
            id: "project-kickoff",
            label: "Project kickoff & requirements review",
            status: "done",
          },
          {
            id: "agile-tool",
            label: "How To Use Agile Project Management Tool",
            status: "active",
          },
          {
            id: "ticket-schema",
            label: "Draft ticket schema & workflow map",
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
            id: "dashboard-wireframe",
            label: "Create dashboard wireframes",
            status: "todo",
          },
          {
            id: "stakeholder-sync",
            label: "Stakeholder sync & feedback notes",
            status: "todo",
          },
        ],
      },
    ],
  },
  {
    id: "week-2",
    label: "Week 2",
    days: [
      {
        id: "monday",
        label: "Monday",
        status: "not-started",
        tasks: [
          {
            id: "build-tracker",
            label: "Build ticketing tracker prototype",
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
            id: "qa-pass",
            label: "QA pass & bug fixes",
            status: "todo",
          },
          {
            id: "demo-prep",
            label: "Prepare demo walkthrough",
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
            id: "final-submission",
            label: "Final submission & reflection",
            status: "todo",
          },
        ],
      },
    ],
  },
];

const UniformityStage = () => {
  return (
    <StageProjectSchedule
      description={UNIFORMITY_DESCRIPTION}
      projectTitle={PROJECT_TITLE}
      weekRange="Week 1-2"
      weeks={WEEK_SCHEDULES}
      tone="active"
    />
  );
};

export default UniformityStage;
