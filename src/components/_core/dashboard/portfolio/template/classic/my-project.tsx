"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Aos from "aos";

const HOVER_IMAGE = "/images/pngs/project-hover.png";

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
  showAddProject?: boolean;
  id?: string;
  /** Public portfolio owner id — enables links to `/portfolio/{id}/{projectId}`. */
  publicPortfolioUserId?: string;
};

export function MyProjects({
  projects = [],
  onAddProject,
  onProjectClick,
  showAddProject,
  id,
  publicPortfolioUserId,
}: MyProjectsProps) {
  useEffect(() => {
    Aos.init()
  }, [])
  return (
    <section id={id} data-aos="fade-up" className="mt-20 relative" aria-label="My projects">
      <CardClipPathDef />
      <div className="text-xl font-semibold text-[#A1A8B1] b mb-4">
        My projects
      </div>
      <div className="grid xl:grid-cols-3 gap-4 pb-2">
        {projects.map((project, index) => (
          <div key={project.id ?? index} className="min-w-0 w-full">
            <ProjectCard
              project={project}
              onClick={() => onProjectClick?.(project)}
              showAddProject={showAddProject}
              publicPortfolioUserId={publicPortfolioUserId}
            />
          </div>
        ))}
        {showAddProject && (
          <div className="min-w-0 w-full">
            <AddProjectCard onAdd={onAddProject} />
          </div>
        )}
      </div>
    </section>
  );
}

/** Card: uses snippet clip-path (150×200, arcs at corners and left); title below; tag/button overlap edge */
function ProjectCard({
  project,
  onClick,
  showAddProject,
  publicPortfolioUserId,
}: {
  project: ProjectItem;
  onClick?: () => void;
  showAddProject?: boolean;
  publicPortfolioUserId?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const displayImage = isHovered ? HOVER_IMAGE : project.imageUrl;

  const hasProjectId =
    project.id != null && String(project.id).trim() !== "";

  const viewHref =
    showAddProject && hasProjectId
      ? `/dashboard-dev/portfolio/add-project/${encodeURIComponent(String(project.id))}`
      : publicPortfolioUserId && hasProjectId
        ? `/portfolio/${encodeURIComponent(publicPortfolioUserId)}/${encodeURIComponent(String(project.id))}`
        : undefined;

  const actionClassName = cn(
    "absolute bottom-2 right-2 flex size-9 items-center justify-center gap-1.5 rounded-full shadow-md transition-colors z-20 pointer-events-none",
    isHovered
      ? "bg-amdari-yellow text-[#092A31] px-4 h-9"
      : "bg-primary text-white size-9",
  );

  const cardContent = (
    <>
      <div className="relative h-60 w-full min-w-0">
        <div
          className="absolute inset-0 overflow-hidden bg-[#E8EFF1] transition-opacity shadow-sm"
          style={{ clipPath: `url(#${CARD_CLIP_PATH_ID})` }}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
              No image
            </div>
          )}
        </div>
        {/* Action indicator: bottom right, outside clip so it always shows */}
        <span
          className={actionClassName}
          aria-hidden
        >
          {isHovered ? (
            <span className="text-[6px] font-medium">View</span>
          ) : (
            <ArrowUpRight className="size-4" aria-hidden />
          )}
        </span>
      </div>
      {/* Tags: top right, outside clip so they always show */}
      {project.tags && project.tags.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-wrap gap-1.5 justify-end z-20 pointer-events-none">
          {project.tags.slice(0, 2).map((tag) => (
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
      <span className="mt-2 text-left font-semibold block text-[#092A31] text-sm truncate">
        {project.title}
      </span>
    </>
  );

  if (viewHref) {
    return (
      <Link
        href={viewHref}
        className="relative block w-full min-w-0 overflow-visible focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        aria-label={`View ${project.title}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="relative block w-full min-w-0 overflow-visible text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      aria-label={`View ${project.title}`}
    >
      {cardContent}
    </button>
  );
}

function AddProjectCard({ onAdd }: { onAdd?: () => void }) {
  return (
    <Link href="/dashboard-dev/portfolio/add-project">
      <button
        type="button"
        onClick={onAdd}
        className="relative block w-full min-w-0 overflow-visible text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
        aria-label="Add project"
      >
        <div className="relative h-60 w-full">
          <div
            className="absolute inset-0 overflow-hidden  bg-[#E8EFF1] shadow-sm flex flex-col items-center justify-center text-zinc-400 hover:scale-95 hover:text-zinc-300 transition-all"
            style={{ clipPath: `url(#${CARD_CLIP_PATH_ID})` }}
          >
            <span className="text-sm font-medium">Add project here</span>
          </div>
          {/* Action button: bottom right, outside clip so it always shows */}
          <span
            className="absolute bottom-2 right-2 z-20 flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-md pointer-events-none"
            aria-hidden
          >
            <Plus className="size-4" />
          </span>
          {/* Top right tag, outside clip so it always shows */}
          <span className="absolute top-2 right-2 z-20 rounded-full bg-[#E8EFF1] px-2.5 py-1 text-xs font-medium text-primary shadow-sm pointer-events-none">
            Your project
          </span>
        </div>
        {/* Spacer so height matches ProjectCard (title area) */}
        <span className="mt-2 block h-5 text-transparent text-sm" aria-hidden>
          —
        </span>
      </button>
    </Link>
  );
}
