"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";

const STAKEHOLDERS = [
  "Hospital Management: Project sponsor and decision-maker.",
  "Patient Services Department: Facilitates patient access and support.",
  "Marketing and Outreach Team: Raises awareness and drives adoption.",
  "Clinical Staff: End-users who provide feedback on usability and effectiveness.",
  "Finance Department: Manages project budgets and ensures financial sustainability.",
  "Regulatory Affairs & Compliance Team: Ensures legal and regulatory compliance.",
  "IT Department: Responsible for technical implementation and system integration.",
  "Patients: End-users who will benefit from telemedicine services and provide feedback.",
  "TeleCare Connect Platform Providers: Deliver the TeleCare Connect platform and support.",
];

const TECH_STACK = [
  "TeleCare Connect Platforms: Zoom and Doxy.me are used for video consultations and patient management.",
  "Data Analysis and Reporting: Excel for data analysis, trend forecasting, and reporting on telemedicine usage.",
  "Process Flow Mapping: Miro for mapping out process flows for TeleCare Connect consultations, patient interactions, and feedback loops.",
];

export type ViewProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  project?: {
    title?: string;
    description?: string;
    role?: string;
    overviewTitle?: string;
    overviewSubtitle?: string;
    overviewImage?: string;
  };
};

const DEFAULT_PROJECT = {
  title: "Mapping the Customer Onboarding Journey at MagicMade",
  description:
    "Deploy, automate, monitor, and optimize cloud environments using real-world infrastructure principles and workflows.",
  role: "DevOps Consultant",
  overviewTitle: "TeleCare Connect Expansion Project",
  overviewSubtitle:
    "Enhancing Access to Healthcare in the UK By Oluchi Sophia Ibeh",
  overviewImage: "/images/pngs/intern-project.png",
};

const ViewProjectDialog = ({
  open,
  onClose,
  project,
}: ViewProjectDialogProps) => {
  const p = { ...DEFAULT_PROJECT, ...project };

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
                {p.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Content Sections - Stacked */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="text-[#64748B] text-sm leading-relaxed mb-3 text-left">
            {p.description}
          </div>
          <div className="inline-flex items-center gap-1 py-1 rounded-full text-xs font-medium text-[#64748B]">
            <NotepadText className="text-[#64748B] w-4 h-4" />
            {p.role}
          </div>
          {/* Project Overview */}
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="relative h-64 lg:h-80 bg-[#1e293b] overflow-hidden mt-3"
            >
              <Image
                src={p.overviewImage ?? "/images/pngs/intern-project.png"}
                alt=""
                fill
                className="object-cover opacity-80"
              />
              {/* <div className="absolute inset-0 bg-black/40" /> */}
              {/* <div className="absolute top-4 right-4 flex items-center gap-1 text-white/90 text-xs font-medium">
              <span>AMDARI</span>
            </div> */}
              {/* <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white">
              <h3 className="text-lg lg:text-xl font-bold mb-1">
                {p.overviewTitle}
              </h3>
              <p className="text-sm text-white/90">{p.overviewSubtitle}</p>
            </div> */}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProjectDialog;
