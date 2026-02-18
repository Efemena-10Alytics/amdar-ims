"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ProjectSlide from "./project-slide";
import type { InternshipProgram } from "@/types/internship-program";

const OVERLAY_QUOTE =
  "Our program is not a course. It is work experience, with expectations, deliverables, teamwork, leadership guidance, and results.";

const PARAGRAPH =
  "Most people learn tech skills... but can't prove they can apply them. Amdari was created to solve this problem. We give you structured work experience that mirrors how teams operate in real organizations.";

interface ProjectProps {
  program?: InternshipProgram;
}

const Project = ({ program }: ProjectProps) => {
  return (
    <div className="bg-[#F1F5F6] py-12 lg:py-20">
      <div className="app-width">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left: Image with overlay */}
          <div className="flex-1 flex justify-center">
            <div className="bg-primary p-4 lg:p-6 max-w-160 w-full">
              <div className="relative rounded-lg overflow-hidden bg-[#0F4652] aspect-4/3 min-h-70 lg:min-h-0">
                <Image
                  src="/images/pngs/lady.png"
                  alt="Intern at work"
                  fill
                  className="object-cover h-full"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 right-0 p-4 m-2 lg:m-4 rounded-xl bg-black/70">
                  <p className="text-sm lg:text-base text-white/95 leading-relaxed">
                    {OVERLAY_QUOTE}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy and numbered indicators */}
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#092A31] mb-4">
              Why Take This Internship?
            </h2>
            <p className="text-[#64748B] text-base lg:text-lg leading-relaxed mb-8">
              {PARAGRAPH}
            </p>
            <div className="mt-20">
              <p className="text-[#64748B] text-base font-medium mb-2">
                With Amdari, you gain
              </p>
              <ProjectSlide />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
