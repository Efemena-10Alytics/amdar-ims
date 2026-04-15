"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, LinkIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewLinkModal } from "@/components/_core/dashboard/portfolio/view-link-modal";
import {
  CardClipPathDef,
  ProjectCard,
} from "@/components/_core/dashboard/portfolio/template/classic/my-project";
import { getImageUrl } from "@/lib/utils";
import type { UserPortfolioProjectDetail } from "@/features/portfolio/use-get-project-by-id";
import type { UserPortfolioProject } from "@/features/portfolio/use-get-portfolio";

/** Card linking to another project in the same portfolio (built by the page). */
export type OtherProjectLink = {
  href: string;
  title: string;
  coverImageUrl?: string;
  tag?: string;
};

export type ViewProjectData = {
  title: string;
  category?: string;
  coverImageUrl?: string;
  duration?: string;
  overview?: string;
  tools?: { name: string; iconUrl?: string }[];
  summary?: string;
  problem?: string;
  role?: string;
  features?: string[];
  challengesAndSolutions?: string;
  impactAndOutcomes?: string;
  durationBreakdown?: string;
  projectImages?: string[];
  solutionUrl?: string;
  mediaUrl?: string;
};

type ViewProjectContentProps = {
  project: ViewProjectData;
  onEdit?: () => void;
  onDelete?: () => void;
  /** Disables delete control while a delete request is in flight. */
  isDeletePending?: boolean;
  /** Back link target (default: dashboard portfolio). */
  backHref?: string;
  backLabel?: string;
  /** Shown below the main content when non-empty. */
  otherProjects?: OtherProjectLink[];
};

/** Matches list/detail URLs when the API omits `id`. */
export function stableProjectListId(
  p: UserPortfolioProject,
  index: number,
): string {
  if (p.id != null && String(p.id).trim() !== "") return String(p.id);
  return String(p.coverImage ?? p.title ?? index);
}

export function mapProjectToViewData(
  data: UserPortfolioProjectDetail,
): ViewProjectData {
  const category = data.category?.trim();
  return {
    title: data.title?.trim() || "Untitled",
    category: category ? category : undefined,
    coverImageUrl: getImageUrl(data.coverImage) || undefined,
    duration: data.duration?.trim() || undefined,
    overview: data.overview?.trim() || undefined,
    tools: (data.tools ?? [])
      .map((t) => {
        const name = (t.title ?? t.name)?.trim();
        if (!name) return null;
        const iconUrl = getImageUrl(t.image ?? t.url ?? undefined) || undefined;
        return { name, ...(iconUrl && { iconUrl }) };
      })
      .filter((t): t is { name: string; iconUrl?: string } => t != null),
    summary: data.summary?.trim() || undefined,
    problem: data.problem?.trim() || undefined,
    role: data.role?.trim() || undefined,
    features: data.features?.filter(Boolean) || undefined,
    challengesAndSolutions: data.challengesAndSolutions?.trim() || undefined,
    impactAndOutcomes: data.impactAndOutcomes?.trim() || undefined,
    durationBreakdown: data.durationBreakdown?.trim() || undefined,
    projectImages: (data.projectFiles ?? [])
      .map((img) => getImageUrl(img))
      .filter((img): img is string => !!img),
    solutionUrl: data.solutionUrl?.trim() || undefined,
    mediaUrl: data.mediaUrl?.trim() || undefined,
  };
}

function isPdfAsset(url: string): boolean {
  return url.toLowerCase().includes(".pdf");
}

const TOOL_ICONS: Record<string, string> = {
  Figma: "/images/svgs/tools/figma.svg",
  Trello: "/images/svgs/tools/trello.svg",
  Photoshop: "/images/svgs/tools/photoshop.svg",
  Sketch: "/images/svgs/tools/sketch.svg",
  Jira: "/images/svgs/tools/jira.svg",
  Canva: "/images/svgs/tools/canva.svg",
  "Adobe illustration": "/images/svgs/tools/adobe-illustrator.svg",
  "Light room": "/images/svgs/tools/light-room.svg",
  Ubuntu: "/images/svgs/tools/ubuntu.svg",
  "Sales force": "/images/svgs/tools/sales-force.svg",
};

