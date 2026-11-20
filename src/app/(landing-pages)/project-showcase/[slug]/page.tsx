import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectShowcaseDetail from "@/components/_core/landing-pages/project-showcase/project-details";
import {
  careerTrackToSlug,
  getShowcaseProject,
  SHOWCASE_PROJECTS,
} from "@/components/_core/landing-pages/project-showcase/data";

type ProjectShowcaseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    ...new Set(
      SHOWCASE_PROJECTS.map((project) => careerTrackToSlug(project.careerTrack)),
    ),
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectShowcaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getShowcaseProject(slug);

  return {
    title: project?.title ?? "Project",
    description: project?.description,
  };
}

export default async function ProjectShowcaseDetailPage({
  params,
}: ProjectShowcaseDetailPageProps) {
  const { slug } = await params;
  const project = getShowcaseProject(slug);
  if (!project) notFound();

  return <ProjectShowcaseDetail project={project} />;
}
