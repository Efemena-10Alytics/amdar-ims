"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ReadinessTestField from "@/components/_core/readiness-test/readiness-test-field";
import {
  isReadinessTestFieldAnswered,
  type ReadinessTestFieldAnswer,
} from "@/features/readiness-test/field-answers";
import { getSortedReadinessTestFields } from "@/features/readiness-test/get-sorted-form-fields";
import type { ReadinessTestForm } from "@/features/readiness-test/types";

type ReadinessTestDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReadinessTestForm | null | undefined;
  durationMinutes?: number;
  title?: string;
  onComplete?: () => void;
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

  const activeField = fields[fieldIndex];
  const activeAnswer = activeField ? answers[String(activeField.id)] : undefined;
  const totalFields = fields.length;
  const canContinue = activeField
    ? isReadinessTestFieldAnswered(activeField, activeAnswer)
    : false;
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

  const handleContinue = () => {
    if (!activeField || !canContinue) return;
    if (fieldIndex < totalFields - 1) {
      setFieldIndex((prev) => prev + 1);
      return;
    }
    onComplete?.();
    onOpenChange(false);
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

            <Button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className="mt-5 h-12 w-full rounded-full bg-primary text-base text-white hover:bg-primary/90 disabled:bg-[#9DB8C0]"
            >
              {fieldIndex < totalFields - 1 ? "Continue" : "Finish Quiz"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReadinessTestDrawer;
