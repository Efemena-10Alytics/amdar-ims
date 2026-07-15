"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingVideoPlayer from "@/components/_core/onboarding/onboarding-video-player";
import PreviousStepButton from "@/components/_core/pre-diagnostic-test/previous-step-button";
import { usePreDiagnosticData } from "@/components/_core/pre-diagnostic-test/pre-diagnostic-context";
import { usePreDiagnosticNavigation } from "@/components/_core/pre-diagnostic-test/use-pre-diagnostic-navigation";
import {
  isPreDiagnosticEnrollmentStepComplete,
  useUpdateCompletedPreDiagnostic,
} from "@/features/internship/use-update-completed-pre-diagnostic";
import {
  canContinueJourneyStep,
  shouldMarkJourneyStepComplete,
} from "@/hooks/can-continue-journey-step";
import { getPreDiagnosticVideoDescription } from "@/features/pre-diagnostic/use-get-pre-diagnostic";

const FALLBACK_VIDEO_SRC = "https://vimeo.com/1123856639";
const FALLBACK_DESCRIPTION =
  "Get familiar with your learning environment, understand what to expect, and how to make the most of your learning experience.";

const HowTheImsWorks = () => {
  const router = useRouter();
  const { preDiagnostic } = usePreDiagnosticNavigation();
  const { enrollment } = usePreDiagnosticData();
  const { markPreDiagnosticStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedPreDiagnostic();
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  const isStepCompleted = isPreDiagnosticEnrollmentStepComplete(
    enrollment?.isPreDiagnosticStepsCompleted,
    "how-the-ims-works",
  );
  const canGoToPreviousStep = isPreDiagnosticEnrollmentStepComplete(
    enrollment?.isPreDiagnosticStepsCompleted,
    "technology-diagnostics",
  );

  const imsVideo = preDiagnostic.ims_readiness.howTheImsWorks;
  const src = imsVideo?.link?.trim() || FALLBACK_VIDEO_SRC;
  const description = getPreDiagnosticVideoDescription(
    imsVideo,
    FALLBACK_DESCRIPTION,
  );

  const canContinue = canContinueJourneyStep(
    hasVideoEnded,
    isStepCompleted,
    isUpdating,
  );

  const handleContinue = async () => {
    if (!canContinueJourneyStep(hasVideoEnded, isStepCompleted, isUpdating)) {
      return;
    }

    try {
      if (shouldMarkJourneyStepComplete(isStepCompleted)) {
        await markPreDiagnosticStepComplete("how-the-ims-works");
      }
      router.push("/pre-diagnostic-test/ims-readiness?step=ims-diagnostics");
    } catch {
      // errorMessage is set by the hook
    }
  };

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <div className="flex flex-wrap items-center gap-2">
        {canGoToPreviousStep ? (
          <PreviousStepButton href="/pre-diagnostic-test/technology-readiness?step=technology-diagnostics" />
        ) : null}
        <h1 className="text-2xl font-semibold text-[#173740]">How the IMS works</h1>
      </div>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Watch video</h2>

        <OnboardingVideoPlayer src={src} onEnded={() => setHasVideoEnded(true)} />

        <p className="mt-3 text-base leading-relaxed font-semibold text-[#64748B]">
          {description}
        </p>
      </article>

      {errorMessage ? (
        <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] cursor-pointer transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        {isUpdating ? "Saving..." : "Continue"}
      </button>
    </section>
  );
};

export default HowTheImsWorks;



