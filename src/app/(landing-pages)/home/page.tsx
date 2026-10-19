"use client";

import Partners from "@/components/_core/landing-pages/home/partners/index";
import Companies from "@/components/_core/landing-pages/home/companies";
import WhatWeOffer from "@/components/_core/landing-pages/home/what-we-offer/index";
import Portfolio from "@/components/_core/landing-pages/home/portfolio";
import WhatOurInternsSays from "@/components/_core/landing-pages/home/what-our-interns-says";
import Experience from "@/components/_core/landing-pages/home/experience";
import RoadMap from "@/components/_core/landing-pages/home/road-map/index";
import SuccessStories from "@/components/_core/landing-pages/home/success-stories/index";
import CareerNeeds from "@/components/_core/landing-pages/home/career-needs";
import JobReady from "@/components/_core/landing-pages/internship-program/job-ready";
import HeroThree from "@/components/_core/landing-pages/home/hero-three";
import TheImpact from "@/components/_core/landing-pages/home/the-impact";
import ProjectExperience from "@/components/_core/landing-pages/home/project-experience";
import BusinessTestimonial from "@/components/_core/landing-pages/home/business-testimonial";
import SpeakToExpertWidget from "@/components/_core/landing-pages/shared/speak-to-expert-widget";
// import HomeSpecialOffer from "@/components/_core/two-years-aniversary-offer/home-special-offer";
// import SuccessStoriesShowcase from "@/components/_core/two-years-aniversary-offer/testimonal";

const InternShipProgram = () => {
  return (
    <div>
      {/* <HomeSpecialOffer /> */}
      <HeroThree />
      <TheImpact />
      <ProjectExperience />
      <BusinessTestimonial />
      {/* <SuccessStoriesShowcase /> */}
      {/* <Companies /> */}
      {/* <WhatWeOffer /> */}
      <Partners />
      <CareerNeeds />
      <JobReady />
      <Portfolio />
      <WhatOurInternsSays />
      <Experience />
      <RoadMap />
      <SuccessStories />
      <SpeakToExpertWidget />
    </div>
  );
};

export default InternShipProgram;
