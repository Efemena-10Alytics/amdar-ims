"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, imageBaseurl } from "@/lib/utils";
import { NotepadText } from "lucide-react";
import { Project } from "@/types/internship-program";

export type ViewProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  project?: Project;
};

const ViewProjectDialog = ({
  open,
  onClose,
  project,
}: ViewProjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={cn(
          "fixed top-[50%] left-auto right-10 translate-x-0 -translate-y-1/2 h-[98vh] max-w-120! 2xl:max-w-150 w-full rounded-md flex flex-col p-0 gap-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        )}
        showCloseButton={true}
      >
        {/* Header */}
        <DialogHeader className="shrink-0 p-6 pb-0! border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl lg:text-2xl font-bold text-[#092A31] mb-2 text-left">
                {project?.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Content Sections - Stacked */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="text-[#64748B] text-sm leading-relaxed mb-3 text-left">
            {project?.description}
          </div>

          {/* Project Overview */}
          <div className="relative h-64 lg:h-80 bg-[#1e293b] overflow-hidden mt-3">
            <Image
              src={
                project?.project_image
                  ? `${imageBaseurl}/${project.project_image}`.replace(
                      /\/+/g,
                      "/",
                    )
                  : "/images/pngs/intern-project.png"
              }
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
      </DialogContent>
    </Dialog>
  );
};

export default ViewProjectDialog;
