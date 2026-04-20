"use client";

import { useEffect } from "react";
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
};

export function MyProjects({ projects = [], id }: MyProjectsProps) {
  useEffect(() => {
    initClassicAos();
  }, []);

  if (projects.length === 0) return null;

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
          <article
            key={project.id ?? `${project.title}-${index}`}
            data-aos="fade-up"
            data-aos-delay={Math.min(index * 120, 360)}
            className="min-w-0"
          >
            <div className="h-44 w-full overflow-hidden bg-[#E8EFF1]">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#64748B]">
                  No image
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
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyProjects;
