export interface Intern {
  id: string;
  name: string;
  email: string;
  submissions: string; // e.g. "4/4"
  time: string; // e.g. "22:01:56"
  date: string; // e.g. "12 May, 2026"
  avatarUrl?: string;
  active: boolean;
  uniformityStage: string; // e.g. "Week 8 of 16"
  stats: {
    completionRate: string;
    specialistRate: string;
    experienceRate: string;
    projectRate: string;
  };
}

export interface WeekReportRow {
  week: string; // "8th Week"
  avgRate: string; // "4.5"
  status: "Completed" | "Pending" | "Missed";
  time: string;
  dateSubmitted: string;
}

export const INTERNS: Intern[] = [
  {
    id: "1",
    name: "Ojay Adams",
    email: "jackson.graham@example.com",
    submissions: "4/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 8 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "2",
    name: "Esther Howard",
    email: "michelle.rivera@example.com",
    submissions: "3/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 6 of 16",
    stats: { completionRate: "75%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "3",
    name: "Cameron Williamson",
    email: "debra.holt@example.com",
    submissions: "3/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 5 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "4",
    name: "Cameron Williamson",
    email: "debra.holt@example.com",
    submissions: "1/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: false,
    uniformityStage: "Week 2 of 16",
    stats: { completionRate: "40%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "5",
    name: "Cameron Williamson",
    email: "debra.holt@example.com",
    submissions: "4/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 8 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "6",
    name: "Leslie Alexander",
    email: "deanna.curtis@example.com",
    submissions: "4/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 8 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "7",
    name: "Esther Howard",
    email: "michelle.rivera@example.com",
    submissions: "4/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 8 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "8",
    name: "Ronald Richards",
    email: "dolores.chambers@example.com",
    submissions: "4/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 8 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "9",
    name: "Esther Howard",
    email: "michelle.rivera@example.com",
    submissions: "4/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 8 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
  {
    id: "10",
    name: "Ronald Richards",
    email: "dolores.chambers@example.com",
    submissions: "4/4",
    time: "22:01:56",
    date: "12 May, 2026",
    active: true,
    uniformityStage: "Week 8 of 16",
    stats: { completionRate: "80%", specialistRate: "80%", experienceRate: "80%", projectRate: "80%" },
  },
];

export const WEEK_REPORT: WeekReportRow[] = [
  { week: "8th Week", avgRate: "4.5", status: "Completed", time: "22:01:56", dateSubmitted: "12 May, 2026" },
  { week: "7th Week", avgRate: "4.5", status: "Completed", time: "22:01:56", dateSubmitted: "12 May, 2026" },
  { week: "6th Week", avgRate: "4.5", status: "Completed", time: "22:01:56", dateSubmitted: "12 May, 2026" },
  { week: "3rd Week", avgRate: "4.5", status: "Completed", time: "22:01:56", dateSubmitted: "12 May, 2026" },
  { week: "2nd Week", avgRate: "4.5", status: "Completed", time: "22:01:56", dateSubmitted: "12 May, 2026" },
  { week: "1st Week", avgRate: "3.5", status: "Completed", time: "22:01:56", dateSubmitted: "12 May, 2026" },
];

export const WEEKS_IN_COHORT = [
  "Week 8",
  "Week 7",
  "Week 6",
  "Week 5",
  "Week 4",
  "Week 3",
  "Week 2",
  "Week 1",
];

export interface SurveyOption {
  id: string;
  label: string;
}

export interface SurveyQuestion {
  id: string;
  prompt: string;
  type: "single-select" | "yes-no-with-note";
  options: SurveyOption[];
}

export interface SurveyTab {
  id: string;
  label: string;
  avgTime: string;
  questions: SurveyQuestion[];
}

export const SURVEY_TABS: SurveyTab[] = [
  {
    id: "project",
    label: "Project",
    avgTime: "3mins",
    questions: [
      {
        id: "q1",
        prompt: "How is your project work going this week?",
        type: "single-select",
        options: [
          { id: "all-done", label: "All Done" },
          { id: "on-track", label: "On track" },
          { id: "slightly-behind", label: "Slightly behind" },
          { id: "behind-schedule", label: "Behind schedule" },
        ],
      },
      {
        id: "q2",
        prompt: "Did you encounter any blockers or challenges this week?",
        type: "yes-no-with-note",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "q3",
        prompt: "How clear were your tasks and expectations this week?",
        type: "single-select",
        options: [
          { id: "very-clear", label: "Very clear" },
          { id: "mostly-clear", label: "Mostly clear" },
          { id: "somewhat-clear", label: "Somewhat clear" },
          { id: "not-clear", label: "Not clear" },
        ],
      },
      {
        id: "q4",
        prompt: "How helpful was the drop in session this week",
        type: "single-select",
        options: [
          { id: "very-poor", label: "Very poor" },
          { id: "poor", label: "Poor" },
          { id: "average", label: "Average" },
          { id: "good", label: "Good" },
          { id: "excellent", label: "Excellent" },
        ],
      },
    ],
  },
  { id: "mentor", label: "Mentor", avgTime: "2mins", questions: [] },
  { id: "employability", label: "Employability", avgTime: "2mins", questions: [] },
  { id: "ims", label: "IMS", avgTime: "1min", questions: [] },
];