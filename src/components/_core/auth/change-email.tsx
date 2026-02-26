"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useInitiateChangeEmail } from "@/features/auth/use-initiate-change-email";
import { useVerifyChangeEmail } from "@/features/auth/use-verify-change-email";

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8] border border-gray-200",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
);

type Step = "email" | "token";

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
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(defaultEmail);
  const [token, setToken] = useState("");

  const { initiateChangeEmail, isInitiating, errorMessage: initiateError } =
    useInitiateChangeEmail();
  const { verifyChangeEmail, isVerifying, errorMessage: verifyError } =
    useVerifyChangeEmail();

  const errorMessage = step === "email" ? initiateError : verifyError;
  const isBusy = isInitiating || isVerifying;

  useEffect(() => {
    if (open) {
      setStep("email");
      setEmail(defaultEmail);
      setToken("");
    }
  }, [open, defaultEmail]);

  const handleSubmitEmail = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    try {
      await initiateChangeEmail(trimmed);
      setStep("token");
    } catch {
      // initiateError set by hook
    }
  };

  const handleSubmitToken = async () => {
    if (!canVerifyToken) return;
    try {
      await verifyChangeEmail(token);
      onContinue?.(email.trim());
      onOpenChange(false);
    } catch {
      // verifyError set by hook
    }
  };

  const canVerifyToken = token.length === 5;

  const handleBack = () => {
    setStep("email");
    setToken("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-2xl border-gray-100 p-6"
        showCloseButton={true}
      >
        {step === "email" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#092A31] text-left">
                Enter new email address
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-[#64748B] mt-1">
              We&apos;ll send a verification code to this address.
            </p>
            <div className="mt-4">
              <label
                htmlFor="change-email-input"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                New email
              </label>
              <input
                id="change-email-input"
                type="email"
                placeholder="Enter your new email address"
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
              onClick={handleSubmitEmail}
              disabled={!email.trim() || isBusy}
              className="mt-6 w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
            >
              {isInitiating ? "Sending code…" : "Continue"}
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#092A31] text-left">
                Enter verification code
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-[#64748B] mt-1">
              We sent a code to <span className="font-medium text-[#092A31]">{email}</span>. Enter it below.
            </p>
            <div className="mt-6 flex justify-center">
              <InputOTP
                maxLength={5}
                value={token}
                onChange={setToken}
                containerClassName="gap-2"
              >
                <InputOTPGroup
                  className={cn(
                    "gap-2",
                    "[&_div]:h-12 [&_div]:w-12 [&_div]:rounded-lg [&_div]:border [&_div]:border-gray-200 [&_div]:bg-[#F8FAFC] [&_div]:text-center [&_div]:text-lg",
                    "[&_div[data-active=true]]:border-[#156374] [&_div[data-active=true]]:ring-2 [&_div[data-active=true]]:ring-[#156374]/20",
                  )}
                >
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {errorMessage && (
              <p className="text-sm text-red-600 mt-2" role="alert">
                {errorMessage}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="button"
                onClick={handleSubmitToken}
                disabled={!canVerifyToken || isBusy}
                className="w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
              >
                {isVerifying ? "Verifying…" : "Verify & change email"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={isBusy}
                className="text-[#64748B] hover:text-[#092A31]"
              >
                Back to change email
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmail;
