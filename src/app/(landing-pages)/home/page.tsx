"use client";

import HeroThree from "@/components/_core/landing-pages/home/hero-three";
import TheImpact from "@/components/_core/landing-pages/home/the-impact";
import InsideAmdari from "@/components/_core/landing-pages/home/inside-amdari";
import ProjectExperience from "@/components/_core/landing-pages/home/projects-experience";
import BecomeAPartner from "@/components/_core/landing-pages/home/become-a-partner";
import AboutUs from "@/components/_core/landing-pages/home/about";
import TheCompanies from "@/components/_core/landing-pages/home/the-companies";

const InternShipProgram = () => {
  return (
    <div>
      <HeroThree />
      <TheImpact />
      <InsideAmdari />
      <TheCompanies />
      <ProjectExperience />
      <BecomeAPartner />
      <AboutUs />
    </div>
  );
};

export default InternShipProgram;
