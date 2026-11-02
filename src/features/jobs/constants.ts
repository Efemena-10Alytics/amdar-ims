/**
 * The jobs feed's only supported category — anything else is a 400
 * ("Unknown category: x. Supported: tech."). Sent on every request so the
 * boards only ever show tech roles.
 */
export const JOBS_CATEGORY = "tech";

export const JOB_TITLE_OPTIONS = [
  "Business Analysis",
  "Data Analytics",
  "Data Engineering",
  "Data Science",
  "GRC",
  "Project Management",
  "SOC Analysis",
  "DevOps",
  "Financial Analytics",
  "Health tech Analytics",
  "Health tech Business Analysis",
  "Health tech Project Management",
  "Human Resources Analytics",
  "Penetration Testing/ethical hacking",
  "Product design",
];

export const SPONSORSHIP_OPTIONS = ["Yes", "No"];
