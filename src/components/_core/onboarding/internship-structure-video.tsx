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
import OnboardingPreviousStepButton from "./onboarding-previous-step-button";
import { useOnboardingData } from "./onboarding-context";
import { useOnboardingNavigation } from "./use-onboarding-navigation";

const InternshipStructureVideo = () => {
  const { onboarding, goToStep } = useOnboardingNavigation();
  const { enrollment } = useOnboardingData();
  const { markOnboardingStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedOnboardingStep();
  const videos = onboarding.internshp_structure_video ?? [];
  const [videoIndex, setVideoIndex] = useState(0);
  const [completedIndexes, setCompletedIndexes] = useState<number[]>([]);

  const isStepCompleted = isOnboardingEnrollmentStepComplete(
    enrollment?.isOnboardingStepsCompleted,
    "internship-structure-video",
  );

  const currentVideo = videos[videoIndex];
  const allVideosCompleted =
    videos.length > 0 && completedIndexes.length >= videos.length;
  const currentVideoRequirementsMet =
    completedIndexes.includes(videoIndex) || allVideosCompleted;

  const handleVideoEnded = () => {
    setCompletedIndexes((prev) =>
      prev.includes(videoIndex) ? prev : [...prev, videoIndex],
    );
  };

  const handleContinue = async () => {
    if (isStepCompleted) {
      goToStep("cohort-lead");
      return;
    }

    if (!allVideosCompleted && videoIndex < videos.length - 1) {
      setVideoIndex((prev) => prev + 1);
      return;
    }

    if (isUpdating || !currentVideoRequirementsMet) return;

    try {
      await markOnboardingStepComplete("internship-structure-video");
      goToStep("cohort-lead");
    } catch {
      // errorMessage is set by the hook
    }
  };

  if (!currentVideo) {
    return (
      <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
        <p className="text-sm text-[#64748B]">No internship structure videos available.</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <div className="flex flex-wrap items-center gap-2">
        <OnboardingPreviousStepButton
          enrollment={enrollment}
          previousStep="orientation-video"
          onClick={() => goToStep("orientation-video")}
        />
        <h1 className="text-2xl font-semibold text-[#173740]">Your Internship structure</h1>
      </div>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">
          {currentVideo.title || "Watch video"}
        </h2>

        <OnboardingVideoPlayer
          key={currentVideo.link}
          src={currentVideo.link}
          onEnded={handleVideoEnded}
        />

        <p className="mt-3 text-base leading-relaxed font-semibold text-[#64748B]">
          {currentVideo.description || "Getting to know how your internship works"}
        </p>

        {videos.length > 1 && (
          <p className="mt-2 text-sm font-medium text-[#2D6A78]">
            Video {videoIndex + 1} of {videos.length}
          </p>
        )}
      </article>

      {errorMessage ? (
        <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <button
        type="button"
        disabled={
          !canContinueJourneyStep(
            currentVideoRequirementsMet,
            isStepCompleted,
            isUpdating,
          )
        }
        onClick={handleContinue}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] cursor-pointer transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        {isUpdating
          ? "Saving..."
          : isStepCompleted || allVideosCompleted || videoIndex >= videos.length - 1
            ? "Continue"
            : "Next video"}
      </button>
    </section>
  );
};

export default InternshipStructureVideo;

