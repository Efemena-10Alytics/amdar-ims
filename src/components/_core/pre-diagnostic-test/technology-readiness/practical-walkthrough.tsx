"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OnboardingVideoPlayer from "@/components/_core/onboarding/onboarding-video-player";
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
import {
  buildPracticalWalkthroughHref,
  getFirstPracticalWalkthroughStepKey,
  getLastPracticalWalkthroughStepKey,
  getNextPracticalWalkthroughStepKey,
  isLastPracticalWalkthroughStep,
  parsePracticalWalkthroughStepNumber,
} from "@/features/pre-diagnostic/practical-walkthrough-steps";
import {
  isPracticalWalkthroughStepLocallyComplete,
  markPracticalWalkthroughStepLocallyComplete,
  setPracticalWalkthroughLastActiveStep,
} from "@/features/pre-diagnostic/practical-walkthrough-progress";
import { getPreDiagnosticVideoDescription } from "@/features/pre-diagnostic/use-get-pre-diagnostic";

const FALLBACK_VIDEO_SRC = "https://vimeo.com/1123856639";
const FALLBACK_DESCRIPTION =
  "Learn how to navigate your tools, submit work, and stay on track throughout your program.";

const PracticalWalkthrough = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { preDiagnostic } = usePreDiagnosticNavigation();
  const { enrollment } = usePreDiagnosticData();
  const { markPreDiagnosticStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedPreDiagnostic();
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  const walkthroughVideos =
    preDiagnostic.technology_readiness.PracticalWalkthrough ?? [];
  const walkthroughCount = Math.max(walkthroughVideos.length, 1);

  const stepKey =
    searchParams.get("step") ?? getFirstPracticalWalkthroughStepKey(walkthroughCount);
  const stepNumber = parsePracticalWalkthroughStepNumber(stepKey) ?? 1;
  const videoIndex = Math.min(stepNumber - 1, walkthroughCount - 1);
  const isLastStep = isLastPracticalWalkthroughStep(stepNumber, walkthroughCount);

  const walkthroughVideo = walkthroughVideos[videoIndex];
  const src = walkthroughVideo?.link?.trim() || FALLBACK_VIDEO_SRC;
  const description = getPreDiagnosticVideoDescription(
    walkthroughVideo,
    FALLBACK_DESCRIPTION,
  );

  const title = useMemo(
    () => `Practical walkthrough ${stepNumber}`,
    [stepNumber],
  );

  const enrollmentId = enrollment?.id;
  const stepOptions = useMemo(
    () => ({ practicalWalkthroughCount: walkthroughCount, enrollmentId }),
    [walkthroughCount, enrollmentId],
  );

  const isStepCompleted = isPreDiagnosticEnrollmentStepComplete(
    enrollment?.isPreDiagnosticStepsCompleted,
    stepKey,
    stepOptions,
  );

  useEffect(() => {
    setPracticalWalkthroughLastActiveStep(enrollmentId, stepKey);
  }, [enrollmentId, stepKey]);

  useEffect(() => {
    const hasWatchedLocally = isPracticalWalkthroughStepLocallyComplete(
      enrollmentId,
      stepKey,
    );
    setHasVideoEnded(hasWatchedLocally || isStepCompleted);
  }, [enrollmentId, isStepCompleted, stepKey, src]);

  const canContinue = canContinueJourneyStep(
    hasVideoEnded,
    isStepCompleted,
    isUpdating,
  );

  const handleVideoEnded = () => {
    setHasVideoEnded(true);
    markPracticalWalkthroughStepLocallyComplete(enrollmentId, stepKey);
  };

  const handleContinue = async () => {
    if (!canContinueJourneyStep(hasVideoEnded, isStepCompleted, isUpdating)) {
      return;
    }

    markPracticalWalkthroughStepLocallyComplete(enrollmentId, stepKey);

    if (!isLastStep) {
      const nextStepKey = getNextPracticalWalkthroughStepKey(
        stepNumber,
        walkthroughCount,
      );
      if (nextStepKey) {
        router.push(buildPracticalWalkthroughHref(nextStepKey));
      }
      return;
    }

    try {
      if (shouldMarkJourneyStepComplete(isStepCompleted)) {
        await markPreDiagnosticStepComplete(
          getLastPracticalWalkthroughStepKey(walkthroughCount),
          "completed",
          stepOptions,
        );
      }
      router.push(
        "/pre-diagnostic-test/technology-readiness?step=technology-diagnostics",
      );
    } catch {
      // errorMessage is set by the hook
    }
  };

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">{title}</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Watch video</h2>

        <OnboardingVideoPlayer
          key={`${stepKey}-${src}`}
          src={src}
          onEnded={handleVideoEnded}
        />

        <p className="mt-3 text-base leading-relaxed font-semibold text-[#64748B]">
          {description}
        </p>

        {walkthroughCount > 1 ? (
          <p className="mt-2 text-sm font-medium text-[#2D6A78]">
            Video {stepNumber} of {walkthroughCount}
          </p>
        ) : null}
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

export default PracticalWalkthrough;
