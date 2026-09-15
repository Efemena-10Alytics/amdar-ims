"use client";

import type { InternProject } from "@/features/interns-project/internship-project.types";
import Resources from "../internship-details/resources";

export default function ResourcesDetails({
  project,
  title,
}: {
  project: InternProject;
  title?: string;
}) {
  return (
    <Resources
      projectId={project.id}
      excludeCategories={["meeting-link"]}
      title={title ?? "Resources"}
    />
  );
}
