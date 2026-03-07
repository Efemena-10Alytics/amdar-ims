"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Link2, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewProjectData = {
  title: string;
  tags?: string[];
  coverImageUrl?: string;
  overview?: string;
  tools?: { name: string; iconUrl?: string }[];
  rationale?: string;
  aim?: string;
  solutionUrl?: string;
  mediaLink?: string;
};

type ViewProjectContentProps = {
  project: ViewProjectData;
  onEdit?: () => void;
  onDelete?: () => void;
};

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
}: ViewProjectContentProps) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="flex items-center justify-between w-full border-b border-zinc-200 bg-white py-4">
        <Link
          href="/dashboard-dev/portfolio"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>
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
            className="rounded-full bg-[#FDECEC] text-[#EF4444] cursor-pointer hover:bg-red-50 hover:text-red-600 border border-[#FAC5C5] size-9"
            aria-label="Delete project"
            onClick={onDelete}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </header>

      {/* Hero banner */}
      <div className="relative w-full aspect-21/9 min-h-50 bg-[#E8EFF1] rounded-2xl overflow-hidden">
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
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#E8EFF1] px-3 py-1 text-sm text-center flex justify-center items-center font-medium text-primary h-10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two columns */}
      <div className="flex-1 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
        {/* Left column */}
        <div className="space-y-8">
          {project.overview && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">Overview</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.overview}
              </p>
            </section>
          )}

          {project.tools && project.tools.length > 0 && (
            <div className="flex flex-wrap gap-3">
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

          {project.rationale && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                Project rationale
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.rationale}
              </p>
            </section>
          )}

          {project.aim && (
            <section>
              <h2 className="text-lg font-semibold text-[#092A31] mb-3">
                Aim of project
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.aim}
              </p>
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
              <div className="rounded-lg bg-[#E8EFF1] px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[#092A31]">
                  Solution URL
                </span>
                {project.solutionUrl ? (
                  <a
                    href={project.solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary bg-[#EBF3FE] border border-[#C2D8FC] transition-colors"
                    aria-label="Open solution URL"
                  >
                    <LinkIcon className="size-4" />
                  </a>
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-400">
                    <LinkIcon className="size-4" />
                  </span>
                )}
              </div>
              <div className="rounded-lg bg-[#E8EFF1] px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[#092A31]">
                  Media link
                </span>
                {project.mediaLink ? (
                  <a
                    href={project.mediaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary bg-[#EBF3FE] border border-[#C2D8FC] transition-colors"
                    aria-label="Open media link"
                  >
                    <LinkIcon className="size-4" />
                  </a>
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-400">
                    <LinkIcon className="size-4" />
                  </span>
                )}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
