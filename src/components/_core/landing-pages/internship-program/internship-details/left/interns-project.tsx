"use client";

import React, { useState } from "react";
import Image from "next/image";
import ViewProjectDialog from "./view-project-dialog";
import { Project } from "@/types/internship-program";
import { imageBaseurl, imageUrl } from "@/lib/utils";

const hhah = [
  {
    id: 1,
    title: "TeleCare Connection Expansion Project",
    author: "By Oluchi Sophia Ibeh",
    caption: "Project title",
    image: "/images/pngs/tech-professionals.png",
    variant: "care" as const,
  },
  {
    id: 2,
    title: "Retail Sales Integration Pipeline with AWS S3 and Airbyte",
    caption: "Project title",
    image: "/images/pngs/Fintech.png",
    variant: "tech" as const,
  },
];

interface InternsProjectProps {
  projects?: Project[];
}

const InternsProject = ({ projects = [] }: InternsProjectProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openDialog = (project: (typeof projects)[0]) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-bold text-[#092A31]">
        Interns Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(projects ?? []).map((project) => (
          <div key={project.id} className="space-y-3">
            <div
              className="group relative block overflow-hidden aspect-4/3 min-h-60 cursor-pointer"
              onClick={() => openDialog(project)}
            >
              <Image
                src={`${imageUrl}${project?.project_image}`}
                alt={project?.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 transition-opacity group-hover:bg-black/60" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amdari-yellow text-[#092A31] font-semibold text-sm hover:bg-amdari-yellow/90 transition-colors">
                  View
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[#092A31] font-medium truncate">
                {project?.description}
              </p>
              {project?.project_contributor && (
                <p className="text-sm text-[#092A31] font-medium truncate">
                  {project?.project_contributor}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <ViewProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={selectedProject ?? undefined}
      />
    </div>
  );
};

export default InternsProject;
