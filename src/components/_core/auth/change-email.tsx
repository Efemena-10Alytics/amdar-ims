"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8] border border-gray-200",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
);

interface ChangeEmailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue?: (email: string) => void;
  defaultEmail?: string;
}

const ChangeEmail = ({
  open,
  onOpenChange,
  onContinue,
  defaultEmail = "",
}: ChangeEmailProps) => {
  const [email, setEmail] = useState(defaultEmail);

  useEffect(() => {
    if (open) setEmail(defaultEmail);
  }, [open, defaultEmail]);

  const handleContinue = () => {
    const trimmed = email.trim();
    if (trimmed) {
      onContinue?.(trimmed);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-2xl border-gray-100 p-6"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#092A31] text-left">
            Re-enter email address
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#64748B] mt-1">
          Kindly enter your correct email address
        </p>
        <div className="mt-4">
          <label
            htmlFor="change-email-input"
            className="block text-sm font-medium text-[#092A31] mb-1.5"
          >
            Email
          </label>
          <input
            id="change-email-input"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputBase}
            autoFocus
          />
        </div>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!email.trim()}
          className="mt-6 w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmail;
