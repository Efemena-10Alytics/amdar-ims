"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeferInternshipFormContent } from "@/components/_core/deferment/defer-internship-form-content";

type DefermentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DefermentDialog({ open, onOpenChange }: DefermentDialogProps) {
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setFormKey((value) => value + 1);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-lg sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-[#E2E8F0] bg-white px-5 py-4 text-left sm:px-6 sm:py-5">
          <DialogTitle className="text-xl font-semibold text-[#173740] sm:text-2xl">
            Defer internship
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <DeferInternshipFormContent
            key={formKey}
            idPrefix="dialog-"
            onSuccess={() => handleOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DefermentDialog;
