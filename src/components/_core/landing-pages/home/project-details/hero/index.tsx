import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DEFAULT_PROJECT_IMAGE, type Project } from "../data";
import Project1 from "./images-fomation/project1";

const ProjectHero = ({ project }: { project: Project }) => {
    const image = project.image || DEFAULT_PROJECT_IMAGE;

    return (
        <section className="bg-[#F7FBFC] py-8 sm:py-12 lg:py-16 -translate-y-10">
            <div className="app-width">
                <Link
                    href="/home"
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

                    {project.metric ? (
                        <p className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#F6E3A1] px-5 py-2.5">
                            <span className="text-lg font-bold text-[#1A1A1A]">
                                {project.metric.value}
                            </span>
                            <span className="text-sm text-[#6B7280]">
                                {project.metric.label}
                            </span>
                        </p>
                    ) : null}
                </div>

                {project.id === "bottom-line-impact" ? (
                    <Project1 />
                ) : (
                    <Image
                        src={image}
                        alt=""
                        width={560}
                        height={440}
                        priority
                        className="h-auto w-full rounded-[28px]"
                    />
                )}
            </div>
        </section>
    );
};

export default ProjectHero;
