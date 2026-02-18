"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ChangeEmail from "@/components/_core/auth/change-email";
import ErrorAlert from "@/components/_core/auth/error-alert";
import {
  useResendOtp,
  RESEND_COOLDOWN_SECONDS,
} from "@/features/auth/use-resend-otp";
import { useVerifyEmail } from "@/features/auth/use-verify-otp";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Email to show in the message (e.g. the one the code was sent to). */
  email?: string;
  /** When true, do not redirect after verification; close modal instead. */
  skipRedirect?: boolean;
  /** Redirect path after verification (used when skipRedirect is false). */
  redirect?: string;
  /** Program id for success route (used when skipRedirect is false). */
  program?: string;
  /** Called when verification succeeds (e.g. to show success modal). */
  onVerifySuccess?: () => void;
}

export function OtpModal({
  open,
  onOpenChange,
  email: initialEmail = "",
  skipRedirect = true,
  redirect = "",
  program = "",
  onVerifySuccess,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { verify, isVerifying, errorMessage } = useVerifyEmail();
  const { resend, isResending, resendErrorMessage } = useResendOtp({
    onResendSuccess: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS),
  });

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (open && secondsLeft === 0) setSecondsLeft(RESEND_COOLDOWN_SECONDS);
  }, [open]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const canVerify = otp.length === 5;
  const canResend = secondsLeft <= 0;

  const handleResend = () => {
    if (!canResend || isResending) return;
    resend();
  };

  const handleVerify = async () => {
    if (!canVerify) return;
    try {
      await verify(otp, {
        redirect: redirect || undefined,
        program: program || undefined,
        skipRedirect,
      });
      if (skipRedirect) {
        onVerifySuccess?.();
        onOpenChange(false);
      }
    } catch {
      // errorMessage set by hook
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[440px] w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden border border-gray-200 rounded-2xl">
          <DialogTitle className="sr-only">Email verification</DialogTitle>
          <div className="p-6">
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-2xl font-semibold text-[#092A31]">
                Email verification
              </h2>
              {(errorMessage || resendErrorMessage) && (
                <ErrorAlert
                  error={errorMessage || resendErrorMessage || ""}
                />
              )}
            </div>

            <p className="text-sm text-[#64748B] leading-relaxed">
              Check your <span className="font-semibold">email inbox</span> or{" "}
              <span className="font-semibold">spam</span>, we sent a code to{" "}
              {email || "your email"}. If this is not your mail,{" "}
              <button
                type="button"
                onClick={() => setChangeEmailOpen(true)}
                className="text-[#156374] font-medium underline hover:no-underline"
              >
                Change email
              </button>
            </p>

            <div className="mt-6 flex justify-center">
              <InputOTP
                maxLength={5}
                value={otp}
                onChange={setOtp}
                containerClassName="gap-2"
              >
                <InputOTPGroup
                  className={cn(
                    "gap-2",
                    "[&_div]:h-12 [&_div]:w-12 [&_div]:rounded-lg [&_div]:border [&_div]:border-gray-200 [&_div]:bg-[#F8FAFC] [&_div]:text-center [&_div]:text-lg",
                    "[&_div[data-active=true]]:border-[#156374] [&_div[data-active=true]]:ring-2 [&_div[data-active=true]]:ring-[#156374]/20"
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

            <Button
              type="button"
              disabled={!canVerify || isVerifying}
              onClick={handleVerify}
              className="mt-6 w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
            >
              {isVerifying ? "Verifying…" : "Verify"}
            </Button>

            <p className="mt-6 text-center text-sm text-[#64748B]">
              Didn&apos;t get a code?{" "}
              {canResend ? (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResend}
                  className="text-[#156374] font-medium hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending…" : "Resend code"}
                </button>
              ) : (
                <span className="text-[#156374] font-medium">
                  {formatTime(secondsLeft)}
                </span>
              )}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ChangeEmail
        open={changeEmailOpen}
        onOpenChange={setChangeEmailOpen}
        defaultEmail={email}
        onContinue={setEmail}
      />
    </>
  );
}

export default OtpModal;
