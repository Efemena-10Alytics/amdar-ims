"use client";

import { useState } from "react";
import Image from "next/image";
import ViewProjectDialog from "./view-project-dialog";
import { Project } from "@/types/internship-program";
import { baseUrl } from "@/lib/utils";

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

  console.log("project", projects);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold text-[#092A31]">
        Interns Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(projects ?? []).map((project) => {
          const imageSrc = project.project_image
            ? `${baseUrl}${project.project_image}`
            : "/images/pngs/intern-project.png";
          console.log("imageSrc", imageSrc);
          return (
            <div key={project.id} className="space-y-3">
              <div
                className="group relative block overflow-hidden aspect-4/3 min-h-60 cursor-pointer"
                onClick={() => openDialog(project)}
              >
                <Image
                  src={imageSrc}
                  alt={project?.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

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
          );
        })}
      </div>

      <ViewProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={selectedProject ?? undefined}
        projects={projects}
        onSelectProject={setSelectedProject}
      />
    </div>
  );
};

export default InternsProject;
