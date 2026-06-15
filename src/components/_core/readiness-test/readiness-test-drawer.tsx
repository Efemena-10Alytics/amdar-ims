"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ReadinessTestField from "@/components/_core/readiness-test/readiness-test-field";
import ReadinessTestResult from "@/components/_core/readiness-test/readiness-test-result";
import { buildFormSubmitPayload } from "@/features/readiness-test/build-form-submit-payload";
import {
  isReadinessTestFieldAnswered,
  type ReadinessTestFieldAnswer,
} from "@/features/readiness-test/field-answers";
import { getSortedReadinessTestFields } from "@/features/readiness-test/get-sorted-form-fields";
import { useSubmitReadinessTestForm } from "@/features/readiness-test/use-submit-readiness-test-form";
import type {
  ReadinessTestForm,
  ReadinessTestSubmitResultData,
} from "@/features/readiness-test/types";

type ReadinessTestDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReadinessTestForm | null | undefined;
  durationMinutes?: number;
  title?: string;
  finishLabel?: string;
  isProceeding?: boolean;
  /** Latest submission from API — shown in the drawer when reopening after a prior attempt. */
  savedResult?: ReadinessTestSubmitResultData | null;
  onSubmitted?: (result: ReadinessTestSubmitResultData) => void | Promise<void>;
  onComplete?: (result: ReadinessTestSubmitResultData) => void | Promise<void>;
};

const ReadinessTestDrawer = ({
  open,
  onOpenChange,
  form,
  durationMinutes = 10,
  title = "Readiness Quiz",
  finishLabel = "Finish Quiz",
  isProceeding = false,
  savedResult = null,
  onSubmitted,
  onComplete,
}: ReadinessTestDrawerProps) => {
  const fields = useMemo(() => getSortedReadinessTestFields(form), [form]);
  const [answers, setAnswers] = useState<Record<string, ReadinessTestFieldAnswer>>({});
  const [fieldIndex, setFieldIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [localError, setLocalError] = useState("");
  const [isRetaking, setIsRetaking] = useState(false);
  const [submitResult, setSubmitResult] =
    useState<ReadinessTestSubmitResultData | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const { submitForm, isSubmitting, errorMessage } = useSubmitReadinessTestForm();
  const isBusy = isSubmitting || isSavingProgress;

  const activeField = fields[fieldIndex];
  const activeAnswer = activeField ? answers[String(activeField.id)] : undefined;
  const totalFields = fields.length;
  const displayedResult =
    submitResult ?? (!isRetaking ? savedResult : null);
  const showResult = displayedResult != null;
  const canContinue = activeField
    ? isReadinessTestFieldAnswered(activeField, activeAnswer)
    : false;
  const isLastField = fieldIndex >= totalFields - 1;
  const canGoBack = fieldIndex > 0;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const timerToneClass =
    secondsLeft <= 3 * 60
      ? "bg-[#FDECEC] text-[#AA3030]"
      : secondsLeft <= 6 * 60
        ? "bg-[#FFF1C6] text-[#564103]"
        : "bg-[#D8F6DC] text-[#3A8E53]";

  const resetQuizState = () => {
    setFieldIndex(0);
    setAnswers({});
    setLocalError("");
    setSubmitResult(null);
    setSecondsLeft(durationMinutes * 60);
  };

  useEffect(() => {
    if (!open) {
      resetQuizState();
      setIsRetaking(false);
      return;
    }
    setIsRetaking(false);
    setFieldIndex(0);
    setAnswers({});
    setLocalError("");
    setSubmitResult(null);
    setSecondsLeft(durationMinutes * 60);
  }, [open, durationMinutes, form?.id]);

  useEffect(() => {
    if (!open || showResult || secondsLeft <= 0 || totalFields === 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open, showResult, secondsLeft, totalFields]);

  const handleBack = () => {
    if (!canGoBack || isBusy) return;
    setFieldIndex((prev) => prev - 1);
  };

  const handleContinue = async () => {
    if (!activeField || !canContinue || isBusy) return;

    if (!isLastField) {
      setFieldIndex((prev) => prev + 1);
      return;
    }

    if (!form?.id) {
      setLocalError("Unable to submit: form id is missing.");
      return;
    }

    try {
      const payload = buildFormSubmitPayload(form, answers);
      const response = await submitForm(form.id, payload);

      if (!response.data) {
        setLocalError("Unable to load your quiz results. Please try again.");
        return;
      }

      setSubmitResult(response.data);

      setIsSavingProgress(true);
      try {
        await onSubmitted?.(response.data);
      } catch {
        setLocalError(
          "Your answers were submitted, but we couldn't save your progress. Please try again.",
        );
      } finally {
        setIsSavingProgress(false);
      }
    } catch {
      // errorMessage is set by the hook
    }
  };

  const handleRetake = () => {
    setIsRetaking(true);
    resetQuizState();
  };

  const handleProceed = async () => {
    if (!displayedResult || isProceeding) return;

    try {
      await onComplete?.(displayedResult);
      onOpenChange(false);
    } catch {
      // Parent handles error display
    }
  };

  if (!showResult && !activeField) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l-0 p-0 sm:max-w-140"
      >
        {showResult && displayedResult ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-[#E2EBEF] px-6 pt-5 pb-4">
              <div className="flex items-center justify-between gap-4">
                <SheetTitle className="text-2xl font-semibold text-[#173740] sm:text-3xl">
                  {title}
                </SheetTitle>
                <Button
                  type="button"
                  onClick={handleRetake}
                  disabled={isProceeding}
                  className="h-10 shrink-0 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Retake
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ReadinessTestResult
                embedded
                totalScore={displayedResult.total_score}
                title={title}
                onProceed={handleProceed}
                isProceeding={isProceeding}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="border-b border-[#E2EBEF] px-6 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <SheetClose className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
                  <X className="size-3.5" />
                  Close
                </SheetClose>
              </div>
              <SheetTitle className="mt-3 text-4xl font-semibold text-[#173740]">
                {title}
              </SheetTitle>
              <div className="flex items-center justify-between">
                <div
                  className={`mt-2 inline-flex flex-col items-center rounded-md px-2 py-1 text-sm font-semibold ${timerToneClass}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span>{minutes}</span>
                    <span>:</span>
                    <span>{seconds}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2 text-[10px] font-medium">
                    <span>Min</span>
                    <span>Sec</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#A4B4BC]">
                  Questions {fieldIndex + 1} Of {totalFields}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activeField ? (
                <ReadinessTestField
                  field={activeField}
                  value={activeAnswer}
                  onChange={(value) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [String(activeField.id)]: value,
                    }))
                  }
                />
              ) : null}

              {(localError || errorMessage) ? (
                <p className="mt-4 text-sm text-destructive">
                  {localError || errorMessage}
                </p>
              ) : null}

              <div className="mt-5 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canGoBack || isBusy}
                  onClick={handleBack}
                  className="h-12 flex-1 rounded-full border-[#C5D6DC] bg-white text-base font-medium text-[#2D6A78] hover:bg-[#EEF4F6] disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </Button>

                <Button
                  type="button"
                  disabled={!canContinue || isBusy}
                  onClick={() => void handleContinue()}
                  className="h-12 flex-1 cursor-pointer rounded-full bg-primary text-base text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-[#9DB8C0]"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isSavingProgress
                      ? "Saving..."
                      : isLastField
                        ? finishLabel
                        : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ReadinessTestDrawer;
