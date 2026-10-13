"use client";

import DashboardHeader from "@/components/_core/dashboard/dashboard/header";
import DashboardWelcome from "@/components/_core/dashboard/dashboard/welcome";
import WelcomeVideo from "@/components/_core/dashboard/dashboard/welcome-video";
import InternshipHasStarted from "@/components/_core/dashboard/dashboard/internship-has-started";
import InternshipHasNotStarted from "@/components/_core/dashboard/dashboard/internship-has-not-started";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { hasProgramStarted } from "@/components/_core/dashboard/dashboard/welcome/welcome-shared";

const DashboardPage = () => {
  // const { data: enrollment } = useGetUserEnrollment();
  // const programStarted = hasProgramStarted(
  //   enrollment?.cohort?.start_date ?? null,
  // );

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <DashboardHeader />

      <div className="flex min-h-52 flex-col gap-4 xl:min-h-0 xl:flex-row xl:items-stretch">
        <div className="flex min-w-0 flex-1">
          <DashboardWelcome />
        </div>
        <div className="flex min-w-0 flex-1 xl:max-w-100">
          <WelcomeVideo />
        </div>
      </div>

      {/* {programStarted ? <InternshipHasStarted /> :  */}
      <InternshipHasNotStarted />
      {/* } */}
    </div>
  );
};

export default DashboardPage;
