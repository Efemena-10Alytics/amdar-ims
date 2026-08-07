"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import UserDetails from "@/components/_core/dashboard/internship-program/internship-details/career-center/drawers/user-details";

const LETTER_REASONS = [
  { value: "job-offer", label: "Job Offer" },
  { value: "studies", label: "Studies" },
  { value: "visa", label: "VISA" },
] as const;

type ReferenceLetterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ReferenceLetterFormState = {
  reason: string;
  additionalInfo: string;
};

const INITIAL_FORM_STATE: ReferenceLetterFormState = {
  reason: "",
  additionalInfo: "",
};

const fieldClassName =
  "rounded-xl border-[#DCE5E9] bg-[#F6F8FA] text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none";

const ReferenceLetterDrawer = ({
  open,
  onOpenChange,
}: ReferenceLetterDrawerProps) => {
  const [form, setForm] = useState<ReferenceLetterFormState>(INITIAL_FORM_STATE);

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM_STATE);
    }
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOpenChange(false);
  };

  const canSubmit = Boolean(form.reason.trim());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
            <SheetTitle className="mt-1 text-xl font-semibold text-[#173740] sm:text-2xl">
              Reference letter
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <UserDetails />

            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Fill in this section
            </p>

            <div className="mt-3 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                  Reason for letter
                </label>
                <Select
                  value={form.reason}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, reason: value }))
                  }
                >
                  <SelectTrigger
                    className={cn(
                      fieldClassName,
                      "h-11 w-full px-3 data-placeholder:text-[#94A3B8]",
                    )}
                  >
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-xs font-medium text-[#64748B]">
                        Why are you requesting
                      </SelectLabel>
                      {LETTER_REASONS.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="reference-letter-additional-info"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Additional info
                </label>
                <textarea
                  id="reference-letter-additional-info"
                  value={form.additionalInfo}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      additionalInfo: event.target.value,
                    }))
                  }
                  placeholder="Enter additional info"
                  rows={4}
                  className={cn(
                    fieldClassName,
                    "w-full resize-none px-3 py-3 outline-none focus-visible:border-[#156374]",
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-12 w-full rounded-full bg-[#134E5E] text-base font-semibold text-white hover:bg-[#0E6174] disabled:bg-[#9DB8C0]"
            >
              Request letter
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ReferenceLetterDrawer;
