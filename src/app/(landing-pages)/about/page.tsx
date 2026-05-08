import AboutHero from "@/components/_core/landing-pages/about/about-hero";
import Mission from "@/components/_core/landing-pages/about/mission";
import AboutOverview from "@/components/_core/landing-pages/about/about-overview";
import OurCoreValue from "@/components/_core/landing-pages/about/our-core-value";
import HowWeHelp from "@/components/_core/landing-pages/about/how-we-help";
import Team from "@/components/_core/landing-pages/about/team";
import WhatMakesDifferences from "@/components/_core/landing-pages/about/what-makes-differences.";
import JoinCommunity from "@/components/_core/landing-pages/about/join-community";
import TeamGallery from "@/components/_core/landing-pages/about/team-gallery";

const AboutPage = () => {
  return (
    <div>
      <AboutHero />
      <AboutOverview />
      <Mission />
      <OurCoreValue />
      <HowWeHelp />
      <Team />
      <WhatMakesDifferences />
      <JoinCommunity />
      <TeamGallery />
    </div>
  );
};

export default AboutPage;
