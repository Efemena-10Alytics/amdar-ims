"use client";

import { Check, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

export default function SuccessModal({
  open,
  onOpenChange,
  email = "example@gmail.io",
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="z-1000 max-w-[calc(100%-2rem)] gap-0 rounded-xl border-0 bg-white px-6 py-14 text-center shadow-[0_28px_70px_rgba(9,42,49,0.25)] sm:max-w-180 sm:px-12 sm:py-20"
        overlayClassName="z-[999] bg-[#092A31]/45 backdrop-blur-[1px]"
        showCloseButton={false}
      >
        <div className="mx-auto flex size-28 items-center justify-center rounded-full border-4 border-[#35A866] text-[#35A866] sm:size-32">
          <Check className="size-14" strokeWidth={1.7} />
        </div>

        <DialogTitle className="mt-8 text-center text-xl font-bold leading-tight text-[#092A31] sm:text-2xl">
          You&apos;re in, we&apos;ll be in touch shortly
        </DialogTitle>
        <DialogDescription className="mx-auto mt-4 max-w-sm text-center text-sm font-semibold leading-relaxed text-[#8EA0B5] sm:text-base">
          We&apos;ve received your partnership request. Our team will review it
          in two business days.
        </DialogDescription>

        <div className="mx-auto mt-8 inline-flex max-w-full items-center gap-4 rounded-lg bg-[#E8EFF1] px-4 py-3 text-left text-sm font-semibold text-[#8EA0B5] sm:px-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#CDE1E6] text-primary">
            <Mail className="size-5" strokeWidth={1.9} />
          </span>
          <span>
            A confirmation email has been sent to{" "}
            <strong className="font-bold text-[#64748B]">{email}</strong>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
