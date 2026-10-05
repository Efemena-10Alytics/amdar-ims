"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuthAside from "@/components/_core/auth/aside";
import Aside from "@/components/_core/onboarding/aside";
import HowTheImsWorksModal, {
  hasWatchedHowTheImsWorks,
  IMS_WORKS_WATCHED_STORAGE_KEY,
} from "@/components/_core/onboarding/how-the-ims-works-modal";
import { JourneyLayoutHeader } from "@/components/_core/onboarding/journey-layout-header";
import { OnboardingSettingUp } from "@/components/_core/onboarding/onboarding-setting-up";
import { OnboardingProvider } from "@/components/_core/onboarding/onboarding-context";
import { useIsStaff } from "@/features/auth/staff-roles";
import {
  isOnboardingNotFoundError,
  useGetOnboarding,
} from "@/features/onboarding/use-get-onboarding";
import { useSkipEntrySetup } from "@/features/internship/use-skip-entry-setup";
import { useGetPreDiagnostic } from "@/features/pre-diagnostic/use-get-pre-diagnostic";
import { useRequireUserId } from "@/hooks/use-require-user-id";

const IMS_WORKS_FALLBACK_VIDEO = "https://vimeo.com/1123856639";

function OnboardingShellContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useRequireUserId();
  const { isStaff } = useIsStaff();
  const {
    skipEntrySetup,
    isSkipping,
    errorMessage: skipErrorMessage,
  } = useSkipEntrySetup();
  const isSkipRedirectingRef = useRef(false);
  const hasOpenedImsModalRef = useRef(false);
  const [imsModalOpen, setImsModalOpen] = useState(false);
  const showSkipFab = isStaff;

  const {
    data,
    isLoading,
    isPending,
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

  const {
    data: preDiagnostic,
    isLoading: isPreDiagnosticLoading,
    isPending: isPreDiagnosticPending,
    isError: isPreDiagnosticError,
  } = useGetPreDiagnostic();

  const imsVideoUrl =
    preDiagnostic?.ims_readiness?.howTheImsWorks?.link?.trim() ||
    IMS_WORKS_FALLBACK_VIDEO;

  const imsWatchedStorageKey = useMemo(() => {
    const parts = [
      IMS_WORKS_WATCHED_STORAGE_KEY,
      userId ?? "anon",
      cohortId ?? "cohort",
      programId ?? "program",
    ];
    return parts.join(":");
  }, [cohortId, programId, userId]);

  useEffect(() => {
    if (!data || hasOpenedImsModalRef.current) return;

    if (hasWatchedHowTheImsWorks(imsWatchedStorageKey)) {
      hasOpenedImsModalRef.current = true;
      return;
    }

    // Wait until pre-diagnostic settles so we prefer the real video URL.
    if (
      !isPreDiagnosticError &&
      (isPreDiagnosticPending || isPreDiagnosticLoading)
    ) {
      return;
    }

    hasOpenedImsModalRef.current = true;
    setImsModalOpen(true);
  }, [
    data,
    imsWatchedStorageKey,
    isPreDiagnosticError,
    isPreDiagnosticLoading,
    isPreDiagnosticPending,
  ]);

  const isOnboardingLoading = isPending || isLoading;
  const onboardingNotFound =
    cohortId != null &&
    programId != null &&
    !isOnboardingLoading &&
    !isEnrollmentLoading &&
    isError &&
    isOnboardingNotFoundError(error);
  const showOnboardingLoadingExperience =
    isEnrollmentLoading ||
    (cohortId != null &&
      programId != null &&
      !isEnrollmentError &&
      isOnboardingLoading);
  const showSettingUpExperience =
    cohortId != null &&
    programId != null &&
    !isEnrollmentError &&
    (onboardingNotFound || (!data && !isError && !isOnboardingLoading));

  const handleSkipOnboarding = useCallback(async () => {
    if (programId == null || cohortId == null) return;

    isSkipRedirectingRef.current = true;
    try {
      await skipEntrySetup({ programId, cohortId });
      window.location.assign("/dashboard/internship-program");
    } catch {
      isSkipRedirectingRef.current = false;
    }
  }, [cohortId, programId, skipEntrySetup]);

  const rightPanel = () => {
    if (showOnboardingLoadingExperience) {
      return (
        <div className="px-4 sm:px-0">
          <p className="text-sm text-[#64748B]">Loading onboarding...</p>
        </div>
      );
    }

    if (showSettingUpExperience) {
      return <OnboardingSettingUp enrollment={enrollment} />;
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
          Unable to load onboarding. Program and cohort information is missing
          from your enrollment.
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

  const layout = (
    content: React.ReactNode,
    options?: { aside?: "onboarding" | "auth"; showStepper?: boolean },
  ) => {
    const asideVariant = options?.aside ?? "onboarding";
    const showStepper = options?.showStepper ?? true;

    return (
      <>
        <div className="flex h-screen w-full overflow-hidden bg-white p-3 2xl:p-5">
          <Suspense
            fallback={<div className="hidden lg:flex lg:w-[45%] xl:w-[42%]" />}
          >
            {asideVariant === "auth" ? (
              <AuthAside showJourneyControls={showSettingUpExperience} />
            ) : (
              <Aside />
            )}
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
            <JourneyLayoutHeader activeStep={1} showStepper={showStepper} />
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
                  className="inline-flex size-16 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#156374] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#156374]/30 transition-all duration-300 animate-pulse hover:bg-[#124f5d] hover:shadow-xl hover:shadow-[#156374]/50 disabled:cursor-not-allowed disabled:animate-none disabled:opacity-70"
                >
                  {isSkipping ? "..." : "Skip"}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <HowTheImsWorksModal
          open={imsModalOpen}
          onOpenChange={setImsModalOpen}
          videoUrl={imsVideoUrl}
          storageKey={imsWatchedStorageKey}
        />
      </>
    );
  };

  if (!data) {
    return layout(rightPanel(), {
      aside:
        showSettingUpExperience || showOnboardingLoadingExperience
          ? "auth"
          : "onboarding",
      showStepper: !(
        showSettingUpExperience || showOnboardingLoadingExperience
      ),
    });
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
