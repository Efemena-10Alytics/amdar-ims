import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectHero from "@/components/_core/landing-pages/home/project-details/hero";
import Challenges from "@/components/_core/landing-pages/home/project-details/challenges";
import Approach from "@/components/_core/landing-pages/home/project-details/approach";
import JoinTheTeam from "@/components/_core/landing-pages/home/project-details/join-the-team";
import BusinessImpact from "@/components/_core/landing-pages/home/project-details/business-impact";
import Highlights from "@/components/_core/landing-pages/home/project-details/hightlights";
import Capabilities from "@/components/_core/landing-pages/home/project-details/capabilities";
import Solve from "@/components/_core/landing-pages/home/project-details/solve";
import { getProject } from "@/components/_core/landing-pages/home/project-details/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <>
      <ProjectHero project={project} />
      <Challenges project={project} />
      <Approach project={project} />
      <JoinTheTeam project={project} />
      <BusinessImpact project={project} />
      <Highlights project={project} />
      <Capabilities project={project} />
      <Solve project={project} />
    </>
  );
}
