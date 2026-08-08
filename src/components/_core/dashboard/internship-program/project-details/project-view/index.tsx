"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { InternProject } from "@/features/interns-project/internship-project.types";
import { Pill } from "../project-details-content";
import { formatDurationLabel } from "../project-content";
import CompanyDetails from "./company-details";
import ProjectBrief from "./project-brief";
import Scope from "./scope";
import TechStack from "./tech-stack";
import Workflow from "./workflow";
import Lessons from "./lessons";

const PROJECT_SECTIONS = [
  "Project brief",
  "Company details",
  "Scope",
  "Tech stack",
  "Work flow",
  "Lesson",
] as const;

type ProjectSection = (typeof PROJECT_SECTIONS)[number];

const FALLBACK_BANNER = "/images/pngs/ads/woman.png";

type ProjectViewsProps = {
  project: InternProject;
};

const ProjectViews = ({ project }: ProjectViewsProps) => {
  const [activeSection, setActiveSection] =
    useState<ProjectSection>("Project brief");

  const skills = (project.skills ?? []).filter(Boolean);
  const durationLabel = formatDurationLabel(project.duration);
  const coverSrc = project.coverPreview?.trim() || FALLBACK_BANNER;
  const isRemoteCover = /^https?:\/\//i.test(coverSrc);

  const activeSectionContent = useMemo(() => {
    if (activeSection === "Project brief") {
      return <ProjectBrief project={project} />;
    }
    if (activeSection === "Company details") {
      return <CompanyDetails project={project} />;
    }
    if (activeSection === "Scope") {
      return <Scope project={project} />;
    }
    if (activeSection === "Tech stack") {
      return <TechStack project={project} />;
    }
    if (activeSection === "Work flow") {
      return <Workflow project={project} />;
    }
    if (activeSection === "Lesson") {
      return <Lessons project={project} />;
    }

    return (
      <div className="pt-6 text-sm text-[#64748B]">
        {activeSection} content coming soon.
      </div>
    );
  }, [activeSection, project]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-[1.75rem]">
        {isRemoteCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt={project.title}
            className="h-56 w-full object-cover sm:h-72"
          />
        ) : (
          <Image
            src={coverSrc}
            alt={project.title}
            width={1280}
            height={540}
            className="h-56 w-full object-cover sm:h-72"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-[#092A31]/50 via-[#092A31]/45 to-transparent" />

        <div className="absolute inset-x-4 bottom-5 sm:inset-x-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.logoPreview || "/favicon.svg"}
            alt={project.companyName || project.title}
            className="mb-3 size-7 rounded-full object-cover"
          />
          <h2 className="max-w-3xl text-2xl leading-tight font-semibold text-white sm:text-4xl">
            {project.title}
          </h2>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {project.industry ? <Pill>{project.industry}</Pill> : null}
        {durationLabel ? <Pill>{durationLabel}</Pill> : null}
        {project.companyName ? (
          <Pill className="text-[#98A2B3]">
            <User className="size-3.5" />
            {project.companyName}
          </Pill>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[#173740]">
          Skills to be developed
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.length ? (
            skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full bg-[#DFE6EB] px-3 py-1.5 text-xs font-medium text-[#64748B] sm:text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-[#94A3B8]">No skills listed yet.</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-end gap-6 px-1">
        {PROJECT_SECTIONS.map((section) => {
          const active = section === activeSection;

          return (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={[
                "relative mb-10 pb-2 text-base font-medium transition-colors",
                active
                  ? "text-[#156374]"
                  : "text-[#B6CFD4] hover:text-[#8FA3AF]",
              ].join(" ")}
            >
              {section}
              {active ? (
                <span className="absolute inset-x-0 -bottom-px h-1 rounded-full bg-[#156374]" />
              ) : null}
            </button>
          );
        })}
      </div>

      {activeSectionContent}
    </div>
  );
};

export default ProjectViews;
