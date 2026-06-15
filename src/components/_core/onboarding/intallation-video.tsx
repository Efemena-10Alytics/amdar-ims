"use client";

import { useMemo, useState } from "react";
import { Download, PlayIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OnboardingInstallationTool } from "@/features/onboarding/types";
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

const IntallationVideo = () => {
  const { onboarding, goToStep } = useOnboardingNavigation();
  const { enrollment } = useOnboardingData();
  const { markOnboardingStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedOnboardingStep();
  const [confirmed, setConfirmed] = useState(false);
  const [selectedTool, setSelectedTool] =
    useState<OnboardingInstallationTool | null>(null);

  const isStepCompleted = isOnboardingEnrollmentStepComplete(
    enrollment?.isOnboardingStepsCompleted,
    "installation-videos",
  );

  const tools = useMemo(
    () => onboarding.installation_video ?? [],
    [onboarding.installation_video],
  );

  const canContinue = canContinueJourneyStep(
    confirmed,
    isStepCompleted,
    isUpdating,
  );

  const handleContinue = async () => {
    if (!canContinueJourneyStep(confirmed, isStepCompleted, isUpdating)) {
      return;
    }

    try {
      if (shouldMarkJourneyStepComplete(isStepCompleted)) {
        await markOnboardingStepComplete("installation-videos");
      }
      goToStep("readiness-test");
    } catch {
      // errorMessage is set by the hook
    }
  };

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">
        Tools &amp; Technology Installation
      </h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-white p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-6">
        <h2 className="text-lg font-semibold text-[#3B6B76]">
          How to install your tools
        </h2>
        <p className="mt-1 text-sm font-medium text-[#EC5555]">
          Make sure to take a screenshot after successful installation, it will be
          requested!
        </p>

        <div className="mt-5 space-y-3">
          {tools.map((tool) => (
            <div
              key={`${tool.toolName}-${tool.toolLink}`}
              className="flex flex-col gap-3 rounded-xl bg-[#E8EFF1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-base font-semibold text-[#173740]">
                  {tool.toolName}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedTool(tool)}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[#2D6A78] underline underline-offset-2 transition hover:text-[#1E7C8D]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
                    <PlayIcon className="size-3.5 fill-primary" />
                  </span>
                  How to install
                </button>
              </div>

              <a
                href={tool.toolLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#D7EAEF] px-4 py-2.5 text-sm font-semibold text-[#2D6A78] transition hover:bg-[#c8dfe6] sm:self-center"
              >
                <Download className="size-4" />
                Click to download
              </a>
            </div>
          ))}
        </div>

        <label className="mt-5 inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">
            I have watched &amp; download all tools
          </span>
        </label>
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

      <Dialog
        open={selectedTool !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTool(null);
        }}
      >
        <DialogContent
          className="gap-0 overflow-hidden rounded-2xl border-[#DCE5E9] p-0 sm:max-w-3xl"
          showCloseButton
        >
          <DialogTitle className="px-5 pt-5 text-lg font-semibold text-[#3B6B76]">
            Watch video
          </DialogTitle>

          {selectedTool && (
            <div className="px-5 pb-5">
              <OnboardingVideoPlayer
                key={selectedTool.videoLink}
                src={selectedTool.videoLink}
                onEnded={() => {}}
              />

              <a
                href={selectedTool.toolLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2D6A78] underline underline-offset-2 transition hover:text-[#1E7C8D]"
              >
                <Download className="size-4" />
                Click to download
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default IntallationVideo;
