"use client";

import { ViewProjectContent } from "../add-project/[id]/view-project-content";
import type { ViewProjectData } from "../add-project/[id]/view-project-content";

const SAMPLE_PROJECT: ViewProjectData = {
  title: "Project title",
  tags: ["Education", "4 weeks"],
  coverImageUrl: undefined, // set to image URL when available
  overview:
    "Product designer crafting intuitive digital experiences for fintech, enterprise, and social impact. I design with empathy, think systematically, and build solutions that work for everyone. Based in Nigeria, working globally.",
  tools: [
    { name: "Figma" },
    { name: "Sketch" },
    { name: "Ubuntu" },
    { name: "Sales force" },
    { name: "Trello" },
    { name: "Photoshop" },
    { name: "Canva" },
    { name: "Adobe illustration" },
  ],
  rationale:
    "Product designer crafting intuitive digital experiences for fintech, enterprise, and social impact. I design with empathy, think systematically, and build solutions that work for everyone. Based in Nigeria, working globally.",
  aim: "Product designer crafting intuitive digital experiences for fintech, enterprise, and social impact. I design with empathy, think systematically, and build solutions that work for everyone. Based in Nigeria, working globally.",
  solutionUrl: "https://example.com/solution",
  mediaLink: "https://example.com/media",
};

export default function ViewProjectPage() {
  const handleEdit = () => {
    // TODO: navigate to edit project
    window.location.href = "/dashboard-dev/portfolio/add-project";
  };

  const handleDelete = () => {
    // TODO: confirm and delete
    if (typeof window !== "undefined" && window.confirm("Delete this project?")) {
      window.location.href = "/dashboard-dev/portfolio";
    }
  };

  return (
    <ViewProjectContent
      project={SAMPLE_PROJECT}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
