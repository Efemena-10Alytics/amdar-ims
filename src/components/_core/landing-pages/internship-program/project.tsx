"use client";

import React from "react";
import ProjectSlide from "./project-slide";
import type { InternshipProgram } from "@/types/internship-program";
import FeatureSplitSection from "./feature-split-section";

const OVERLAY_QUOTE =
  "Our program is not a course. It is work experience, with expectations, deliverables, teamwork, leadership guidance, and results.";

const PARAGRAPH =
  "Most people learn tech skills... but can't prove they can apply them. Amdari was created to solve this problem. We give you structured work experience that mirrors how teams operate in real organizations.";

interface ProjectProps {
  program?: InternshipProgram;
}

const Project = ({ program }: ProjectProps) => {
  return (
    <FeatureSplitSection
      title="Why Take This Internship?"
      description={PARAGRAPH}
      imageSrc="/images/pngs/lady.png"
      imageAlt="Intern at work"
      overlayQuote={OVERLAY_QUOTE}
      footerContent={
        <div className="mt-20">
          <p className="mb-2 text-base font-medium text-[#64748B]">
            With Amdari, you gain
          </p>
          <ProjectSlide />
        </div>
      }
    />
  );
};

export default Project;
