import InternshipBasicInfo from "@/components/_core/dashboard/dashboard/intership-basic-info";
import RecommendedCourses from "@/components/_core/dashboard/dashboard/recommended-courses";
import EmployabilityExperts from "@/components/_core/dashboard/internship-program/internship-details/career-center/employability-experts";
import CvMatchlyAiCard from "@/components/_core/dashboard/internship-program/internship-details/career-center/cvmatchly-ai-card";

const InternshipHasNotStarted = () => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <InternshipBasicInfo />
        <RecommendedCourses />
      </div>
      <div className="flex flex-col gap-4">
        <EmployabilityExperts />
        <CvMatchlyAiCard />
      </div>
    </div>
  );
};

export default InternshipHasNotStarted;
