export const DEFAULT_PROJECT_IMAGE =
  "/images/pngs/new-home/project-details.png";

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  metric?: { value: string; label: string };
};

export const PROJECTS: Project[] = [
  {
    id: "bottom-line-impact",
    title:
      "How AMDARI Consultants Delivered Over $4.5 Billion in Bottom-Line Impact",
    description:
      "AMDARI Consultants partnered with a leading technology firm to reimagine productivity at scale. By leveraging AI and data-driven decision-making, the engagement focused on streamlining operations, accelerating execution, and unlocking measurable business value.",
    image: DEFAULT_PROJECT_IMAGE,
    metric: { value: "$4.5B+", label: "Reported bottom-line Impact" },
  },
  {
    id: "carbon-footprint",
    title:
      "How AMDARI Consultants Unlocked a New Revenue Stream Through Carbon Footprint Accounting",
    description:
      "AMDARI Consultants explored how lower-emission production could become a scalable revenue opportunity. Through technology, data, and sustainability-driven insights, the collaboration",
    image: "/images/pngs/new-home/the-impact/project-2.jpg",
  },
  {
    id: "avoidable-discharges",
    title:
      "How AMDARI Consultants Helped a Regional Health System Reduce Avoidable Discharges by 32%",
    description:
      "A regional health system faced mounting pressure on beds and clinical capacity. AMDARI Consultants worked alongside its operations, clinical and IT leaders to unify patient-flow data, predict discharge readiness",
    image: "/images/pngs/new-home/the-impact/project-3.jpg",
  },
  {
    id: "cyber-threats",
    title:
      "How AMDARI Consultants Helped a Global Financial Services Firm Respond to Cyber Threats 55% Faster",
    description:
      "A global financial services firm was overwhelmed by security alerts from dozens of disconnected tools. AMDARI Consultants teamed with its security and technology leaders to consolidate telemetry",
    image: "/images/pngs/new-home/the-impact/project-1.jpg",
  },
];

export function getProject(id: string) {
  return PROJECTS.find(
    (project, index) => project.id === id || String(index + 1) === id,
  );
}
