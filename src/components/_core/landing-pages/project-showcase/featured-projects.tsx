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
import { CompanyLogo } from "./company-logo";
import { SHOWCASE_PROJECTS } from "./data";

const PROJECTS = SHOWCASE_PROJECTS;

const CAREER_TRACKS = [...new Set(PROJECTS.map((project) => project.careerTrack))];
const CATEGORIES = [...new Set(PROJECTS.map((project) => project.category))];

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
                                    href={`/project-showcase/${project.id}`}
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
