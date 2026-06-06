"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ReadinessTestField from "@/components/_core/readiness-test/readiness-test-field";
import { buildFormSubmitPayload } from "@/features/readiness-test/build-form-submit-payload";
import {
  isReadinessTestFieldAnswered,
  type ReadinessTestFieldAnswer,
} from "@/features/readiness-test/field-answers";
import { getSortedReadinessTestFields } from "@/features/readiness-test/get-sorted-form-fields";
import { useSubmitDiagnosticTest } from "@/features/readiness-test/use-submit-diagnostic-test";
import type { ReadinessTestForm } from "@/features/readiness-test/types";

type ReadinessTestDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReadinessTestForm | null | undefined;
  durationMinutes?: number;
  title?: string;
  onComplete?: () => void | Promise<void>;
};

const ReadinessTestDrawer = ({
  open,
  onOpenChange,
  form,
  durationMinutes = 10,
  title = "Readiness Quiz",
  onComplete,
}: ReadinessTestDrawerProps) => {
  const fields = useMemo(() => getSortedReadinessTestFields(form), [form]);
  const [answers, setAnswers] = useState<Record<string, ReadinessTestFieldAnswer>>({});
  const [fieldIndex, setFieldIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const { submitDiagnosticTestForm, isSubmitting, errorMessage } =
    useSubmitDiagnosticTest();

  const activeField = fields[fieldIndex];
  const activeAnswer = activeField ? answers[String(activeField.id)] : undefined;
  const totalFields = fields.length;
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

  useEffect(() => {
    if (!open) return;
    setFieldIndex(0);
    setAnswers({});
    setSecondsLeft(durationMinutes * 60);
  }, [open, durationMinutes, form?.id]);

  useEffect(() => {
    if (!open || secondsLeft <= 0 || totalFields === 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open, secondsLeft, totalFields]);

  const handleBack = () => {
    if (!canGoBack || isSubmitting) return;
    setFieldIndex((prev) => prev - 1);
  };

  const handleContinue = async () => {
    if (!activeField || !canContinue || isSubmitting) return;

    if (!isLastField) {
      setFieldIndex((prev) => prev + 1);
      return;
    }

    if (!form?.id) return;

    try {
      const payload = buildFormSubmitPayload(form, answers);
      await submitDiagnosticTestForm(form.id, payload);
      onOpenChange(false);
      await onComplete?.();
    } catch {
      // errorMessage is set by the hook
    }
  };

  if (!activeField) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l-0 bg-[#F7FAFB] p-0 sm:max-w-135"
      >
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

            {errorMessage ? (
              <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
            ) : null}

            <div className="mt-5 flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={!canGoBack || isSubmitting}
                onClick={handleBack}
                className="h-12 flex-1 rounded-full border-[#C5D6DC] bg-white text-base font-medium text-[#2D6A78] hover:bg-[#EEF4F6] disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>

              <Button
                type="button"
                disabled={!canContinue || isSubmitting}
                onClick={() => void handleContinue()}
                className="h-12 flex-1 rounded-full bg-primary text-base text-white hover:bg-primary/90 disabled:bg-[#9DB8C0]"
              >
                {isSubmitting
                  ? "Submitting..."
                  : isLastField
                    ? "Finish Quiz"
                    : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReadinessTestDrawer;
