"use client";

import { ArrowUpRight, Plus } from "lucide-react";

/** Clip-path for card shape (folder-style). Uses objectBoundingBox so it scales with element width/height. */
const CARD_CLIP_PATH_ID = "project-card-clip";

function CardClipPathDef() {
  return (
    <svg aria-hidden className="absolute size-0" focusable="false">
      <defs>
        <clipPath id={CARD_CLIP_PATH_ID} clipPathUnits="objectBoundingBox">
          {/* Folder-style: tab on right; similar rounded notch at bottom-right */}
          <path d="M 0.9333,0.16 L 0.6,0.16 A 0.0667,0.08 0,0,1 0.533,0.08 A 0.0667,0.08 0,0,0 0.467,0 L 0.067,0 A 0.0667,0.05 0,0,0 0,0.05 L 0,0.95 A 0.0667,0.05 0,0,0 0.067,1 L 0.82,1 A 0.0667,0.10 0,0,0 0.867,0.88 A 0.0667,0.10 0,0,1 0.913,0.76 L 0.9333,0.76 L 1,0.76 L 1,0.22 A 0.0667,0.06 0,0,0 0.9333,0.16 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export type ProjectItem = {
  id?: string;
  imageUrl?: string;
  title: string;
  tags?: string[];
};

type MyProjectsProps = {
  projects?: ProjectItem[];
  onAddProject?: () => void;
  onProjectClick?: (project: ProjectItem) => void;
};

export function MyProjects({
  projects = [],
  onAddProject,
  onProjectClick,
}: MyProjectsProps) {
  return (
    <section className="mt-10 relative" aria-label="My projects">
      <CardClipPathDef />
      <h2 className="text-sm font-medium text-zinc-500 mb-4">My projects</h2>
      <div className="grid xl:grid-cols-3 gap-4 pb-2">
        {projects.map((project, index) => (
          <div key={project.id ?? index} className="min-w-0 w-full">
            <ProjectCard
              project={project}
              onClick={() => onProjectClick?.(project)}
            />
          </div>
        ))}
        <div className="min-w-0 w-full">
          <AddProjectCard onAdd={onAddProject} />
        </div>
      </div>
    </section>
  );
}

/** Card: uses snippet clip-path (150×200, arcs at corners and left); title below; tag/button overlap edge */
function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectItem;
  onClick?: () => void;
}) {
  return (
    <article className="relative block w-full min-w-0 overflow-visible">
      <div className="relative h-60 w-full min-w-0">
        <div
          className="absolute inset-0 overflow-hidden bg-zinc-900 shadow-sm"
          style={{ clipPath: `url(#${CARD_CLIP_PATH_ID})` }}
        >
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
              No image
            </div>
          )}
        </div>
        {/* Action: bottom right, outside clip so it always shows */}
        <button
          type="button"
          onClick={onClick}
          className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-md transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-20"
          aria-label={`View ${project.title}`}
        >
          <ArrowUpRight className="size-4" aria-hidden />
        </button>
      </div>
      {/* Tags: top right, outside clip so they always show */}
      {project.tags && project.tags.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-wrap gap-1.5 justify-end z-20 pointer-events-none">
          {project.tags.slice(0,2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#E8EFF1] px-2.5 py-1 text-xs font-medium text-primary shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* Title: below the image container, left-aligned, bold dark */}
      <h3 className="mt-2 text-left font-bold text-zinc-900 text-sm truncate">
        {project.title}
      </h3>
    </article>
  );
}

function AddProjectCard({ onAdd }: { onAdd?: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="relative block w-full min-w-0 overflow-visible text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
      aria-label="Add project"
    >
      {/* Same shape as ProjectCard: clip-path, 150×200, dark bg */}
      <div
        className="relative h-60 w-full overflow-hidden bg-zinc-900 shadow-sm flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
        style={{ clipPath: `url(#${CARD_CLIP_PATH_ID})` }}
      >
        <span className="absolute -top-10 right-10 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-900 shadow-sm group-hover:bg-primary/10 group-hover:text-primary">
          Your project
        </span>
        <span className="text-sm font-medium">Add project here</span>
        <span className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-md transition-opacity group-hover:opacity-90">
          <Plus className="size-4" aria-hidden />
        </span>
      </div>
      {/* Spacer so height matches ProjectCard (title area) */}
      <span className="mt-2 block h-5 text-transparent text-sm" aria-hidden>
        —
      </span>
    </button>
  );
}
