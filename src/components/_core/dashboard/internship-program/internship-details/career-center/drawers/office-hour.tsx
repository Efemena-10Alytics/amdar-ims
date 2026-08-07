"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import UserDetails from "./user-details";

type OfficeHourDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type OfficeHourFormState = {
  reason: string;
};

const INITIAL_FORM_STATE: OfficeHourFormState = {
  reason: "",
};

const OfficeHourDrawer = ({ open, onOpenChange }: OfficeHourDrawerProps) => {
  const [form, setForm] = useState<OfficeHourFormState>(INITIAL_FORM_STATE);

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
              Office hour
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <UserDetails />

            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Fill in this section
            </p>

            <div className="mt-3">
              <label
                htmlFor="office-hour-reason"
                className="mb-1.5 block text-sm font-medium text-[#092A31]"
              >
                Reason for booking this session
              </label>
              <textarea
                id="office-hour-reason"
                value={form.reason}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
                placeholder="Enter reason for booking this session"
                rows={5}
                className={cn(
                  "w-full resize-none rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 py-3 text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374]",
                )}
              />
            </div>
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-12 w-full rounded-full bg-[#134E5E] text-base font-semibold text-white hover:bg-[#0E6174] disabled:bg-[#9DB8C0]"
            >
              Book session
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default OfficeHourDrawer;
