"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { ArrowUpRightIcon, CircleIcon } from "lucide-react";
import { useGetWeeklySurveyQuestions } from "@/features/weekly-survey/use-get-weekly-survey-questions";
import { WEEKLY_SURVEY_STATUS_QUERY_KEY } from "@/features/weekly-survey/use-get-weekly-survey-status";
import {
  useWeeklySurveyEligibility,
  type WeeklySurveyPhase,
} from "@/features/weekly-survey/use-weekly-survey-eligibility";
import {
  getWeeklySurveySubmitErrorMessage,
  submitWeeklySurvey,
} from "@/features/weekly-survey/submit-weekly-survey";
import {
  buildSubmitAnswers,
  followUpRequired,
  getByPath,
  getFollowUpFieldError,
  getMainFieldError,
  getScaleLabel,
  getVisibleQuestions,
  setByPath,
  validateSectionQuestions,
} from "@/features/weekly-survey/validation";
import type {
  WeeklySurveyAnswers,
  WeeklySurveyQuestion,
  WeeklySurveySection,
} from "@/features/weekly-survey/types";

const SECTION_ICON_MAP: Record<number, { type: "emoji" | "img"; value: string; bg: string }> = {
  2: { type: "emoji", value: "👨🏽‍💻", bg: "bg-[#86E9AA]" },
  3: { type: "emoji", value: "🧑🏽‍🏫", bg: "bg-white" },
  4: { type: "emoji", value: "✏️", bg: "bg-[#FFE082]" },
  5: { type: "img", value: "/logo.svg", bg: "bg-[#092A31]" },
};

function ProgressRing({ current, total }: { current: number; total: number }) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const filled = total > 0 ? (current / total) * circumference : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label="Survey section progress"
      className="relative flex size-12 shrink-0 items-center justify-center"
    >
      <svg className="absolute inset-0 -rotate-90" width="48" height="48" aria-hidden>
        <circle cx="24" cy="24" r={r} stroke="#C7F5D8" strokeWidth="3" fill="none" />
        <circle
          cx="24"
          cy="24"
          r={r}
          stroke="#22C55E"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs font-bold text-[#156374]">
        {current}/{total}
      </span>
    </div>
  );
}

function SectionHeader({
  section,
  sectionIndex,
  totalSections,
}: {
  section: WeeklySurveySection;
  sectionIndex: number;
  totalSections: number;
}) {
  const icon = SECTION_ICON_MAP[section.id];
  return (
    <div className="flex h-[76px] items-center justify-between gap-3">
      <div className="flex h-full flex-1 items-center gap-3 rounded-full bg-[#C7F5D8] px-2">
        <div
          className={`flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${icon?.bg ?? "bg-white"}`}
          aria-hidden
        >
          {icon?.type === "img" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon.value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl">{icon?.value ?? "📋"}</span>
          )}
        </div>
        <div>
          <p className="font-clash-display text-xl font-semibold text-[#156374] xs:text-2xl">
            {section.title}
          </p>
          <p className="font-sora text-base text-[#6296A2]">Your Weekly Survey Questions</p>
        </div>
      </div>
      <ProgressRing current={sectionIndex + 1} total={totalSections} />
    </div>
  );
}

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

