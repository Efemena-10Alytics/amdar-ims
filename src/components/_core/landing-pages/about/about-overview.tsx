"use client";

import FeatureSplitSection from "../internship-program/feature-split-section";
import ProjectSlide from "../internship-program/project-slide";
import { TreasureSpot } from "@/components/_core/treasure-hunt/treasure-hunt-provider";

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
      title={
        <TreasureSpot
          kind="win"
          treasureSlotIndex={2}
          className="text-inherit"
        >
          About Us
        </TreasureSpot>
      }
      description={
        <>
          At{" "}
          <TreasureSpot kind="decoy" className="text-inherit">
            Amdari
          </TreasureSpot>
          , we know what it&apos;s like to navigate the modern job market, it&apos;s
          complex, competitive, and often overwhelming. That&apos;s why we built
          Amdari, a platform created by professionals who&apos;ve walked the same
          path and understand the real challenges of getting hired today. We
          believe that opportunities should be accessible to everyone willing to
          put in the work.
        </>
      }
      imageSrc="/images/pngs/lady.png"
      imageAlt="Amdari participant"
      overlayQuote="Our program is not a course. It is work experience, with expectations, deliverables, teamwork, leadership guidance, and results."
      footerContent={
        <div className="mt-20">
          <p className="mb-2 text-base font-medium text-[#64748B]">
            <TreasureSpot kind="decoy" className="text-inherit">
              What we offer
            </TreasureSpot>
          </p>
          <ProjectSlide firstText="" items={ABOUT_SLIDE_ITEMS} />
        </div>
      }
    />
  );
};

export default AboutOverview;
