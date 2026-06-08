"use client";

import Image from "next/image";
import { useState } from "react";
import { formatLeadPhone } from "@/features/onboarding/use-get-onboarding";
import { useUpdateCompletedOnboardingStep } from "@/features/internship/use-update-completed-onboarding-step";
import { CopySVG } from "./svg";
import { useOnboardingNavigation } from "./use-onboarding-navigation";

const CohortLead = () => {
  const { onboarding, goToStep } = useOnboardingNavigation();
  const { markOnboardingStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedOnboardingStep();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const leads = onboarding.cohort_lead ?? [];

  const canContinue = isConfirmed && !isUpdating;

  const handleContinue = async () => {
    if (!canContinue) return;

    try {
      await markOnboardingStepComplete("cohort-lead");
      goToStep("internship-rules");
    } catch {
      // errorMessage is set by the hook
    }
  };

  const copyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">Your Program Leads &amp; Support</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Save your leads contact</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => {
            const phone = formatLeadPhone(lead);
            return (
              <article
                key={`${lead.name}-${lead.phone}`}
                className="relative overflow-hidden rounded-2xl"
              >
                <div className="relative h-80">
                  <Image
                    src={lead.image.url}
                    alt={lead.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute right-2 bottom-2 left-2 rounded-md bg-black/55 px-3 py-2.5 backdrop-blur-[1px]">
                  <p className="text-xs font-semibold text-[#DFEEF2]">{lead.name} {lead.position ? `(${lead.position})` : null}</p>
                  <div className="mt-0.5 flex items-center justify-between gap-3">
                    <p className="text-xs text-[#BCD2D8]">{phone}</p>
                    <button
                      type="button"
                      onClick={() => copyPhone(phone)}
                      className="cursor-pointer text-[#D6E8ED] transition hover:text-white"
                      aria-label={`Copy ${lead.name} number`}
                    >
                      <CopySVG />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <label className="mt-4 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(event) => setIsConfirmed(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">
            I confirm that I know who to reach out to
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
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        {isUpdating ? "Saving..." : "Continue"}
      </button>
    </section>
  );
};

export default CohortLead;
