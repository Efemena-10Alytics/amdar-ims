import type { Metadata } from "next";
import FeaturedProjects from "@/components/_core/landing-pages/project-showcase/featured-projects";
import HiredCompanies from "@/components/_core/landing-pages/project-showcase/hired-companies";
import ProjectShowcaseHero from "@/components/_core/landing-pages/project-showcase/hero";

const PAGE_TITLE = "Work on Projects That Build Your Career";
const PAGE_DESCRIPTION =
  "Gain practical experience on real business projects in data, cybersecurity, and more. Build your portfolio and prepare for the workplace with Amdari.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
  },
};

export default function ProjectShowcasePage() {
  return (
    <>
      <ProjectShowcaseHero />
      <FeaturedProjects />
      <HiredCompanies />
    </>
  );
}
