"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { initClassicAos } from "../classic/init-classic-aos";

export type BoldProjectItem = {
  id?: string;
  title: string;
  tags?: string[];
  imageUrl?: string;
};

type MyProjectsProps = {
  projects?: BoldProjectItem[];
  id?: string;
  onAddProject?: () => void;
  showAddProject?: boolean;
  publicPortfolioUserId?: string;
};

export function MyProjects({
  projects = [],
  id,
  onAddProject,
  showAddProject = false,
  publicPortfolioUserId,
}: MyProjectsProps) {
  useEffect(() => {
    initClassicAos();
  }, []);

  if (projects.length === 0 && !showAddProject) return null;
  return (
    <section id={id} className="mt-20" aria-label="My projects">
      <h3
        data-aos="fade-up"
        className="text-xl font-semibold tracking-tight text-[#A1A8B1]"
      >
        My projects
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id ?? `${project.title}-${index}`}
            project={project}
            dataAosDelay={Math.min(index * 120, 360)}
            showAddProject={showAddProject}
            publicPortfolioUserId={publicPortfolioUserId}
          />
        ))}

        {showAddProject && (
          <AddProjectCard
            dataAosDelay={Math.min(projects.length * 120, 360)}
            onAdd={onAddProject}
          />
        )}
      </div>
    </section>
  );
}

export function ProjectCard({
  project,
  href,
  showAddProject,
  publicPortfolioUserId,
  dataAosDelay,
}: {
  project: BoldProjectItem;
  href?: string;
  showAddProject?: boolean;
  publicPortfolioUserId?: string;
  dataAosDelay?: number;
}) {
  const hasProjectId = project.id != null && String(project.id).trim() !== "";
  const viewHref =
    href ??
    (showAddProject && hasProjectId
      ? `/dashboard/portfolio/add-project/${encodeURIComponent(String(project.id))}`
      : publicPortfolioUserId && hasProjectId
        ? `/p/${encodeURIComponent(publicPortfolioUserId)}/${encodeURIComponent(String(project.id))}`
        : undefined);
  const isClickable = Boolean(viewHref);
  const aosProps =
    dataAosDelay !== undefined
      ? {
          "data-aos": "fade-up" as const,
          "data-aos-delay": dataAosDelay,
        }
      : {};

  const cardContent = (
    <>
      <div className="relative h-44 w-full overflow-hidden bg-[#E8EFF1]">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#64748B]">
            No image
          </div>
        )}

        {isClickable && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#F4D96A] text-[10px] font-medium text-[#092A31] shadow-md">
              View
            </span>
          </div>
        )}
      </div>

      <h4 className="mt-2 truncate text-xl font-semibold text-[#092A31]">
        {project.title}
      </h4>

      {project.tags && project.tags.length > 0 && (
        <p className="text-sm text-[#64748B]">
          {project.tags.slice(0, 2).join("  ·  ")}
        </p>
      )}
    </>
  );

  if (viewHref) {
    return (
      <Link
        href={viewHref}
        {...aosProps}
        className="group block min-w-0"
        aria-label={`View ${project.title}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <article
      {...aosProps}
      className="min-w-0"
    >
      {cardContent}
    </article>
  );
}

function AddProjectCard({
  onAdd,
  dataAosDelay,
}: {
  onAdd?: () => void;
  dataAosDelay?: number;
}) {
  return (
    <article
      data-aos="fade-up"
      data-aos-delay={dataAosDelay}
      className="min-w-0"
    >
      <Link href="/dashboard/portfolio/add-project">
        <button
          type="button"
          onClick={onAdd}
          className="group h-full w-full text-left"
          aria-label="Add project"
        >
          <div className="flex h-44 w-full flex-col items-center justify-center gap-3 bg-[#E8EFF1] transition-colors group-hover:bg-[#DFE7EA]">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
              <Plus className="size-4" />
            </span>
            <span className="text-sm font-medium text-[#6B7D98]">Add project here</span>
          </div>
          <span className="mt-2 block h-7 text-sm text-transparent" aria-hidden>
            —
          </span>
        </button>
      </Link>
    </article>
  );
}

export default MyProjects;