export function ViewProjectContent({
  project,
  onEdit,
  onDelete,
  isDeletePending = false,
  backHref = "/dashboard/portfolio",
  backLabel = "Back",
  otherProjects = [],
}: ViewProjectContentProps) {
  const showActions = onEdit != null || onDelete != null;
  const [viewLinkOpen, setViewLinkOpen] = useState(false);
  const [activeLinkHref, setActiveLinkHref] = useState<string | undefined>(undefined);

  const openViewLinkModal = (href: string) => {
    setActiveLinkHref(href);
    setViewLinkOpen(true);
  };

  return (
    <div className="min-h-full flex flex-col p-5">
      <header className="flex items-center justify-between w-full border-b border-zinc-200 bg-white py-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
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
              <Pencil className="size-4 mr-2" aria-hidden />
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

      {/* Hero banner */}
      <div className="relative w-full aspect-3/1 max-h-44 sm:max-h-100 bg-[#E8EFF1] rounded-2xl overflow-hidden">
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full rounded-2xl object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl text-zinc-500">
            No cover image
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.category && (
              <span
                className="rounded-full bg-[#E8EFF1] px-3 py-1 text-sm text-center flex justify-center items-center font-medium text-primary h-10"
              >
                {project.category}
              </span>
            )}
            {project.duration && (
              <span
                className="rounded-full min-w-25 bg-[#E8EFF1] px-3 py-1 text-sm text-center flex justify-center items-center font-medium text-primary h-10"
              >
                {project.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="flex-1 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
        {/* Left column */}
        <div className="space-y-8">
          <div>

            {project.overview && (
              <section>
                <h2 className="text-lg font-semibold text-[#092A31] mb-3 uppercase">Project Overview</h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {project.overview}
                </p>
              </section>
            )}
            {project.tools && project.tools.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {project.tools.map((tool) => {
                  const iconSrc = tool.iconUrl ?? TOOL_ICONS[tool.name];
                  return (
                    <span
                      key={tool.name}
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm overflow-hidden"
                      title={tool.name}
                    >
                      {iconSrc ? (
                        <img
                          src={iconSrc}
                          alt=""
                          className="size-6 object-contain"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-zinc-500">
                          {tool.name.charAt(0)}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </div>


          {project.summary && (
            <section>
              <h2 className="text-lg uppercase font-semibold text-[#092A31] mb-3">
               Project Summary
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.summary}
              </p>
            </section>
          )}

          {project.problem && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                PROBLEM & CONTEXT
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.problem}
              </p>
            </section>
          )}

          {project.role && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                ROLE & RESPONSIBILITIES
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.role}
              </p>
            </section>
          )}

          {project.features && project.features.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                KEY FEATURES & HIGHLIGHTS
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 leading-relaxed">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          {project.challengesAndSolutions && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                CHALLENGES & SOLUTIONS
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.challengesAndSolutions}
              </p>
            </section>
          )}

          {project.impactAndOutcomes && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                OUTCOME & IMPACT
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.impactAndOutcomes}
              </p>
            </section>
          )}

          {project.durationBreakdown && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                PROJECT TIMELINE
              </h2>
              <p className="text-sm capitalize text-zinc-600 leading-relaxed whitespace-pre-line">
                {project.durationBreakdown}
              </p>
            </section>
          )}

          {project.projectImages && project.projectImages.length > 0 && (
            <section>
              {/* <h2 className="text-lg font-semibold text-[#092A31] mb-4">
                Project images
              </h2> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.projectImages.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-[#F8FAFC]"
                  >
                    {isPdfAsset(imageUrl) ? (
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-56 w-full flex-col items-center justify-center gap-3 bg-[#E8EFF1] px-4 text-center text-zinc-600 hover:bg-[#dde8eb] transition-colors"
                      >
                        <FileText className="size-10 text-primary" aria-hidden />
                        <span className="max-w-full truncate text-sm font-medium">
                          PDF document
                        </span>
                        <span className="text-xs font-medium text-primary underline underline-offset-2">
                          Click to read
                        </span>
                      </a>
                    ) : (
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-56 w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}


        </div>

        {/* Right column - Additional link */}
        <aside className="lg:pt-0">
          <section>
            <h2 className="text-lg font-semibold text-[#092A31] mb-4">
              Additional link
            </h2>
            <div className="space-y-3">
              {project.solutionUrl ? (
                <button
                  type="button"
                  onClick={() => openViewLinkModal(project.solutionUrl!)}
                  className="rounded-lg bg-[#E8EFF1] px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#dde8eb] transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
                  className="rounded-lg bg-[#E8EFF1] px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#dde8eb] transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
      </div>

      {otherProjects.length > 0 ? (
        <section
          className="mt-14 pt-10 border-t border-zinc-200 relative"
          aria-label="Other projects"
        >
          <CardClipPathDef />
          <h2 className="text-lg font-semibold text-[#092A31] mb-6">
            Other projects
          </h2>
          <div className="grid xl:grid-cols-3 gap-4 pb-2">
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
      <ViewLinkModal
        open={viewLinkOpen}
        onOpenChange={setViewLinkOpen}
        href={activeLinkHref}
      />
    </div>
  );
}
