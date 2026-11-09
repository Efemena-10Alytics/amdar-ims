import ReferenceLetter from "@/components/_core/dashboard/dashboard/reference-letter";
import InterviewPrepRequestCard from "@/components/_core/dashboard/internship-program/internship-details/career-center/interview-prep-request-card";
import EmployabilityExperts from "@/components/_core/dashboard/internship-program/internship-details/career-center/employability-experts";
import CvMatchlyAiCard from "@/components/_core/dashboard/internship-program/internship-details/career-center/cvmatchly-ai-card";
import GlobalTalentsCard from "@/components/_core/dashboard/internship-program/internship-details/career-center/global-talents-card";
import JobApplicationSprintCard from "@/components/_core/dashboard/internship-program/internship-details/career-center/job-application-sprint-card";

const CareerCenter = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <GlobalTalentsCard />
      <JobApplicationSprintCard />
      <EmployabilityExperts />
      <InterviewPrepRequestCard />
      <ReferenceLetter />
      <CvMatchlyAiCard />
    </div>
  );
};

export default CareerCenter;
