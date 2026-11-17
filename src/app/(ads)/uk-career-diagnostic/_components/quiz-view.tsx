"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fpixel from "@/lib/fpixel";
import { QUESTIONS } from "../data";
import { DiagnosticHeader } from "./diagnostic-header";

interface QuizViewProps {
  qi: number;
  targetRole: string;
  answers: (number | null)[];
  onTargetRoleChange: (role: string) => void;
  onAdvanceFromQ1: (role: string) => void;
  onPickOption: (questionIndex: number, optionIndex: number) => void;
  onGoBack: () => void;
}

export function QuizView({
  qi,
  targetRole,
  answers,
  onTargetRoleChange,
  onAdvanceFromQ1,
  onPickOption,
  onGoBack,
}: QuizViewProps) {
  const [q1Error, setQ1Error] = useState("");
  const [pendingSelection, setPendingSelection] = useState<{
    qi: number;
    optionIdx: number;
  } | null>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackedQ1Ref = useRef(false);

  const totalSteps = 7;
  const currentStepNum = qi + 1;
  const progressPct = Math.round((currentStepNum / totalSteps) * 100);
  const locked = pendingSelection?.qi === qi;

  useEffect(() => {
    if (qi === 0) {
      roleInputRef.current?.focus();
      if (!trackedQ1Ref.current) {
        trackedQ1Ref.current = true;
        fpixel.event("ViewContent", {
          content_name: "UK Sponsorship Diagnostic Q1",
        });
      }
    }
  }, [qi]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const handleSelectOption = useCallback(
    (optionIdx: number) => {
      if (locked || qi === 0) return;
      setPendingSelection({ qi, optionIdx });
      const questionIdx = qi - 1;
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
      advanceTimerRef.current = setTimeout(() => {
        setPendingSelection(null);
        onPickOption(questionIdx, optionIdx);
      }, 250);
    },
    [locked, onPickOption, qi],
  );

  const handleBackClick = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setPendingSelection(null);
    onGoBack();
  }, [onGoBack]);

  useEffect(() => {
    if (qi === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      const idx = "abc".indexOf(key);
      if (idx > -1 && key.length === 1) {
        handleSelectOption(idx);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleSelectOption, qi]);

  const handleQ1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = targetRole.trim();
    if (trimmed.length < 2) {
      setQ1Error(
        "Please enter your target job role (minimum 2 characters).",
      );
      roleInputRef.current?.focus();
      return;
    }
    if ((trimmed.match(/[A-Za-z]/g) || []).length < 2) {
      setQ1Error(
        "Please enter a valid job title using letters (e.g. Data Analyst).",
      );
      roleInputRef.current?.focus();
      return;
    }
    setQ1Error("");
    onAdvanceFromQ1(trimmed);
  };

  const qData = qi > 0 ? QUESTIONS[qi - 1] : null;
  const selectedIndex =
    qi > 0
      ? pendingSelection?.qi === qi
        ? pendingSelection.optionIdx
        : answers[qi - 1]
      : null;

  return (
    <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-12">
      <DiagnosticHeader
        subtag="UK Sponsorship Readiness Check (60 Seconds)"
        rightSlot={
          <span className="text-[0.85rem] font-semibold text-[#C7D5D6]">
            Question {currentStepNum} of {totalSteps}
          </span>
        }
      />

      <div
        className="mb-6 h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStepNum}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FFF0B3] to-[#FFE082] shadow-[0_0_14px_rgba(255,224,130,0.55)] transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {qi === 0 ? (
        <div>
          <div className="mb-3.5 flex flex-col gap-1">
            <span className="inline-block text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#FFE082]">
              Career Path &amp; Target Role
            </span>
            <span className="text-[0.95rem] text-[#8EB7BE]">
              Diagnostic Step 1 of 7
            </span>
          </div>

          <h1 className="mb-3 text-[clamp(1.45rem,4.6vw,2.15rem)] font-extrabold leading-[1.1] tracking-[-0.015em] text-white">
            What exact job role are you trying to get{" "}
            <span className="text-[#FFE082]">sponsored for</span> in the UK?
          </h1>

          <p className="mb-5 text-[1rem] text-[#C7D5D6]">
            Enter your exact target job title so we can calibrate your score
            against current UK sponsorship quotas, SOC codes, and salary
            thresholds.
          </p>

          <form onSubmit={handleQ1Submit} noValidate>
            <div className="rounded-[22px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)]">
              <label
                htmlFor="target-role-input"
                className="mb-2.5 block text-[0.92rem] font-semibold text-[#F2F7F7]"
              >
                Target Job Title
              </label>
              <input
                ref={roleInputRef}
                id="target-role-input"
                type="text"
                maxLength={60}
                autoComplete="off"
                placeholder="e.g. Data Analyst, Soc Analyst, Project Manager"
                value={targetRole}
                onChange={(e) => {
                  const cleaned = e.target.value
                    .replace(/[^A-Za-z0-9 &/.,'()+#-]/g, "")
                    .replace(/\s{2,}/g, " ");
                  onTargetRoleChange(cleaned);
                  if (q1Error) setQ1Error("");
                }}
                aria-invalid={q1Error ? "true" : "false"}
                className={`min-h-[60px] w-full rounded-[14px] border-[1.5px] bg-[#092A31] px-4 py-3.5 text-[1.1rem] text-white placeholder:text-[#668B94] transition-[border-color,box-shadow] focus:border-[#FFE082] focus:shadow-[0_0_0_4px_rgba(255,224,130,0.18)] focus:outline-none ${
                  q1Error ? "border-[#FF8F78]" : "border-[#156374]/70"
                }`}
              />
              <div className="mt-1.5 min-h-[1.1em] text-[0.84rem] font-medium text-[#FF8F78]">
                {q1Error}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBackClick}
                className="invisible py-2 text-[0.92rem] text-[#C7D5D6] underline"
              >
                &larr; Back
              </button>
              <button type="submit" className="uk-diag-btn">
                Next <span className="arr">&rarr;</span>
              </button>
            </div>
          </form>
        </div>
      ) : qData ? (
        <div>
          <div className="mb-3.5 flex flex-col gap-1">
            <span className="inline-block text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#FFE082]">
              {qData.category}
            </span>
            <span className="text-[0.95rem] text-[#8EB7BE]">
              {qData.blurb}
            </span>
          </div>

          <h1 className="mb-5 text-[clamp(1.4rem,4.6vw,2.1rem)] font-extrabold leading-[1.12] tracking-[-0.015em] text-white">
            {qData.text}
          </h1>

          <div
            className="grid gap-3"
            role="radiogroup"
            aria-label={qData.text}
          >
            {qData.options.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              const letter = "ABC"[idx];
              return (
                <button
                  key={opt.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={locked}
                  onClick={() => handleSelectOption(idx)}
                  className={`group flex w-full cursor-pointer items-center gap-4 rounded-[18px] border-[1.5px] px-4 py-4 text-left text-[1.02rem] font-medium leading-[1.35] text-white transition-[border-color,transform,background-color] duration-150 ${
                    isSelected
                      ? "border-[#FFE082] bg-[#FFE082]/14"
                      : "border-[#156374]/60 bg-[#0C3640]/85 hover:translate-x-1 hover:border-[#FFE082] hover:bg-[#FFE082]/10"
                  }`}
                >
                  <span
                    className={`font-display grid h-[38px] w-[38px] flex-none place-items-center rounded-[12px] text-[0.95rem] font-extrabold transition-colors ${
                      isSelected
                        ? "bg-[#FFE082] text-[#092A31]"
                        : "bg-[#FFE082]/14 text-[#FFE082]"
                    }`}
                  >
                    {letter}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBackClick}
              className="cursor-pointer py-2 text-[0.92rem] text-[#C7D5D6] underline hover:text-white"
            >
              &larr; Back
            </button>
            <span className="text-[0.82rem] text-[#8EB7BE]">
              Tap an option or press A, B, or C
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
