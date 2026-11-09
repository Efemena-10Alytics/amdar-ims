"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Calendar, ChevronDown, RotateCcw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type CompanyMark = "google" | "apex" | "spectrum";
type ProjectStatus = "Active" | "Completed";

type ShowcaseProject = {
    id: string;
    title: string;
    description: string;
    careerTrack: string;
    category: string;
    duration: string;
    status: ProjectStatus;
    mark: CompanyMark;
};

const PROJECTS: ShowcaseProject[] = [
    {
        id: "cement-demand",
        title: "Cement Demand Forecasting Across Multiple Regions",
        description:
            "This project focuses on developing a data-driven cement demand forecasting system for Midlands Industrial.",
        careerTrack: "Data Science",
        category: "Civil Engineering and Construction",
        duration: "3 weeks",
        status: "Active",
        mark: "google",
    },
    {
        id: "harbor-medical",
        title: "Operational Efficiency and Patient Outcome Analysis",
        description:
            "Operational Efficiency and Patient Outcome Analysis at Harbor Medical Center.",
        careerTrack: "Data Analysis",
        category: "Healthcare",
        duration: "2 weeks",
        status: "Active",
        mark: "apex",
    },
    {
        id: "largence",
        title: "Developing a Customer Satisfaction and Retention Programme",
        description:
            "Largence is a UK-focused LegalTech platform designed to modernise legal operations by providing clearer case workflows.",
        careerTrack: "Project Management",
        category: "LegalTech",
        duration: "2 weeks",
        status: "Completed",
        mark: "spectrum",
    },
    {
        id: "housing-repair",
        title: "Housing Repair Service Improvement Project",
        description:
            "Westbridge Borough Council is a local authority based in the West Midlands, England. Established in 1974.",
        careerTrack: "Business Analysis",
        category: "Construction",
        duration: "3 weeks",
        status: "Active",
        mark: "apex",
    },
    {
        id: "medisure",
        title: "Strengthening Cyber Resilience through Phishing Simulation",
        description:
            "This case study simulates a phishing incident targeting MediSure Health Network, a healthcare provider.",
        careerTrack: "SOC Analysis",
        category: "Healthcare",
        duration: "2 weeks",
        status: "Completed",
        mark: "spectrum",
    },
    {
        id: "safemed",
        title: "Enterprise Security Governance & Compliance",
        description:
            "SafeMed Innovations is a high-growth healthcare technology company founded in 2020 that provides digital care tools.",
        careerTrack: "GRC",
        category: "Healthcare",
        duration: "3 weeks",
        status: "Active",
        mark: "google",
    },
];

const CAREER_TRACKS = [...new Set(PROJECTS.map((project) => project.careerTrack))];
const CATEGORIES = [...new Set(PROJECTS.map((project) => project.category))];

function CompanyLogo({ mark }: { mark: CompanyMark }) {
    if (mark === "google") {
        return (
            <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
                <path
                    fill="#4285F4"
                    d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.48h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.56-5.17 3.56-8.75Z"
                />
                <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.1-6.72-4.94H1.28v3.1A12 12 0 0 0 12 24Z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.28 14.3A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.3V6.6H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4-3.1Z"
                />
                <path
                    fill="#EA4335"
                    d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.14 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4 3.1C6.23 6.87 8.88 4.77 12 4.77Z"
                />
            </svg>
        );
    }

    if (mark === "apex") {
        return (
            <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E7EEF2]"
                aria-hidden
            >
                <svg viewBox="0 0 16 16" className="size-3.5">
                    <path d="M8 2.2 13.2 13H2.8L8 2.2Z" fill="#5B6C86" />
                </svg>
            </span>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
            <path d="M12 2a10 10 0 0 1 10 10H12V2Z" fill="#FBBC05" />
            <path d="M22 12a10 10 0 0 1-10 10V12h10Z" fill="#34A853" />
            <path d="M12 22A10 10 0 0 1 2 12h10v10Z" fill="#4285F4" />
            <path d="M2 12A10 10 0 0 1 12 2v10H2Z" fill="#EA4335" />
        </svg>
    );
}

