"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PortfolioHero } from "../../dashboard/portfolio/template/classic/portfolio-hero";
import { MyProjects } from "../../dashboard/portfolio/template/classic/my-project";
import { MyWorkExperience } from "../../dashboard/portfolio/template/classic/my-work-experince";
import { MyTools } from "../../dashboard/portfolio/template/classic/my-tools";
import { MyEducationBackground } from "../../dashboard/portfolio/template/classic/my-education-background";
import { Footer } from "../../dashboard/portfolio/template/classic/footer";
import { MySpecialization } from "../../dashboard/portfolio/template/classic/my-specializion";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#specialization", label: "Specialization" },
  { href: "#contact", label: "Contact me" },
] as const;

const Classic = () => {
  return (
    <div className="app-width">
      <header className="flex items-center justify-between py-4 mb-20">
        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#C7F5D8] px-2.5 py-4 border border-[#ACF0C5]">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-[#1F5D36]"
            aria-hidden
          />
          <span className="text-xs font-medium text-[#1F5D36]">
            Available to work
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8" aria-label="Main">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = label === "Home"; // or derive from pathname/hash
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600 underline decoration-blue-600 underline-offset-4"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <PortfolioHero
        value={{
          name: "Oluwajuwonlo",
          jobTitle: "Product Designer",
          bio: "Product designer crafting intuitive digital experiences for fintech, enterprise, and social impact. I design with empathy, think systematically, and build solutions that work for everyone. Based in Nigeria, working globally.",
          projectsCount: "28",
          yearsExperience: "3",
          countryName: "Canada",
          toolBadge: "Figma",
        }}
      />

      <MyProjects
        projects={[
          {
            title: "Mango",
            tags: ["Branding", "Graphics"],
            imageUrl: "/images/pngs/template/bold.png",
          },
          {
            title: "IPADPRO",
            tags: ["Website", "Figma", "Hello"],
            imageUrl: "/images/pngs/template/whole.png",
          },
        ]}
        onAddProject={() => {}}
      />
      <MyWorkExperience
        items={[
          {
            company: "Nigerian Army",
            category: "Security",
            role: "Product Designer",
            duration: "2023-2024",
          },
          {
            company: "Nigerian Army",
            category: "Security",
            role: "Product Designer",
            duration: "2023-2024",
          },
          {
            company: "Nigerian Army",
            category: "Security",
            role: "Product Designer",
            duration: "2023-2024",
          },
        ]}
        onItemClick={() => {}}
      />
      <MySpecialization
        specializations={[
          "Product design",
          "Foundational design",
          "Filers",
          "Architectural",
          "Branding",
          "Graphics",
        ]}
        softSkills={[
          "Prototyping",
          "Interface design",
          "User research",
          "Quantitative research",
          "Qualitative research",
          "Wireframing",
          "Presentations",
          "Slides",
          "Animation",
          "Brain storming",
          "Mood board",
        ]}
      />
      <MyTools
        tools={[
          { name: "Figma", percentage: 80 },
          { name: "Trello", percentage: 80 },
          { name: "Photoshop", percentage: 80 },
          { name: "Adobe Illustrator", percentage: 80 },
        ]}
        title="Product Designer"
      />
      <MyEducationBackground
        entries={[
          { institution: "Salzburg University", degree: "Master's Degree" },
          { institution: "School of Design", degree: "Bachelor's Degree" },
        ]}
      />
      <Footer />
    </div>
  );
};

export default Classic;
