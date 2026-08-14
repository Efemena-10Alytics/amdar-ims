"use client"
import CompaniesSection from "@/components/_core/landing-pages/job-board/companies-section";
import JobBoardHero from "@/components/_core/landing-pages/job-board/job-board-hero";
import JobBoardSection from "@/components/_core/landing-pages/job-board/job-board-section";


const JobBoard = () => {
  return (
    <div className="pb-12 lg:pb-20 space-y-20">
      <JobBoardHero />
      <JobBoardSection />
      <CompaniesSection />
    </div>
  );
};

export default JobBoard;