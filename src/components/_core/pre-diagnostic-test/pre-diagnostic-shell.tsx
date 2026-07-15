"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import Aside from "@/components/_core/pre-diagnostic-test/aside";
import { JourneyLayoutHeader } from "@/components/_core/onboarding/journey-layout-header";
import { PreDiagnosticProvider } from "@/components/_core/pre-diagnostic-test/pre-diagnostic-context";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { isEnrollmentWhatsappVerified, buildWhatsappRequiredOnboardingHref } from "@/features/internship/resolve-enrollment-journey";
import { useSkipEntrySetup } from "@/features/internship/use-skip-entry-setup";
import { useGetPreDiagnostic } from "@/features/pre-diagnostic/use-get-pre-diagnostic";
import { useRequireUserId } from "@/hooks/use-require-user-id";

function PreDiagnosticShellContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthReady } = useRequireUserId();
  const { data: userInfo } = useGetUserInfo();
  const { skipEntrySetup, isSkipping, errorMessage: skipErrorMessage } =
    useSkipEntrySetup();
  const isSkipRedirectingRef = useRef(false);
  const showSkipFab = ((userInfo as Record<string, unknown> | undefined)?.staff ??
    null) !== null;

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

  useEffect(() => {
    if (isSkipRedirectingRef.current) return;
    if (isEnrollmentLoading || !enrollment) return;
    if (!isEnrollmentWhatsappVerified(enrollment)) {
      router.replace(buildWhatsappRequiredOnboardingHref());
    }
  }, [enrollment, isEnrollmentLoading, router]);

  const handleSkipOnboarding = useCallback(async () => {
    isSkipRedirectingRef.current = true;
    try {
      await skipEntrySetup();
      window.location.assign("/dashboard");
    } catch {
      isSkipRedirectingRef.current = false;
    }
  }, [skipEntrySetup]);

  if (!isAuthReady) return null;

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
        <JourneyLayoutHeader activeStep={2} />
        <div className="pb-8">{content}</div>
        {showSkipFab ? (
          <div className="fixed right-10 bottom-10 z-40 flex flex-col items-end gap-2">
            {skipErrorMessage ? (
              <p className="max-w-xs rounded-md bg-white/95 px-3 py-2 text-xs text-destructive shadow-sm">
                {skipErrorMessage}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleSkipOnboarding}
              disabled={isSkipping}
              className="inline-flex cursor-pointer items-center size-16 justify-center gap-2 rounded-full bg-[#156374] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#156374]/30 transition-all duration-300 animate-pulse hover:bg-[#124f5d] hover:shadow-xl hover:shadow-[#156374]/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-none"
            >
              {isSkipping ? "..." : "Skip"}
            </button>
          </div>
        ) : null}
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


