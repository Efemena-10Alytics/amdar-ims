"use client";

import { Suspense } from "react";
import Aside from "@/components/_core/pre-diagnostic-test/aside";
import { JourneyStepper } from "@/components/_core/onboarding/journey-stepper";
import { PreDiagnosticProvider } from "@/components/_core/pre-diagnostic-test/pre-diagnostic-context";
import { useGetPreDiagnostic } from "@/features/pre-diagnostic/use-get-pre-diagnostic";

function PreDiagnosticShellContent({
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
  } = useGetPreDiagnostic();

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
          Unable to load pre-diagnostic. Program and cohort information is missing
          from your enrollment.
        </p>
      );
    }

    if (isLoading) {
      return (
        <p className="px-4 text-sm text-[#64748B] sm:px-0">
          Loading pre-diagnostic...
        </p>
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
        <div className="w-full max-w-190 px-4 pt-5 sm:px-0 sm:pt-8">
          <JourneyStepper activeStep={2} />
        </div>
        <div className="pb-8">{content}</div>
      </div>
    </div>
  );

  if (!data) {
    return layout(rightPanel());
  }

  return (
    <PreDiagnosticProvider
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
    </PreDiagnosticProvider>
  );
}

export default function PreDiagnosticShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PreDiagnosticShellContent>{children}</PreDiagnosticShellContent>;
}