function QuestionField({
  question,
  answers,
  onChange,
  showErrors,
}: {
  question: WeeklySurveyQuestion;
  answers: WeeklySurveyAnswers;
  onChange: (key: string, value: unknown) => void;
  showErrors: boolean;
}) {
  const val = getByPath(answers, question.key);
  const fu = question.follow_up;
  const followVal = fu ? getByPath(answers, fu.key) : undefined;
  const mainErr = showErrors ? getMainFieldError(question, answers) : null;
  const followErr = showErrors ? getFollowUpFieldError(question, answers) : null;

  if (question.type === "single_choice") {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {question.options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(question.key, opt.value)}
              className={`flex items-center gap-1 rounded-xl border px-3 py-2 font-sora text-sm font-medium transition-colors ${
                val === opt.value
                  ? "border-[#156374] bg-[#156374] text-white"
                  : "border-[#E8EFF1] bg-[#E8EFF1] text-[#5C6777] hover:border-[#156374]"
              }`}
            >
              <CircleIcon className={`size-3 ${val !== opt.value ? "" : "fill-green-500"}`} />{" "}
              {opt.label}
            </button>
          ))}
        </div>
        <FieldError message={mainErr} />
        {fu?.type === "text" && (
          <>
            <textarea
              value={(followVal as string) ?? ""}
              onChange={(e) => onChange(fu.key, e.target.value)}
              placeholder={fu.placeholder || ""}
              rows={4}
              aria-invalid={followErr ? true : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-[#101828] placeholder:text-[#98A2B3] focus:ring-2 focus:outline-none ${followErr ? "border-red-500 bg-red-50 focus:ring-red-300" : "border-[#E4E7EC] bg-[#F9FAFB] focus:ring-[#156374]"}`}
            />
            <FieldError message={followErr} />
          </>
        )}
      </div>
    );
  }

  if (question.type === "yes_no") {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex gap-3">
          {["yes", "no"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(question.key, v)}
              className={`flex items-center gap-1 rounded-xl border px-3 py-2 font-sora text-sm font-semibold capitalize transition-colors ${
                val === v
                  ? "border-[#156374] bg-[#156374] text-white"
                  : "border-[#E4E7EC] bg-white text-[#101828] hover:border-[#156374]"
              }`}
            >
              <CircleIcon className={`size-3 ${val !== v ? "" : "fill-green-500"}`} /> {v}
            </button>
          ))}
        </div>
        <FieldError message={mainErr} />
        {fu?.type === "text" && (
          <>
            <textarea
              value={(followVal as string) ?? ""}
              onChange={(e) => onChange(fu.key, e.target.value)}
              placeholder={fu.placeholder || ""}
              rows={4}
              aria-invalid={followErr ? true : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-[#101828] placeholder:text-[#98A2B3] focus:ring-2 focus:outline-none ${followErr ? "border-red-500 bg-red-50 focus:ring-red-300" : "border-[#E4E7EC] bg-[#F9FAFB] focus:ring-[#156374]"}`}
            />
            <FieldError message={followErr} />
          </>
        )}
      </div>
    );
  }

  if (question.type === "scale") {
    const min = question.min ?? 1;
    const max = question.max ?? 5;
    const nums: number[] = [];
    for (let i = min; i <= max; i++) nums.push(i);
    const FOLLOW_UP_MIN = 150;
    const followLen = String(followVal ?? "").length;
    const showFollowUp = fu?.type === "text" && followUpRequired(question, answers);
    return (
      <div className="flex w-full flex-col gap-3">
        {question.hint && <p className="text-xs text-[#667085]">{question.hint}</p>}
        <div className="flex flex-wrap gap-2">
          {nums.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(question.key, n)}
              className={`flex h-10 items-center justify-center gap-1 rounded-xl border px-3 font-sora text-sm font-semibold transition-colors ${
                val === n
                  ? "border-[#156374] bg-[#156374] text-white"
                  : "border-[#E8EFF1] bg-[#E8EFF1] text-[#5C6777] hover:border-[#156374]"
              }`}
            >
              <CircleIcon className={`size-3 ${val !== n ? "" : "fill-green-500"}`} />{" "}
              {getScaleLabel(n, min, max)}
            </button>
          ))}
        </div>
        <FieldError message={mainErr} />
        {showFollowUp && (
          <div className="flex flex-col gap-1">
            <textarea
              value={(followVal as string) ?? ""}
              onChange={(e) => onChange(fu!.key, e.target.value)}
              placeholder={fu!.placeholder || "Briefly explain why you are giving this rating"}
              rows={3}
              aria-invalid={followErr ? true : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-[#101828] placeholder:text-[#98A2B3] focus:ring-2 focus:outline-none ${followErr ? "border-red-500 bg-red-50 focus:ring-red-300" : "border-[#E4E7EC] bg-[#F9FAFB] focus:ring-[#156374]"}`}
            />
            {followLen < FOLLOW_UP_MIN && (
              <div className="flex justify-end">
                <span className="text-xs text-[#98A2B3]">
                  {FOLLOW_UP_MIN - followLen} more character
                  {FOLLOW_UP_MIN - followLen !== 1 ? "s" : ""} needed
                </span>
              </div>
            )}
            <FieldError message={followErr} />
          </div>
        )}
      </div>
    );
  }

  if (question.type === "multi_select") {
    const selected = Array.isArray(val) ? (val as string[]) : [];
    const FOLLOW_UP_MIN = 150;

    // Key for the "others" text field — from backend follow_up config,
    // or derived from the question's section prefix as a fallback.
    const othersKey =
      fu?.key ??
      (question.key.includes(".")
        ? question.key.slice(0, question.key.lastIndexOf(".") + 1) +
          "employability_help_others_text"
        : null);

    const showFollowUp = fu?.type === "text" && followUpRequired(question, answers);
    const showOthersTextarea = selected.includes("others") && !showFollowUp && !!othersKey;

    const othersTextVal = othersKey ? ((getByPath(answers, othersKey) as string) ?? "") : "";
    const followLen = String(followVal ?? "").length;

    const toggle = (optVal: string) => {
      let next: string[];
      if (selected.includes(optVal)) {
        next = selected.filter((v) => v !== optVal);
      } else if (optVal === "no_help") {
        next = ["no_help"];
      } else {
        next = [...selected.filter((v) => v !== "no_help"), optVal];
      }
      onChange(question.key, next);
    };

    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {question.options?.map((opt) => {
            const active = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`flex items-center gap-1 rounded-xl border px-3 py-2 font-sora text-sm font-medium transition-colors ${
                  active
                    ? "border-[#156374] bg-[#156374] text-white"
                    : "border-[#E8EFF1] bg-[#E8EFF1] text-[#5C6777] hover:border-[#156374]"
                }`}
              >
                <CircleIcon className={`size-3 ${active ? "fill-green-500" : ""}`} />
                {opt.label}
              </button>
            );
          })}
        </div>
        <FieldError message={mainErr} />
        {showFollowUp && (
          <div className="flex flex-col gap-1">
            <textarea
              value={(followVal as string) ?? ""}
              onChange={(e) => onChange(fu!.key, e.target.value)}
              placeholder={fu!.placeholder || "Briefly discuss"}
              rows={3}
              aria-invalid={followErr ? true : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-[#101828] placeholder:text-[#98A2B3] focus:ring-2 focus:outline-none ${followErr ? "border-red-500 bg-red-50 focus:ring-red-300" : "border-[#E4E7EC] bg-[#F9FAFB] focus:ring-[#156374]"}`}
            />
            {followLen < FOLLOW_UP_MIN && (
              <div className="flex justify-end">
                <span className="text-xs text-[#98A2B3]">
                  {FOLLOW_UP_MIN - followLen} more character
                  {FOLLOW_UP_MIN - followLen !== 1 ? "s" : ""} needed
                </span>
              </div>
            )}
            <FieldError message={followErr} />
          </div>
        )}
        {showOthersTextarea && (
          <div className="flex flex-col gap-1">
            <textarea
              value={othersTextVal}
              onChange={(e) => onChange(othersKey as string, e.target.value)}
              placeholder="Briefly discuss"
              rows={3}
              className="w-full rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-sm text-[#101828] placeholder:text-[#98A2B3] focus:ring-2 focus:ring-[#156374] focus:outline-none"
            />
          </div>
        )}
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <div className="w-full">
        <textarea
          value={(val as string) ?? ""}
          onChange={(e) => onChange(question.key, e.target.value)}
          placeholder={question.placeholder || "Give your response"}
          rows={6}
          aria-invalid={mainErr ? true : undefined}
          className={`w-full rounded-lg border px-3 py-2 font-sora text-sm text-[#101828] placeholder:text-[#98A2B3] focus:ring-2 focus:outline-none ${mainErr ? "border-red-500 bg-red-50 focus:ring-red-300" : "border-[#E4E7EC] bg-[#F9FAFB] focus:ring-[#156374]"}`}
        />
        <FieldError message={mainErr} />
      </div>
    );
  }

  return null;
}