function FilterMenu({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string | null;
    options: string[];
    onChange: (value: string | null) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#334155] outline-none transition hover:bg-[#F8FAFC]">
                <span className="max-w-40 truncate">{value ?? label}</span>
                <ChevronDown className="size-4 text-[#64748B]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
                <DropdownMenuItem onClick={() => onChange(null)}>All</DropdownMenuItem>
                {options.map((option) => (
                    <DropdownMenuItem key={option} onClick={() => onChange(option)}>
                        {option}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function FeaturedProjects() {
    const [careerTrack, setCareerTrack] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);

    const projects = useMemo(
        () =>
            PROJECTS.filter((project) => {
                if (careerTrack && project.careerTrack !== careerTrack) return false;
                if (category && project.category !== category) return false;
                return true;
            }),
        [careerTrack, category],
    );

    const resetFilters = () => {
        setCareerTrack(null);
        setCategory(null);
    };

    return (
        <section id="featured-projects" className="scroll-mt-28 bg-white py-14 lg:py-20">
            <div className="app-width">
                <h2 className="font-clash-display text-3xl font-semibold tracking-tight text-[#092A31] sm:text-4xl lg:text-[2.7rem]">
                    Featured Projects
                </h2>
                <p className="mt-2 text-sm text-[#94A3B8] sm:text-base">
                    Search here for the kind of projects you&apos;ll work on
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="px-1 text-sm font-semibold text-[#0F172A] sm:text-base"
                    >
                        All Projects
                    </button>
                    <span className="hidden h-6 w-px bg-[#E2E8F0] sm:block" aria-hidden />
                    <FilterMenu
                        label="Career Track"
                        value={careerTrack}
                        options={CAREER_TRACKS}
                        onChange={setCareerTrack}
                    />
                    <FilterMenu
                        label="Project Categories"
                        value={category}
                        options={CATEGORIES}
                        onChange={setCategory}
                    />
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-[#F1F5F9] px-3 text-sm font-medium text-[#64748B] transition hover:bg-[#E2E8F0]"
                    >
                        <RotateCcw className="size-3.5" />
                        Reset filter
                    </button>
                </div>

                {projects.length === 0 ? (
                    <p className="mt-10 text-sm text-[#64748B]">
                        No projects match these filters.
                    </p>
                ) : (
                    <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="flex flex-col rounded-2xl border border-[#E6EEF0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <CompanyLogo mark={project.mark} />
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-[#E8EEF2] px-2.5 py-1 text-xs font-medium text-[#475569]">
                                            {project.careerTrack}
                                        </span>
                                        <span className="inline-flex max-w-[46%] items-center gap-1 truncate rounded-full bg-[#F6E7C8] px-2.5 py-1 text-xs font-medium text-[#8A6A2A]">
                                            <Building2 className="size-3 shrink-0" />
                                            <span className="truncate">{project.category}</span>
                                        </span>
                                    </div>
                                </div>

                                <h3 className="mt-4 line-clamp-1 text-base font-semibold text-[#0F172A]">
                                    {project.title}
                                </h3>
                                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#64748B]">
                                    {project.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-medium text-[#64748B]">
                                        <Calendar className="size-3.5" />
                                        {project.duration}
                                    </span>
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1.5 text-xs font-semibold",
                                            project.status === "Active"
                                                ? "text-[#16A34A]"
                                                : "text-[#0F172A]",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "size-1.5 rounded-full",
                                                project.status === "Active"
                                                    ? "bg-[#16A34A]"
                                                    : "bg-[#0F172A]",
                                            )}
                                            aria-hidden
                                        />
                                        {project.status}
                                    </span>
                                </div>

                                <Link
                                    href="/internship"
                                    className="mt-4 inline-flex h-11 items-center justify-center rounded-lg border border-[#156374] bg-[#E8EFF1] text-sm font-medium text-[#156374] transition hover:bg-[#dce7ea]"
                                >
                                    View project
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
