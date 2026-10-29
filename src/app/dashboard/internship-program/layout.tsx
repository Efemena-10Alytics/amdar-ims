import WeeklySurveyModal from "@/components/_core/dashboard/internship-program/weekly-survey/weekly-survey-modal";
import { LegacyCohortRedirect } from "@/components/_core/dashboard/internship-program/legacy-cohort-redirect";
import type React from "react";

const InternshipProgramLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <LegacyCohortRedirect />
      <WeeklySurveyModal />
      {children}
    </>
  );
};

export default InternshipProgramLayout;
