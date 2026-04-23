"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, LinkIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewLinkModal } from "@/components/_core/dashboard/portfolio/view-link-modal";
import { ProjectCard } from "@/components/_core/dashboard/portfolio/template/bold/my-projects";
import type {
    OtherProjectLink,
    ViewProjectData,
} from "../classic/view-project-content-classic";

type ViewProjectContentBoldProps = {
    project: ViewProjectData;
    onEdit?: () => void;
    onDelete?: () => void;
    isDeletePending?: boolean;
    backHref?: string;
    backLabel?: string;
    otherProjects?: OtherProjectLink[];
};

function isPdfAsset(url: string): boolean {
    return url.toLowerCase().includes(".pdf");
}

function DetailCard({
    label,
    content,
}: {
    label: string;
    content?: string;
}) {
    if (!content) return null;
    return (
        <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#092A31]">
                {label}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{content}</p>
        </section>
    );
}

export function ViewProjectContentBold({
    project,
    onEdit,
    onDelete,
    isDeletePending = false,
    backHref = "/dashboard/portfolio",
    backLabel = "Back",
    otherProjects = [],
}: ViewProjectContentBoldProps) {
    const showActions = onEdit != null || onDelete != null;
    const [viewLinkOpen, setViewLinkOpen] = useState(false);
    const [activeLinkHref, setActiveLinkHref] = useState<string | undefined>(undefined);

    const openViewLinkModal = (href: string) => {
        setActiveLinkHref(href);
        setViewLinkOpen(true);
    };

    return (
        <div className="min-h-full bg-white p-5">
            <header className="flex items-center justify-between">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700"
                >
                    <ArrowLeft className="size-4" aria-hidden />
                    {backLabel}
                </Link>
                {showActions ? (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="rounded-lg bg-[#F1F5F9] text-zinc-700 hover:bg-zinc-200 border-0"
                            onClick={onEdit}
                        >
                            <Pencil className="mr-2 size-4" aria-hidden />
                            Edit project
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="rounded-full bg-[#FDECEC] text-[#EF4444] cursor-pointer hover:bg-red-50 hover:text-red-600 border border-[#FAC5C5] size-9 disabled:opacity-60"
                            aria-label="Delete project"
                            disabled={isDeletePending}
                            onClick={onDelete}
                        >
                            <Trash2 className="size-4" aria-hidden />
                        </Button>
                    </div>
                ) : null}
            </header>
            <div className="space-y-8">
                <section className="mt-6 overflow-hidden rounded-xl">
                    <div className="relative h-52 w-full bg-[#E8EFF1] md:h-64">
                        {project.coverImageUrl ? (
                            <img
                                src={project.coverImageUrl}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-500">
                                No cover image
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/35" />
                        <div className="absolute inset-x-0 bottom-6 px-6">
                            <h1 className="text-2xl font-semibold text-white md:text-3xl">
                                {project.title}
                            </h1>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {project.category ? (
                                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#092A31]">
                                        {project.category}
                                    </span>
                                ) : null}
                                {project.duration ? (
                                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#092A31]">
                                        {project.duration}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-5 flex gap-4 flex-col md:flex-row">
                    <div className="flex-1 p-4 bg-[#F8FAFC] rounded-xl">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#092A31]">
                            Project overview
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                            {project.overview || "No overview added."}
                        </p>
                        {project.tools && project.tools.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {project.tools.map((tool) => (
                                    <span
                                        key={tool.name}
                                        className="rounded-full bg-[#F3F7F9] px-3 py-1 text-xs font-medium text-[#36515F]"
                                    >
                                        {tool.name}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <aside className="flex-1 rounded-xl bg-[#F7FAFC] p-4">
                        <section>
                            <h2 className="text-lg font-semibold text-[#092A31] mb-4">
                                Additional link
                            </h2>
                            <div className="space-y-3">
                                {project.solutionUrl ? (
                                    <button
                                        type="button"
                                        onClick={() => openViewLinkModal(project.solutionUrl!)}
                                        className="rounded-lg w-full bg-[#E8EFF1] px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#dde8eb] transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    >
                                        <div className="min-w-0 flex-1 text-left">
                                            <div className="text-sm font-medium text-[#092A31]">
                                                Solution URL
                                            </div>
                                            <p
                                                className="text-sm text-primary mt-1 break-all sm:wrap-break-word line-clamp-2 group-hover:underline"
                                                title={project.solutionUrl}
                                            >
                                                {project.solutionUrl}
                                            </p>
                                        </div>
                                        <span
                                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary bg-[#EBF3FE] border border-[#C2D8FC]"
                                            aria-hidden
                                        >
                                            <LinkIcon className="size-4" />
                                        </span>
                                    </button>
                                ) : (
                                    <div className="rounded-lg bg-[#E8EFF1] px-4 py-3 flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <span className="text-sm font-medium text-[#092A31]">
                                                Solution URL
                                            </span>
                                            <p className="text-sm text-zinc-400 mt-1">—</p>
                                        </div>
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-400">
                                            <LinkIcon className="size-4" />
                                        </span>
                                    </div>
                                )}
                                {project.mediaUrl ? (
                                    <button
                                        type="button"
                                        onClick={() => openViewLinkModal(project.mediaUrl!)}
                                        className="rounded-lg w-full bg-[#E8EFF1] px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#dde8eb] transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    >
                                        <div className="min-w-0 flex-1 text-left">
                                            <div className="text-sm font-medium text-[#092A31]">
                                                Media URL
                                            </div>
                                            <p
                                                className="text-sm text-primary mt-1 break-all sm:wrap-break-word line-clamp-2 group-hover:underline"
                                                title={project.mediaUrl}
                                            >
                                                {project.mediaUrl}
                                            </p>
                                        </div>
                                        <span
                                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary bg-[#EBF3FE] border border-[#C2D8FC]"
                                            aria-hidden
                                        >
                                            <LinkIcon className="size-4" />
                                        </span>
                                    </button>
                                ) : (
                                    <div className="rounded-lg bg-[#E8EFF1] px-4 py-3 flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <span className="text-sm font-medium text-[#092A31]">
                                                Media URL
                                            </span>
                                            <p className="text-sm text-zinc-400 mt-1">—</p>
                                        </div>
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-400">
                                            <LinkIcon className="size-4" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </aside>
                </section>

                <section className="mt-4 grid gap-4 md:grid-cols-2">
                    <DetailCard label="Problem & context" content={project.problem} />
                    <DetailCard label="Role & responsibilities" content={project.role} />
                </section>

                {project.summary ? (
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#092A31]">
                            Project summary
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                            {project.summary}
                        </p>
                    </section>
                ) : null}

                {project.features && project.features.length > 0 ? (
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#092A31]">
                            Key features & highlights
                        </h2>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-600">
                            {project.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                <section className="mt-4 grid gap-4 md:grid-cols-2">
                    <DetailCard
                        label="Challenges & solutions"
                        content={project.challengesAndSolutions}
                    />
                    <DetailCard label="Outcome & impact" content={project.impactAndOutcomes} />
                </section>

                {project.durationBreakdown ? (
                    <section className="mt-4">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#092A31]">
                            Project timeline
                        </h2>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
                            {project.durationBreakdown}
                        </p>
                    </section>
                ) : null}

                {project.projectImages && project.projectImages.length > 0 ? (
                    <section className="mt-4 space-y-2">
                        {project.projectImages.map((imageUrl, index) => (
                            <div
                                key={`${imageUrl}-${index}`}
                                className="overflow-hidden rounded-xl border border-zinc-200 bg-[#F8FAFC]"
                            >
                                {isPdfAsset(imageUrl) ? (
                                    <a
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-44 w-full flex-col items-center justify-center gap-2 bg-[#E8EFF1] px-4 text-center text-zinc-600 hover:bg-[#dde8eb] transition-colors"
                                    >
                                        <FileText className="size-8 text-primary" aria-hidden />
                                        <span className="text-sm font-medium">PDF document</span>
                                        <span className="text-xs font-medium text-primary underline underline-offset-2">
                                            Click to read
                                        </span>
                                    </a>
                                ) : (
                                    <img src={imageUrl} alt="" className="max-h-105 w-full object-cover" />
                                )}
                            </div>
                        ))}
                    </section>
                ) : null}

                {otherProjects.length > 0 ? (
                    <section className="mt-10" aria-label="Other projects">
                        <h2 className="mb-4 text-sm font-semibold text-[#092A31]">More projects</h2>
                        <div className="grid gap-3 md:grid-cols-3">
                            {otherProjects.map((item) => (
                                <div key={item.href} className="min-w-0 w-full">
                                    <ProjectCard
                                        project={{
                                            id: item.href,
                                            title: item.title,
                                            imageUrl: item.coverImageUrl,
                                            tags: item.tag ? [item.tag] : undefined,
                                        }}
                                        href={item.href}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>


            <ViewLinkModal
                open={viewLinkOpen}
                onOpenChange={setViewLinkOpen}
                href={activeLinkHref}
            />
        </div>
    );
}

export default ViewProjectContentBold;
