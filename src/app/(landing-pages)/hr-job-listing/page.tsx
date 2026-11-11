import type { Metadata } from "next";
import TeamGallery from "@/components/_core/landing-pages/about/team-gallery";
import CoreValues from "@/components/_core/landing-pages/hr-job-listing/core-values";
import HrJobListingHero from "@/components/_core/landing-pages/hr-job-listing/hero";
import JobOpenings from "@/components/_core/landing-pages/hr-job-listing/job-openings";

export const metadata: Metadata = {
  title: "Careers at Amdari | Join Our Team",
  description:
    "Explore open roles at Amdari and build the future with a team focused on data, innovation and real-world impact.",
};

const HrJobListingPage = () => {
  return (
    <div>
      <HrJobListingHero />
      <JobOpenings />
      <CoreValues />
      <TeamGallery />
    </div>
  );
};

export default HrJobListingPage;
