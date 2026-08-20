import WeeklySurveyModal from "@/components/_core/dashboard/internship-program/weekly-survey/weekly-survey-modal";
import type React from "react";

const InternshipProgramLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <WeeklySurveyModal />
      {children}
    </>
  );
};

export default InternshipProgramLayout;
