"use client";

import { CircleCheck, User } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Pill } from "../project-details-content";
import CompanyDetails from "./company-details";
import ProjectBrief from "./project-brief";
import Scope from "./scope";
import TechStack from "./tech-stack";
import Workflow from "./workflow";
import Lessons from "./lessons";

const SKILLS = [
    "Data Transformation",
    "Data Analysis & Modeling",
    "Continuous Improvement",
    "Continuous Improvement",
    "Reporting",
    "Data Transformation",
    "Data Analysis & Modeling",
    "Reporting and Decision Making",
];

const PROJECT_SECTIONS = [
    "Project brief",
    "Company details",
    "Scope",
    "Tech stack",
    "Work flow",
    "Lesson",
] as const;

type ProjectSection = (typeof PROJECT_SECTIONS)[number];

const ProjectViews = () => {
    const [activeSection, setActiveSection] = useState<ProjectSection>("Company details");

    const activeSectionContent = useMemo(() => {
        if (activeSection === "Project brief") return <ProjectBrief />;
        if (activeSection === "Company details") return <CompanyDetails />;
        if (activeSection === "Scope") return <Scope />;
        if (activeSection === "Tech stack") return <TechStack />;
        if (activeSection === "Work flow") return <Workflow />;
        if (activeSection === "Lesson") return <Lessons />;

        return (
            <div className="pt-6 text-sm text-[#64748B]">
                {activeSection} content coming soon.
            </div>
        );
    }, [activeSection]);

    return (
        <div>
            <div className="relative overflow-hidden rounded-[1.75rem]">
                <Image
                    src="/images/pngs/ads/woman.png"
                    alt="Project banner"
                    width={1280}
                    height={540}
                    className="h-56 w-full object-cover sm:h-72"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#092A31]/75 via-[#092A31]/45 to-transparent" />

                <div className="absolute inset-x-4 bottom-5 sm:inset-x-6">
                    <span className="mb-3 inline-flex size-7 items-center justify-center rounded-full bg-[#CFF6DA]">
                        <CircleCheck className="size-4 text-[#238A50]" />
                    </span>
                    <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-4xl">
                        Tenant Retention Optimization: Building an Interactive Power BI
                        Dashboard for...
                    </h2>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm mt-4">
                <Pill>Healthcare</Pill>
                <Pill>3 weeks duration</Pill>
                <Pill className="text-[#98A2B3]">
                    <User className="size-3.5" />
                    Jennifer Okeke contributor
                </Pill>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] p-4 sm:p-5 mt-4">
                <h3 className="text-base font-semibold text-[#173740]">
                    Skills to be developed
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                    {SKILLS.map((skill, index) => (
                        <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-[#DFE6EB] px-3 py-1.5 text-xs font-medium text-[#64748B] sm:text-sm"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-6 px-1 mt-10">
                {PROJECT_SECTIONS.map((section) => {
                    const active = section === activeSection;

                    return (
                        <button
                            key={section}
                            type="button"
                            onClick={() => setActiveSection(section)}
                            className={[
                                "relative pb-2 text-base font-medium transition-colors mb-10",
                                active
                                    ? "text-[#156374]"
                                    : "text-[#B6CFD4] hover:text-[#8FA3AF]",
                            ].join(" ")}
                        >
                            {section}
                            {active ? (
                                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#156374]" />
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {activeSectionContent}
        </div>
    )
}

export default ProjectViews
