"use client";

import FeatureSplitSection from "../internship-program/feature-split-section";
import ProjectSlide from "../internship-program/project-slide";

const ABOUT_DESCRIPTION =
  "At Amdari, we know what it's like to navigate the modern job market, it's complex, competitive, and often overwhelming. That's why we built Amdari, a platform created by professionals who've walked the same path and understand the real challenges of getting hired today. We believe that opportunities should be accessible to everyone willing to put in the work.";

const ABOUT_SLIDE_ITEMS = [
  "Interview Preps",
  "Mentorship session",
  "Portfolio building",
  "CV Revamp",
  "Career Experience program",
];

const AboutOverview = () => {
  return (
    <FeatureSplitSection
      title="About Us"
      description={ABOUT_DESCRIPTION}
      imageSrc="/images/pngs/lady.png"
      imageAlt="Amdari participant"
      overlayQuote="Our program is not a course. It is work experience, with expectations, deliverables, teamwork, leadership guidance, and results."
      footerContent={
        <div className="mt-20">
          <p className="mb-2 text-base font-medium text-[#64748B]">What we offer</p>
          <ProjectSlide firstText="" items={ABOUT_SLIDE_ITEMS} />
        </div>
      }
    />
  );
};

export default AboutOverview;
