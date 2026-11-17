/** Placeholder content matching the Figma board, pending the HR API. */

export const STATS = [
  { label: "Open roles", value: "12", delta: "+2 roles", icon: "briefcase" as const },
  { label: "Total applications", value: "248", delta: "+18.1%", icon: "user" as const },
  { label: "Interviews scheduled", value: "24", delta: "+6 interviews", icon: "calendar" as const },
  { label: "Hires this month", value: "8", delta: "+3 hires", icon: "chart" as const },
];

export const PIPELINE = [
  { stage: "New applications", count: 142, tone: "#156374" },
  { stage: "Screening", count: 68, tone: "#7FAEB6" },
  { stage: "Interview", count: 24, tone: "#B6CFD4" },
  { stage: "Offer sent", count: 14, tone: "#FFE082" },
  { stage: "Hired", count: 24, tone: "#B6CFD4" },
];

export type RoleStatus = "Open" | "Closing soon";

export const OPEN_ROLES: {
  role: string;
  department: string;
  location: string;
  applicants: number;
  deadline: string;
  status: RoleStatus;
}[] = [
  {
    role: "Data Analysis Associate",
    department: "Data Team · Contract",
    location: "Remote",
    applicants: 64,
    deadline: "30 Oct 2026",
    status: "Open",
  },
  {
    role: "Product Designer",
    department: "Design & Engineering · Full-time",
    location: "Remote",
    applicants: 48,
    deadline: "31 Oct 2026",
    status: "Open",
  },
  {
    role: "Frontend Developer",
    department: "Design & Engineering · Full-time",
    location: "Remote",
    applicants: 36,
    deadline: "22 Oct 2026",
    status: "Closing soon",
  },
  {
    role: "Product Manager",
    department: "Product Team · Full-time",
    location: "Hybrid",
    applicants: 28,
    deadline: "5 Dec 2026",
    status: "Open",
  },
];

export type ApplicantStage = "New" | "Screening" | "Interview";

export const RECENT_APPLICANTS: {
  name: string;
  email: string;
  initials: string;
  avatarTone: string;
  appliedFor: string;
  stage: ApplicantStage;
  applied: string;
}[] = [
  {
    name: "Adaeze Nwosu",
    email: "adaeze.nwosu@gmail.com",
    initials: "AN",
    avatarTone: "#E8EFF1",
    appliedFor: "Data Analysis Associate",
    stage: "New",
    applied: "12 min ago",
  },
  {
    name: "Daniel Mensah",
    email: "daniel.mensah@gmail.com",
    initials: "DM",
    avatarTone: "#FDEBD2",
    appliedFor: "Product Designer",
    stage: "Screening",
    applied: "38 min ago",
  },
  {
    name: "Zainab Bello",
    email: "zainab.bello@gmail.com",
    initials: "ZB",
    avatarTone: "#E3ECFB",
    appliedFor: "Frontend Developer",
    stage: "Interview",
    applied: "1 hour ago",
  },
  {
    name: "Michael Adeyemi",
    email: "m.adeyemi@gmail.com",
    initials: "MA",
    avatarTone: "#F5E1E1",
    appliedFor: "Product Manager",
    stage: "New",
    applied: "2 hours ago",
  },
];

export const INTERVIEW_DAYS = [
  { letter: "M", day: 12 },
  { letter: "T", day: 13 },
  { letter: "W", day: 14, active: true },
  { letter: "T", day: 15 },
  { letter: "F", day: 16 },
];

export const UPCOMING_INTERVIEWS = [
  {
    candidate: "Zainab Bello",
    role: "Frontend Developer",
    kind: "Technical interview · with Emem",
    time: "10:30–11:15",
  },
  {
    candidate: "David Osei",
    role: "Data Analysis Associate",
    kind: "Culture interview · with Deborah",
    time: "14:00–14:30",
  },
];
