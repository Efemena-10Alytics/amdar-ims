import AboutHero from "@/components/_core/landing-pages/about/about-hero";
import Mission from "@/components/_core/landing-pages/about/mission";
import AboutOverview from "@/components/_core/landing-pages/about/about-overview";
import OurCoreValue from "@/components/_core/landing-pages/about/our-core-value";
import HowWeHelp from "@/components/_core/landing-pages/about/how-we-help";

const AboutPage = () => {
  return (
    <div>
      <AboutHero />
      <AboutOverview />
      <Mission />
      <OurCoreValue />
      <HowWeHelp />
    </div>
  );
};

export default AboutPage;
