"use client";

import { useState } from "react";
import {
  isOnboardingEnrollmentStepComplete,
  useUpdateCompletedOnboardingStep,
} from "@/features/internship/use-update-completed-onboarding-step";
import {
  canContinueJourneyStep,
  shouldMarkJourneyStepComplete,
} from "@/hooks/can-continue-journey-step";
import OnboardingVideoPlayer from "./onboarding-video-player";
import { useOnboardingData } from "./onboarding-context";
import { useOnboardingNavigation } from "./use-onboarding-navigation";

const OrientationVideo = () => {
  const { onboarding, goToStep } = useOnboardingNavigation();
  const { enrollment } = useOnboardingData();
  const { markOnboardingStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedOnboardingStep();
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  const isStepCompleted = isOnboardingEnrollmentStepComplete(
    enrollment?.isOnboardingStepsCompleted,
    "orientation-video",
  );

  const orientation = onboarding.orientation_video;
  const description =
    orientation.description?.trim() ||
    orientation.instructions?.trim() ||
    "Get familiar with your learning environment, understand what to expect, and how to make the most of your learning experience.";

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
        await markOnboardingStepComplete("orientation-video");
      }
      goToStep("internship-structure-video");
    } catch {
      // errorMessage is set by the hook
    }
  };

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">Your Orientation</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Watch video</h2>

        <OnboardingVideoPlayer
          src={orientation.link}
          onEnded={() => setHasVideoEnded(true)}
        />

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
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        {isUpdating ? "Saving..." : "Continue"}
      </button>
    </section>
  );
};

export default OrientationVideo;
