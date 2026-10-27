import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "../data";
import Project1 from "./images-fomation/project1";

const ProjectHero = ({ project }: { project: Project }) => {
    return (
        <section className="bg-[#F7FBFC] py-8 sm:py-12 lg:py-16 -translate-y-10">
            <div className="app-width">
                <Link
                    href="/home#client-impact"
                    className="inline-flex items-center gap-1.5 text-sm text-[#7A868C] transition-colors hover:text-[#092A31]"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </Link>
            </div>
            <div className="app-width grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                    <h1 className="mt-6 max-w-xl text-3xl leading-[1.15] font-bold tracking-tight text-[#101820] sm:text-4xl lg:text-[2.7rem]">
                        {project.title}
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-relaxed text-[#5E6A70]">
                        {project.description}
                    </p>

                    <Link
                        href="/auth/sign-up"
                        className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#F6D56A] py-1.5 pr-1.5 pl-5 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F3CC55]"
                    >
                        Join The Team
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#156374] text-white">
                            <ArrowUpRight className="size-4" />
                        </span>
                    </Link>
                </div>

                <Project1 />
            </div>
        </section>
    );
};

export default ProjectHero;
