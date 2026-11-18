"use client";

import React from "react";
import { DiagnosticHeader } from "../../_diagnostic-shared/diagnostic-header";
import { SCAN_STEP_LABELS } from "../cv-engine";

interface ProcessingViewProps {
  activeStepIndex: number;
  allDone: boolean;
  statusMessage: string;
}

export function ProcessingView({
  activeStepIndex,
  allDone,
  statusMessage,
}: ProcessingViewProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-12">
      <DiagnosticHeader
        subtag="CV Sponsorship Evaluation"
        rightSlot={
          <span className="text-[0.85rem] font-semibold text-[#C7D5D6]">
            Scanning...
          </span>
        }
      />

      <div className="my-6 rounded-[28px] border border-[#156374]/55 bg-[#0C3640]/90 px-6 py-9 text-center">
        <div className="uk-diag-spin" aria-hidden="true" />
        <h2 className="mb-2.5 text-[1.3rem] font-extrabold leading-[1.15] text-white">
          Scanning CV against UK ATS filters, Skilled Worker SOC codes, and the
          £41,700 sponsorship threshold...
        </h2>
        <p className="text-[0.95rem] text-[#C7D5D6]" aria-live="polite">
          {statusMessage}
        </p>

        <div className="mx-auto mt-6 grid max-w-[480px] gap-3 text-left">
          {SCAN_STEP_LABELS.map((label, idx) => {
            const isDone = allDone || idx < activeStepIndex;
            const isActive = !allDone && idx === activeStepIndex;

            return (
              <div
                key={label}
                className={`flex items-center gap-3 text-[0.92rem] ${
                  isDone
                    ? "text-white"
                    : isActive
                      ? "font-semibold text-[#FFE082]"
                      : "text-[#8EB7BE]"
                }`}
              >
                {isDone ? (
                  <span
                    aria-hidden="true"
                    className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-[#72D9B4] text-[0.75rem] font-extrabold text-[#092A31]"
                  >
                    &#10003;
                  </span>
                ) : isActive ? (
                  <span
                    aria-hidden="true"
                    className="uk-diag-step-spinner"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="h-[22px] w-[22px] flex-none rounded-full border-2 border-[#156374]"
                  />
                )}
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
