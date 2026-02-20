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
import { useVerifyChangeEmail } from "@/features/auth/use-verify-change-email";

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
  const { verifyChangeEmail, isVerifying, errorMessage } =
    useVerifyChangeEmail();

  useEffect(() => {
    if (open) setEmail(defaultEmail);
  }, [open, defaultEmail]);

  const handleContinue = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    try {
      await verifyChangeEmail(trimmed);
      onContinue?.(trimmed);
      onOpenChange(false);
    } catch {
      // errorMessage set by hook
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
        {errorMessage && (
          <p className="text-sm text-red-600 mt-2" role="alert">
            {errorMessage}
          </p>
        )}
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!email.trim() || isVerifying}
          className="mt-6 w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
        >
          {isVerifying ? "Verifying…" : "Continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmail;
