"use client";

import { Suspense } from "react";
import Aside from "@/components/_core/onboarding/aside";
import { JourneyLayoutHeader } from "@/components/_core/onboarding/journey-layout-header";
import { OnboardingProvider } from "@/components/_core/onboarding/onboarding-context";
import { useGetOnboarding } from "@/features/onboarding/use-get-onboarding";

function OnboardingShellContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data,
    isLoading,
    isError,
    error,
    errorMessage,
    refetch,
    enrollment,
    cohortId,
    programId,
    isEnrollmentLoading,
    isEnrollmentError,
    enrollmentError,
    refetchEnrollment,
  } = useGetOnboarding();

  const rightPanel = () => {
    if (isEnrollmentLoading) {
      return (
        <p className="px-4 text-sm text-[#64748B] sm:px-0">
          Loading your enrollment...
        </p>
      );
    }

    if (isEnrollmentError) {
      return (
        <div className="px-4 sm:px-0">
          <p className="text-sm text-destructive">
            {(enrollmentError as Error)?.message ??
              "Failed to load enrollment. Please try again."}
          </p>
          <button
            type="button"
            onClick={() => refetchEnrollment()}
            className="mt-3 text-sm font-medium text-[#2D6A78] underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (cohortId == null || programId == null) {
      return (
        <p className="px-4 text-sm text-[#64748B] sm:px-0">
          Unable to load onboarding. Program and cohort information is missing from
          your enrollment.
        </p>
      );
    }

    if (isLoading) {
      return (
        <p className="px-4 text-sm text-[#64748B] sm:px-0">Loading onboarding...</p>
      );
    }

    if (isError) {
      return (
        <div className="px-4 sm:px-0">
          <p className="text-sm text-destructive">{errorMessage}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-[#2D6A78] underline"
          >
            Retry
          </button>
        </div>
      );
    }

    return children;
  };

  const layout = (content: React.ReactNode) => (
    <div className="flex h-screen w-full overflow-hidden bg-white p-3 2xl:p-5">
      <Suspense fallback={<div className="hidden lg:flex lg:w-[45%] xl:w-[42%]" />}>
        <Aside />
      </Suspense>
      <div
        className="relative h-full min-h-0 w-full overflow-y-auto sm:pl-10"
        style={{
          backgroundColor: "#E8EFF1",
          backgroundImage: "url(/images/pngs/auth-pattern.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "0 0",
        }}
      >
        <JourneyLayoutHeader activeStep={1} />
        <div className="pb-8">{content}</div>
      </div>
    </div>
  );

  if (!data) {
    return layout(rightPanel());
  }

  return (
    <OnboardingProvider
      value={{
        data,
        isLoading,
        isError,
        error,
        refetch,
        cohortId,
        programId,
        enrollment,
      }}
    >
      {layout(rightPanel())}
    </OnboardingProvider>
  );
}

export default function OnboardingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingShellContent>{children}</OnboardingShellContent>;
}