export default function WeeklySurveyModal() {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<WeeklySurveyPhase>("intro");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<WeeklySurveyAnswers>({});
  const [flowComplete, setFlowComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSectionFieldErrors, setShowSectionFieldErrors] = useState(false);

  const { shouldRenderOverlay, cohortId, internshipCourseId, questionsEnabled } =
    useWeeklySurveyEligibility({ phase, flowComplete });

  const questionsQuery = useGetWeeklySurveyQuestions(questionsEnabled);

  const sections = useMemo(
    () => questionsQuery.data?.sections ?? [],
    [questionsQuery.data?.sections],
  );

  const surveySections = useMemo(
    () => sections.filter((s) => s.id > 1 && s.questions?.length),
    [sections],
  );

  // Clamped instead of synced via effect: surveySections can shrink (e.g. after
  // a refetch) between renders, and sectionIndex must never point past the end.
  const clampedSectionIndex = Math.min(
    sectionIndex,
    Math.max(surveySections.length - 1, 0),
  );
  const currentSection = surveySections[clampedSectionIndex];

  const visibleQuestionsInSection = useMemo(
    () => (currentSection ? getVisibleQuestions(currentSection, answers) : []),
    [currentSection, answers],
  );

  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    if (shouldRenderOverlay) {
      window.addEventListener("keydown", block);
      return () => window.removeEventListener("keydown", block);
    }
  }, [shouldRenderOverlay]);

  useEffect(() => {
    if (!shouldRenderOverlay) return;
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [shouldRenderOverlay]);

  useEffect(() => {
    if (phase !== "success") return;
    const burst = () => confetti({ particleCount: 70, spread: 68, origin: { y: 0.6 } });
    burst();
    const t1 = setTimeout(burst, 250);
    const t2 = setTimeout(burst, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  const setAnswer = useCallback((dottedKey: string, value: unknown) => {
    setShowSectionFieldErrors(false);
    setAnswers((prev) => {
      let next = setByPath(prev, dottedKey, value);
      if (dottedKey === "section_2.blockers_encountered" && value === "no") {
        next = setByPath(next, "section_2.blockers_description", undefined);
      }
      if (dottedKey === "section_2.drop_in_session_rating" && value === 5) {
        next = setByPath(next, "section_2.drop_in_session_rating_reason", undefined);
      }
      if (dottedKey === "section_3.mentor_support_rating" && value === 5) {
        next = setByPath(next, "section_3.mentor_rating_reason", undefined);
      }
      if (dottedKey === "section_4.mentorship_attended" && value === "no") {
        next = setByPath(next, "section_4.session_usefulness", undefined);
      }
      if (dottedKey === "section_4.employability_help_needed") {
        if (!Array.isArray(value) || !value.includes("others")) {
          next = setByPath(next, "section_4.employability_help_others_text", undefined);
        }
      }
      if (dottedKey === "section_5.lms_technical_issues") {
        if (value !== "frequently" && value !== "occasionally") {
          next = setByPath(next, "section_5.lms_issue_description", undefined);
        }
      }
      return next;
    });
  }, []);

  const invalidateStatus = useCallback(() => {
    if (cohortId == null || internshipCourseId == null) return;
    queryClient.invalidateQueries({
      queryKey: WEEKLY_SURVEY_STATUS_QUERY_KEY(cohortId, internshipCourseId),
    });
  }, [queryClient, cohortId, internshipCourseId]);

  const submitMutation = useMutation({
    mutationFn: submitWeeklySurvey,
    onSuccess: () => {
      setPhase("success");
    },
    onError: (err: unknown) => {
      const { message, isAlreadySubmitted } = getWeeklySurveySubmitErrorMessage(err);
      setSubmitError(message);
      if (isAlreadySubmitted) {
        setFlowComplete(true);
        invalidateStatus();
      }
    },
  });

  const handleSubmit = () => {
    setSubmitError(null);
    if (cohortId == null || internshipCourseId == null) return;
    submitMutation.mutate({
      cohort_id: cohortId,
      internship_course_id: internshipCourseId,
      answers: buildSubmitAnswers(answers),
    });
  };

  const handleDismissSuccess = () => {
    setFlowComplete(true);
    invalidateStatus();
  };

  const handleNext = () => {
    const section = surveySections[clampedSectionIndex];
    if (!section) return;
    if (!validateSectionQuestions(section, answers)) {
      setShowSectionFieldErrors(true);
      return;
    }
    setShowSectionFieldErrors(false);
    if (clampedSectionIndex >= surveySections.length - 1) {
      handleSubmit();
      return;
    }
    setSectionIndex(clampedSectionIndex + 1);
  };

  const handleBack = () => {
    setSubmitError(null);
    setShowSectionFieldErrors(false);
    if (clampedSectionIndex > 0) setSectionIndex(clampedSectionIndex - 1);
    else setPhase("intro");
  };

  if (!shouldRenderOverlay) return null;

  const isLastSection = clampedSectionIndex >= surveySections.length - 1;

  const isQuestionStep =
    phase === "questions" &&
    !questionsQuery.isLoading &&
    !questionsQuery.isError &&
    Boolean(currentSection);

  return (
    <div
      className="fixed inset-0 z-100 flex h-screen w-full items-center justify-center bg-[#0B0D0F]/85 font-sora"
      role="dialog"
      aria-modal="true"
      aria-labelledby="weekly-survey-title"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`pointer-events-auto flex w-[95%] max-w-[560px] flex-col overflow-hidden rounded-[10px] border border-white bg-white shadow-xl ${
          isQuestionStep
            ? "max-h-[min(94dvh,940px)] py-2 sm:py-3"
            : "max-h-[min(94dvh,940px)] p-5 pb-10 sm:p-10"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {phase === "success" && (
          <div className="max-h-[min(85dvh,820px)] min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            <div className="flex flex-col items-center justify-center gap-8 py-1 text-center">
              <div
                className="flex size-44 items-center justify-center rounded-full bg-[#FFF4C8] sm:size-52"
                aria-hidden
              >
                <span className="text-7xl sm:text-8xl">🎉</span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-[#092A31] sm:text-2xl">
                  Thank you so much for your feedback!
                </h2>
                <p className="text-base text-[#64748B]">
                  We&apos;re going to look into all of your response and make your Amdari
                  experience better. Cheers!
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismissSuccess}
                className="h-14 w-full max-w-xs rounded-[40px] bg-[#156374] text-lg font-semibold text-[#F2F4F7] transition hover:opacity-95"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {phase === "intro" && (
          <div className="max-h-[min(85dvh,820px)] min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            <div className="flex flex-col items-center justify-center gap-10 py-1">
              <div
                className="flex size-20 items-center justify-center rounded-full bg-[#C7F5D8]"
                aria-hidden
              >
                <span className="text-5xl">🤭</span>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="font-sora text-base text-[#092A31]">
                  Hi 👋, this is your weekly survey check-in
                </p>
                <h2
                  id="weekly-survey-title"
                  className="font-sora text-xl font-semibold text-[#5C6777]"
                >
                  Your honesty helps us help you. Share what&apos;s really going on so we can see
                  it, fix it, and be there when it matters.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSectionFieldErrors(false);
                  setPhase("questions");
                  setSectionIndex(0);
                }}
                className="flex h-14 w-full items-center justify-center gap-4 rounded-[40px] bg-[#156374] text-lg text-white transition duration-300 hover:opacity-95"
              >
                Start Survey
                <span className="flex size-6 items-center justify-center rounded-full bg-[#FFE082]">
                  <ArrowUpRightIcon className="size-4 text-[#156374]" />
                </span>
              </button>
            </div>
          </div>
        )}

        {phase === "questions" && questionsQuery.isLoading && (
          <div className="flex min-h-[200px] items-center justify-center text-[#667085]">
            Loading questions…
          </div>
        )}

        {phase === "questions" && questionsQuery.isError && (
          <div className="text-center text-red-600">
            Could not load survey questions. Please refresh the page.
          </div>
        )}

        {phase === "questions" &&
          !questionsQuery.isLoading &&
          !questionsQuery.isError &&
          !currentSection &&
          surveySections.length === 0 && (
            <div className="text-center text-amber-700">
              No survey questions are available. Please try again later.
            </div>
          )}

        {phase === "questions" && !questionsQuery.isLoading && !questionsQuery.isError && currentSection && (
          <div className="flex min-h-0 flex-1 flex-col px-5 py-3">
            <div className="mb-3 shrink-0">
              <SectionHeader
                section={currentSection}
                sectionIndex={clampedSectionIndex}
                totalSections={surveySections.length}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain py-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C7F5D8] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
              <div className="flex flex-col gap-8">
                {visibleQuestionsInSection.map((question) => (
                  <div key={question.key} className="flex flex-col gap-2">
                    <h3 className="font-sora text-base font-semibold text-[#092A31]">
                      {question.text}
                    </h3>
                    <QuestionField
                      question={question}
                      answers={answers}
                      onChange={setAnswer}
                      showErrors={showSectionFieldErrors}
                    />
                  </div>
                ))}
                {submitError && (
                  <p className="text-center text-sm text-red-600">{submitError}</p>
                )}
              </div>
            </div>
            <div className="shrink-0 pt-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 flex-1 rounded-full bg-[#F2F4F7] text-sm font-semibold text-[#101828] transition hover:bg-[#E4E7EC]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={submitMutation.isPending}
                  onClick={handleNext}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#156374] text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLastSection ? (
                    submitMutation.isPending ? (
                      "Submitting…"
                    ) : (
                      <>
                        Submit
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FFE082]">
                          <ArrowUpRightIcon className="size-4 text-[#156374]" />
                        </span>
                      </>
                    )
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
