"use client";

import { useRouter } from "next/navigation";
import { ViewProjectContent } from "../add-project/[id]/view-project-content";
import type { ViewProjectData } from "../add-project/[id]/view-project-content";
import { useConfirm } from "@/hooks/use-confirm";

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
  excerpt:
    "Designed a clearer learning flow for students, balancing usability, accessibility, and stakeholder goals across the product journey.",
  rationale:
    "Product designer crafting intuitive digital experiences for fintech, enterprise, and social impact. I design with empathy, think systematically, and build solutions that work for everyone. Based in Nigeria, working globally.",
  aim: "Product designer crafting intuitive digital experiences for fintech, enterprise, and social impact. I design with empathy, think systematically, and build solutions that work for everyone. Based in Nigeria, working globally.",
  scope:
    "User research, wireframing, interface design, usability testing, stakeholder presentations, and design system refinement.",
  projectImages: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  ],
  solutionUrl: "https://example.com/solution",
  mediaLink: "https://example.com/media",
};

export default function ViewProjectPage() {
  const router = useRouter();
  const { confirm, ConfirmDialog } = useConfirm({
    title: "Delete project?",
    description: "This project will be permanently removed and cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "destructive",
  });

  const handleEdit = () => {
    // TODO: navigate to edit project
    router.push("/dashboard-dev/portfolio/add-project");
  };

  const handleDelete = async () => {
    // TODO: confirm and delete
    const confirmed = await confirm();
    if (confirmed) {
      router.push("/dashboard-dev/portfolio");
    }
  };

  return (
    <>
      <ViewProjectContent
        project={SAMPLE_PROJECT}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {ConfirmDialog}
    </>
  );
}
