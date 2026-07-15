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
import { useOnboardingData } from "./onboarding-context";
import { useOnboardingNavigation } from "./use-onboarding-navigation";
import OnboardingPreviousStepButton from "./onboarding-previous-step-button";

const RulesEtiquettes = () => {
  const { onboarding, goToStep } = useOnboardingNavigation();
  const { enrollment } = useOnboardingData();
  const { markOnboardingStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedOnboardingStep();
  const [confirmRules, setConfirmRules] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);

  const isStepCompleted = isOnboardingEnrollmentStepComplete(
    enrollment?.isOnboardingStepsCompleted,
    "internship-rules",
  );

  const rules = onboarding.rule_and_etiquette;
  const docLink = rules.docLink;

  const requirementsMet = confirmRules && confirmTerms;
  const canContinue = canContinueJourneyStep(
    requirementsMet,
    isStepCompleted,
    isUpdating,
  );

  const handleContinue = async () => {
    if (!canContinueJourneyStep(requirementsMet, isStepCompleted, isUpdating)) {
      return;
    }

    try {
      if (shouldMarkJourneyStepComplete(isStepCompleted)) {
        await markOnboardingStepComplete("internship-rules");
      }
      goToStep("installation-videos");
    } catch {
      // errorMessage is set by the hook
    }
  };

  return (
    <section className="w-full max-w-190 overflow-y-auto! px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <div className="flex flex-wrap items-center gap-2">
        <OnboardingPreviousStepButton
          enrollment={enrollment}
          previousStep="cohort-lead"
          onClick={() => goToStep("cohort-lead")}
        />
        <h1 className="text-2xl font-semibold text-[#173740]">Your Program Etiquettes &amp; Rules</h1>
      </div>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">
          Read through your ground rules, compliance and etiquettes
        </h2>

        <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-xl bg-[#E9EEF2] p-3">
          <div
            className="text-sm leading-relaxed text-[#506572]"
            dangerouslySetInnerHTML={{ __html: rules.instructions }}
          />
        </div>

        <label className="mt-4 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmRules}
            onChange={(event) => setConfirmRules(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">
            I confirm and agree with the rules and Etiquettes
          </span>
        </label>

        <label className="mt-2 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmTerms}
            onChange={(event) => setConfirmTerms(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">
            I have read the{" "}
            <a
              href={docLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2D6A78] underline"
            >
              {docLink.name || "Amdari Terms & Policies"}
            </a>{" "}
            attached above and I agree.
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
    </section>
  );
};

export default RulesEtiquettes;

