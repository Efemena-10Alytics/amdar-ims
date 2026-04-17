import { useMemo } from "react";

export type BlogCategoryOption = {
  label: string;
  value: string;
};

export type BlogCategoryGroup = {
  title: string;
  options: BlogCategoryOption[];
};

export function useBlogCategory() {
  const categoryGroups = useMemo<BlogCategoryGroup[]>(
    () => [
      {
        title: "Internship & Experience",
        options: [
          { id: "why-experience-matters", label: "Why Experience Matters" },
          { id: "internship-job-stories", label: "Internship - Job Stories" },
          { id: "real-world-projects", label: "Real-World Projects Breakdown" },
          {
            id: "references-recommendations",
            label: "References & Recommendations",
          },
        ].map((opt) => ({ label: opt.label, value: opt.id })),
      },
      {
        title: "Workplace Skills",
        options: [
          {
            id: "communication-soft-skills",
            label: "Communication & Soft Skills",
          },
          { id: "productivity-time", label: "Productivity & Time Management" },
          {
            id: "workplace-culture",
            label: "Workplace Culture in the UK/US/Canada",
          },
          { id: "tools-tech-stack", label: "Tools & Tech Stack Guides" },
        ].map((opt) => ({ label: opt.label, value: opt.id })),
      },
      {
        title: "UK Tech Job Market",
        options: [
          { id: "visa-sponsorship", label: "Visa & Sponsorship Insights" },
          { id: "uk-experience", label: "No UK Experience Fixes" },
          {
            id: "relocation-integration",
            label: "Relocation & Integration Tips",
          },
          { id: "salary-trends", label: "Salary Trends & Role Demands" },
        ].map((opt) => ({ label: opt.label, value: opt.id })),
      },
      {
        title: "Tech Pathways",
        options: [
          { id: "data-analytics", label: "Data Analytics" },
          { id: "data-engineering", label: "Data Engineering" },
          { id: "cybersecurity", label: "Cybersecurity" },
          { id: "business-analysis", label: "Business Analysis" },
          { id: "data-science", label: "Data Science" },
          { id: "project-management", label: "Project Management" },
          { id: "soc-analysis", label: "SOC Analysis" },
          { id: "ethical-hacking", label: "Ethical Hacking" },
          { id: "product-design", label: "Product Design" },
          { id: "devops", label: "DevOps" },
          { id: "app-cloud-security", label: "App/Cloud Security" },
          {
            id: "governance-risk-compliance",
            label: "Governance Risk & Compliance",
          },
        ].map((opt) => ({ label: opt.label, value: opt.id })),
      },
      {
        title: "Interview Prep",
        options: [
          { id: "interview-qa", label: "Interview Questions & Answers" },
          { id: "mock-interviews", label: "Mock Interview Guides" },
          { id: "common-mistakes", label: "Common Mistakes & Fixes" },
          { id: "recruiter-insights", label: "Recruiter Insights" },
        ].map((opt) => ({ label: opt.label, value: opt.id })),
      },
      {
        title: "Career Essentials",
        options: [
          { id: "cover-letters", label: "Cover Letters & CVs" },
          { id: "linkedin-optimization", label: "LinkedIn Optimization" },
          { id: "portfolio-building", label: "Portfolio Building" },
          { id: "job-applications", label: "Job Applications" },
        ].map((opt) => ({ label: opt.label, value: opt.id })),
      },
    ],
    [],
  );

  return { categoryGroups };
}
