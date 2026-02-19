"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { baseUrl, cn } from "@/lib/utils";
import { Project } from "@/types/internship-program";

export type ViewProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  project?: Project;
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
};

const ViewProjectDialog = ({
  open,
  onClose,
  project,
  projects = [],
  onSelectProject,
}: ViewProjectDialogProps) => {
  const currentIndex = project
    ? projects.findIndex((p) => p.id === project.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < projects.length - 1;
  const prevProject = hasPrev ? projects[currentIndex - 1] : undefined;
  const nextProject = hasNext ? projects[currentIndex + 1] : undefined;

  const imageSrc = project?.project_image
    ? `${baseUrl}${project.project_image}`
    : "/images/pngs/intern-project.png";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={cn(
          "h-[90vh] w-full max-w-[calc(100%-2rem)] rounded-md flex flex-col p-0 gap-0 sm:max-w-3xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        )}
        showCloseButton={true}
      >
        {/* Header */}
        <DialogHeader className="shrink-0 p-6 pb-0! border-b border-gray-100">
          <div className="flex-col items-start justify-between gap-4">
            <DialogClose>
              <div
                role="button"
                className="text-[#D93E3E] mb-2 flex items-center gap-1 cursor-pointer hover:scale-105 w-fit transition-all duration-300"
              >
                {" "}
                <X className="size-5" /> Close
              </div>
            </DialogClose>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold text-[#092A31] mb-2 text-left">
                {project?.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Content Sections - Stacked */}
        <div className="flex-1 overflow-y-auto w-full p-6 pt-0 min-h-0">
          <div className="text-[#64748B] text-sm leading-relaxed mb-3 text-left">
            {project?.description}
          </div>

          {/* Project Overview */}
          <div className="relative h-64 lg:h-80 bg-[#1e293b] overflow-hidden mt-3">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-[#092A31]">
              Project Aim
            </h3>
            {project?.aim && (
              <div className="flex items-start gap-2 py-2 text-[#64748B] text-sm leading-relaxed">
                {/* <NotepadText className="text-[#64748B] w-4 h-4 shrink-0 mt-0.5" /> */}
                <div
                  className="[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                  dangerouslySetInnerHTML={{ __html: project.aim }}
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-[#092A31]">
              Project Note
            </h3>
            {project?.data_description && (
              <div className="flex items-start gap-2 py-2 text-[#64748B] text-sm leading-relaxed">
                {/* <NotepadText className="text-[#64748B] w-4 h-4 shrink-0 mt-0.5" /> */}
                <div
                  className="[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                  dangerouslySetInnerHTML={{ __html: project.data_description }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom: Back / Next Project */}
        <div className="shrink-0 flex items-center border-t border-[#F8FAFB] rounded-b-lg">
          <Button
            type="button"
            variant="outline"
            disabled={!hasPrev || !prevProject}
            onClick={() => prevProject && onSelectProject?.(prevProject)}
            className="flex-1 rounded-bl-md! h-14 rounded-none border-gray-200 bg-white text-[#092A31] hover:bg-gray-50 font-medium"
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={!hasNext || !nextProject}
            onClick={() => nextProject && onSelectProject?.(nextProject)}
            className="flex-1 rounded-br-md! h-14 rounded-none bg-[#0F4652] text-amdari-yellow hover:bg-[#0d3d47] font-medium gap-2"
          >
            Next Project
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProjectDialog;
