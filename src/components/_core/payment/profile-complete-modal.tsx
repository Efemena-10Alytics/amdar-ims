"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileCompleteModal({
  open,
  onOpenChange,
}: ProfileCompleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center mt-2">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#359E5B] bg-[#f0fdf4] text-[#359E5B]"
              aria-hidden
            >
              <Check className="h-8 w-8" strokeWidth={2} />
            </span>
          </div>
          <DialogTitle className="text-xl text-center font-semibold text-[#092A31] mt-4">
            Profile setup complete
          </DialogTitle>
          <p className="text-sm text-center text-[#64748B] mt-2">
            Your profile has been updated successfully.
          </p>
          <Button asChild className="w-full mt-6 rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium">
            <Link href="https://www.amdari.io/dashboard" onClick={() => onOpenChange(false)}>
              Proceed to dashboard
            </Link>
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
