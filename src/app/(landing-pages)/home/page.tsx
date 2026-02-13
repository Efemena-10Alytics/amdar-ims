import InternshipHero from "@/components/_core/landing-pages/home/hero";
import Partners from "@/components/_core/landing-pages/home/partners/index";
import WhatWeOffer from "@/components/_core/landing-pages/home/what-we-offer/index";
import Portfolio from "@/components/_core/landing-pages/home/portfolio";
import WhatOurInternsSays from "@/components/_core/landing-pages/home/what-our-interns-says";
import Experience from "@/components/_core/landing-pages/home/experience";
import RoadMap from "@/components/_core/landing-pages/home/road-map/index";
import SuccessStories from "@/components/_core/landing-pages/home/success-stories/index";
import CareerNeeds from "@/components/_core/landing-pages/home/career-needs";
import NewHero from "@/components/_core/landing-pages/home/new-hero";
import JobReady from "@/components/_core/landing-pages/internship-program/job-ready";

const InternShipProgram = () => {
  return (
    <div>
      <InternshipHero />
      <WhatWeOffer />
      <Partners />
      <CareerNeeds />
      <JobReady />
      <Portfolio />
      <WhatOurInternsSays />
      <Experience />
      <RoadMap />
      <SuccessStories />
    </div>
  );
};

export default InternShipProgram;
