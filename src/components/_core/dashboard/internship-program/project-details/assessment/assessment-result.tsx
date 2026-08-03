"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ProjectAssessmentAnswer,
  ProjectAssessmentField,
} from "@/features/interns-project/internship-project.types";
import type { ReadinessTestSubmitResultData } from "@/features/readiness-test/types";

type AssessmentResultProps = {
  result: ReadinessTestSubmitResultData;
  /** Highest score the questions allow — the denominator in "8/10". */
  maxScore: number;
  isPreAssessment: boolean;
  fields: ProjectAssessmentField[];
  /** Empty for the moment between submitting and the refetch landing. */
  answers: ProjectAssessmentAnswer[];
  onClose: () => void;
};

const CHOICE_TYPES = new Set(["single_choice", "multiple_choice", "dropdown"]);

/** Renders 8 as "8" but keeps 7.5 intact. */
function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ScoreRing({ percentage }: { percentage: number }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative mx-auto size-28">
      <svg
        className="size-full -rotate-90"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        aria-hidden
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#E4EFE8"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#3A8E53"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-[#173740]">
          {Math.round(progress)}
        </span>
      </div>
    </div>
  );
}

function QuestionReview({
  field,
  answer,
}: {
  field: ProjectAssessmentField;
  answer: ProjectAssessmentAnswer | undefined;
}) {
  const selectedIds = new Set(answer?.option_ids ?? []);
  const isCorrect = answer?.is_correct ?? null;
  const isChoice = CHOICE_TYPES.has(field.type);
  const hasAnswer =
    selectedIds.size > 0 || Boolean(answer?.value && answer.value.trim());

  return (
    <li className="rounded-xl bg-[#F7F9FA] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold text-[#173740]">{field.label}</p>
        {isCorrect != null ? (
          <span
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-white",
              isCorrect ? "bg-[#3A8E53]" : "bg-[#C0453F]",
            )}
            aria-label={isCorrect ? "Correct answer" : "Incorrect answer"}
          >
            {isCorrect ? (
              <Check className="size-3" aria-hidden />
            ) : (
              <X className="size-3" aria-hidden />
            )}
          </span>
        ) : null}
      </div>

      {isChoice ? (
        <ul className="mt-3 space-y-2">
          {field.options.map((option) => {
            const isSelected = selectedIds.has(option.id);
            // Neutral highlight unless the question is marked right or wrong.
            const selectedTone =
              isCorrect == null
                ? "bg-[#2F6A78] text-white"
                : isCorrect
                  ? "bg-[#3A8E53] text-white"
                  : "bg-[#C0453F] text-white";

            return (
              <li
                key={option.id}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm",
                  isSelected
                    ? `${selectedTone} font-medium`
                    : "bg-[#EEF3F5] text-[#64748B]",
                )}
              >
                <span
                  className={cn(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                    isSelected ? "border-white" : "border-[#BCD0D5]",
                  )}
                  aria-hidden
                >
                  {isSelected ? (
                    <span className="size-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : answer?.value ? (
        <p className="mt-3 rounded-lg bg-white px-4 py-3 text-sm whitespace-pre-line text-[#3F5E68]">
          {answer.value}
        </p>
      ) : null}

      {!hasAnswer ? (
        <p className="mt-3 text-sm text-[#94A3B8]">Not answered</p>
      ) : null}
    </li>
  );
}

const AssessmentResult = ({
  result,
  maxScore,
  isPreAssessment,
  fields,
  answers,
  onClose,
}: AssessmentResultProps) => {
  const percentage = result.percentage_score;
  const hasMaxScore = maxScore > 0;
  const answersByFieldId = new Map(
    answers.map((answer) => [answer.field_id, answer]),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="text-center">
        <ScoreRing percentage={percentage} />

        <p className="mt-4 text-lg font-semibold text-[#173740]">
          {hasMaxScore
            ? `You scored ${formatScore(result.total_score)}/${formatScore(maxScore)}`
            : `You scored ${Math.round(percentage)}%`}
        </p>
        <p className="mt-1 text-sm text-[#64748B]">
          {isPreAssessment
            ? "This is your starting point. You'll take the post-assessment after the project to see how far you've come."
            : "That's a wrap. Compare this with your pre-assessment score to see your progress on this project."}
        </p>
      </div>

      {answers.length === 0 ? (
        <p className="mt-6 text-center text-sm text-[#94A3B8]">
          Loading your answers...
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {fields.map((field) => (
            <QuestionReview
              key={field.id}
              field={field}
              answer={answersByFieldId.get(field.id)}
            />
          ))}
        </ul>
      )}

      <div className="mx-auto mt-6 w-full max-w-lg pb-4">
        <Button
          type="button"
          onClick={onClose}
          className="h-12 w-full cursor-pointer rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default AssessmentResult;
