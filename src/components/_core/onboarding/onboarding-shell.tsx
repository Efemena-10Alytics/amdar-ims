"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthAside from "@/components/_core/auth/aside";
import Aside from "@/components/_core/onboarding/aside";
import { JourneyLayoutHeader } from "@/components/_core/onboarding/journey-layout-header";
import { OnboardingSettingUp } from "@/components/_core/onboarding/onboarding-setting-up";
import { OnboardingProvider } from "@/components/_core/onboarding/onboarding-context";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import {
  buildWhatsappRequiredOnboardingHref,
  getFirstPendingPreDiagnosticHref,
  hasPendingOnboardingSteps,
  isEnrollmentWhatsappVerified,
} from "@/features/internship/resolve-enrollment-journey";
import {
  isOnboardingNotFoundError,
  useGetOnboarding,
} from "@/features/onboarding/use-get-onboarding";
import { useSkipEntrySetup } from "@/features/internship/use-skip-entry-setup";
import { useRequireUserId } from "@/hooks/use-require-user-id";

function OnboardingShellContent({
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

  useEffect(() => {
    if (isSkipRedirectingRef.current) return;
    if (!isAuthReady || isEnrollmentLoading || !enrollment) return;
    if (hasPendingOnboardingSteps(enrollment.isOnboardingStepsCompleted)) return;

    if (!isEnrollmentWhatsappVerified(enrollment)) {
      router.replace(buildWhatsappRequiredOnboardingHref());
      return;
    }

    const preDiagnosticHref =
      getFirstPendingPreDiagnosticHref(enrollment.isPreDiagnosticStepsCompleted, {
        enrollmentId: enrollment.id,
      }) ?? "/pre-diagnostic-test";

    router.replace(preDiagnosticHref);
  }, [enrollment, isAuthReady, isEnrollmentLoading, router]);

  const handleSkipOnboarding = useCallback(async () => {
    isSkipRedirectingRef.current = true;
    try {
      await skipEntrySetup();
      window.location.assign("/dashboard");
    } catch {
      isSkipRedirectingRef.current = false;
    }
  }, [skipEntrySetup]);

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
          Unable to load onboarding. Program and cohort information is missing from
          your enrollment.
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
      <div className="flex h-screen w-full overflow-hidden bg-white p-3 2xl:p-5">
        <Suspense
          fallback={<div className="hidden lg:flex lg:w-[45%] xl:w-[42%]" />}
        >
          {asideVariant === "auth" ? <AuthAside /> : <Aside />}
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
                className="inline-flex items-center gap-2 rounded-full bg-[#156374] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#124f5d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <SkipForward className="size-4" />
                {isSkipping ? "Skipping..." : "Skip Entry Setup"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  if (!data) {
    return layout(rightPanel(), {
      aside:
        showSettingUpExperience || showOnboardingLoadingExperience
          ? "auth"
          : "onboarding",
      showStepper: !(showSettingUpExperience || showOnboardingLoadingExperience),
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
