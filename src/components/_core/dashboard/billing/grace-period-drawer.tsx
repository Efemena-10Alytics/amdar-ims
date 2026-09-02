"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type GracePeriodDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type GracePeriodFormState = {
  firstName: string;
  lastName: string;
  email: string;
  cohort: string;
  program: string;
  reason: string;
  gracePeriodDate: string;
};

const INITIAL_FORM_STATE: GracePeriodFormState = {
  firstName: "",
  lastName: "",
  email: "",
  cohort: "",
  program: "",
  reason: "",
  gracePeriodDate: "",
};

const FIELD_LABEL_CLASS = "mb-1.5 block text-sm font-medium text-[#092A31]";
const FIELD_INPUT_CLASS =
  "h-11 rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374] focus-visible:ring-0";

function formatDisplayDate(ymd: string): string {
  if (!ymd) return "";
  const date = new Date(`${ymd}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function formatDateToLocalYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function GracePeriodDrawer({ open, onOpenChange }: GracePeriodDrawerProps) {
  const [form, setForm] = useState<GracePeriodFormState>(INITIAL_FORM_STATE);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(INITIAL_FORM_STATE);
      setCalendarOpen(false);
    }
    onOpenChange(nextOpen);
  };

  const updateField = (field: keyof GracePeriodFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.reason.trim() &&
    form.gracePeriodDate.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // TODO: wire up to the grace period request API once available.
      handleOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l-0 p-0 sm:max-w-xl"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="border-b border-[#E2EBEF] px-6 pt-5 pb-4">
            <SheetClose className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
              <X className="size-3.5" />
              Close
            </SheetClose>
            <SheetTitle className="mt-1 font-clash-display text-xl text-[#092A31] sm:text-2xl">
              Request For Grace Period
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="grace-first-name" className={FIELD_LABEL_CLASS}>
                  First name
                </label>
                <Input
                  id="grace-first-name"
                  value={form.firstName}
                  onChange={updateField("firstName")}
                  placeholder="John"
                  className={FIELD_INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="grace-last-name" className={FIELD_LABEL_CLASS}>
                  Last name
                </label>
                <Input
                  id="grace-last-name"
                  value={form.lastName}
                  onChange={updateField("lastName")}
                  placeholder="Doe"
                  className={FIELD_INPUT_CLASS}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="grace-email" className={FIELD_LABEL_CLASS}>
                Email
              </label>
              <Input
                id="grace-email"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="example@gmail.com"
                className={FIELD_INPUT_CLASS}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="grace-cohort" className={FIELD_LABEL_CLASS}>
                Cohort
              </label>
              <Input
                id="grace-cohort"
                value={form.cohort}
                onChange={updateField("cohort")}
                placeholder="July"
                className={FIELD_INPUT_CLASS}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="grace-program" className={FIELD_LABEL_CLASS}>
                Program
              </label>
              <Input
                id="grace-program"
                value={form.program}
                onChange={updateField("program")}
                placeholder="Project Management"
                className={FIELD_INPUT_CLASS}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="grace-reason" className={FIELD_LABEL_CLASS}>
                Reason For Extension
              </label>
              <textarea
                id="grace-reason"
                value={form.reason}
                onChange={updateField("reason")}
                placeholder="Enter reason"
                rows={3}
                className={cn(
                  "w-full resize-none rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 py-3 text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374]",
                )}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="grace-date" className={FIELD_LABEL_CLASS}>
                Select Grace Period
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    id="grace-date"
                    type="button"
                    className={cn(
                      FIELD_INPUT_CLASS,
                      "flex w-full items-center justify-between text-left",
                    )}
                  >
                    <span
                      className={
                        form.gracePeriodDate ? "text-[#092A31]" : "text-[#94A3B8]"
                      }
                    >
                      {formatDisplayDate(form.gracePeriodDate) || "dd/mm/yyyy"}
                    </span>
                    <ChevronDown className="size-4 text-[#64748B]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      form.gracePeriodDate
                        ? new Date(`${form.gracePeriodDate}T12:00:00`)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        setForm((current) => ({
                          ...current,
                          gracePeriodDate: formatDateToLocalYmd(date),
                        }));
                        setCalendarOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div
              className="mt-4 flex items-start gap-2 rounded-xl p-3"
              style={{ background: "#FFF5D8", border: "0.5px solid #E4BF7F" }}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E4BF7F] text-white">
                <Info className="size-3" strokeWidth={3} />
              </span>
              <p className="text-xs leading-relaxed text-[#092A31]">
                Please note that the grace period extends up to 7 days after one
                month of internship commencement. You cannot request for a grace
                period beyond this timeframe
              </p>
            </div>
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              aria-busy={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#156374] text-base font-semibold text-white hover:bg-[#156374]/90 disabled:bg-[#9DB8C0]"
            >
              {isSubmitting ? "Submitting…" : "Proceed"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
