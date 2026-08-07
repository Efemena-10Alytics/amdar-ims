import ReferenceLetter from "@/components/_core/dashboard/dashboard/reference-letter";
import InterviewPrepRequestCard from "@/components/_core/dashboard/internship-program/internship-details/career-center/interview-prep-request-card";
import EmployabilityExperts from "@/components/_core/dashboard/internship-program/internship-details/career-center/employability-experts";
import OfficeHour from "@/components/_core/dashboard/internship-program/internship-details/career-center/office-hour";

const CareerCenter = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <OfficeHour />
      <EmployabilityExperts />
      <InterviewPrepRequestCard />
      <ReferenceLetter />
    </div>
  );
};

export default CareerCenter;
