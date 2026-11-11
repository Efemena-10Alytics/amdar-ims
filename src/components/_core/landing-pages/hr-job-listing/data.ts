import type { ComponentType } from "react";
import {
  CommunityGrowthIcon,
  ContinuousLearningIcon,
  CustomerCenteredIcon,
  DiversityIcon,
  EmpowermentIcon,
  IntegrityIcon,
  PassionIcon,
  ResultsIcon,
} from "./svg";

export const ALL_DEPARTMENTS = "All Departments";

/** The chips above the grid, in design order. */
export const DEPARTMENTS = [
  ALL_DEPARTMENTS,
  "Growth & Sales Team",
  "Design & Engineering",
  "Data Team",
  "Product Team",
  "Cybersecurity Team",
] as const;

export type JobOpening = {
  id: string;
  department: string;
  title: string;
  vacancies: number;
  workHours: string;
  jobType: string;
  experience: string;
  deadline: string;
};

const WORK_HOURS = "Mon – Fri,  9 AM – 5 PM";

/**
 * Placeholder roles matching the Figma board. These are Amdari's own openings,
 * not the cvMatchly feed the /job-board page reads, so they stay static until
 * an HR endpoint exists.
 */
export const JOB_OPENINGS: JobOpening[] = [
  {
    id: "product-designer",
    department: "Design & Engineering",
    title: "Product Designer",
    vacancies: 1,
    workHours: WORK_HOURS,
    jobType: "Fully Remote",
    experience: "Intermediate",
    deadline: "31 Oct. 2026",
  },
  {
    id: "ui-ux-designer",
    department: "Design & Engineering",
    title: "UI/UX Designer",
    vacancies: 3,
    workHours: WORK_HOURS,
    jobType: "Hybrid",
    experience: "Senior",
    deadline: "31 Oct. 2026",
  },
  {
    id: "frontend-developer",
    department: "Design & Engineering",
    title: "Frontend  Developer",
    vacancies: 4,
    workHours: WORK_HOURS,
    jobType: "Onsite",
    experience: "Junior",
    deadline: "22 Oct. 2026",
  },
  {
    id: "backend-developer",
    department: "Design & Engineering",
    title: "Backend Developer",
    vacancies: 2,
    workHours: WORK_HOURS,
    jobType: "Fully Remote",
    experience: "Mid-Level",
    deadline: "20 Oct. 2026",
  },
  {
    id: "data-analyst",
    department: "Design & Engineering",
    title: "Data Analyst",
    vacancies: 2,
    workHours: WORK_HOURS,
    jobType: "Remote",
    experience: "Senior",
    deadline: "30 Nov. 2026",
  },
  {
    id: "product-manager",
    department: "Design & Engineering",
    title: "Product Manager",
    vacancies: 1,
    workHours: WORK_HOURS,
    jobType: "Hybrid",
    experience: "Experienced",
    deadline: "5 Dec. 2025",
  },
  {
    id: "backend-developer-2",
    department: "Design & Engineering",
    title: "Backend Developer",
    vacancies: 2,
    workHours: WORK_HOURS,
    jobType: "Fully Remote",
    experience: "Mid-Level",
    deadline: "20 Oct. 2026",
  },
  {
    id: "data-analyst-2",
    department: "Design & Engineering",
    title: "Data Analyst",
    vacancies: 2,
    workHours: WORK_HOURS,
    jobType: "Remote",
    experience: "Senior",
    deadline: "30 Nov. 2026",
  },
  {
    id: "product-manager-2",
    department: "Design & Engineering",
    title: "Product Manager",
    vacancies: 1,
    workHours: WORK_HOURS,
    jobType: "Hybrid",
    experience: "Experienced",
    deadline: "5 Dec. 2026",
  },
];

export type CoreValue = {
  title: string;
  Icon: ComponentType;
};

/** Two columns, filled row by row, in design order. */
export const CORE_VALUES: CoreValue[] = [
  { title: "Integrity &\nTransparency", Icon: IntegrityIcon },
  { title: "Community-centric\nGrowth", Icon: CommunityGrowthIcon },
  { title: "Diversity &\nInclusion", Icon: DiversityIcon },
  { title: "Results Oriented\nMindset", Icon: ResultsIcon },
  { title: "Continuous learning\n& improvement.", Icon: ContinuousLearningIcon },
  { title: "Customer centered\nApproach", Icon: CustomerCenteredIcon },
  { title: "Passion for\nImpact", Icon: PassionIcon },
  { title: "Empowerment\nThrough Experience.", Icon: EmpowermentIcon },
];
