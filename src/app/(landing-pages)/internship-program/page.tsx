import React from "react";
import ChoosePath from "@/components/_core/landing-pages/internship-program/choose-path";
import WhyTakeTheInternship from "@/components/_core/landing-pages/internship-program/why-take-the-internship";
import JobReady from "@/components/_core/landing-pages/internship-program/job-ready";
import Faq from "@/components/_core/landing-pages/home/faq";

const ChoosePathPage = () => {
  return (
    <div>
      <ChoosePath />
      <WhyTakeTheInternship />
      <JobReady />
      <Faq />
    </div>
  );
};

export default ChoosePathPage;
