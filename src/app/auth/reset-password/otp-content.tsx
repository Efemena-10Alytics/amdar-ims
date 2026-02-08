"use client";

import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ResetPasswordOtpContentProps = {
  /** Current OTP value (5 digits). */
  otp: string;
  /** Called when OTP changes. */
  onOtpChange: (value: string) => void;
  /** Called when user clicks Continue. */
  onContinue: (e: React.FormEvent) => void;
  /** Continue button disabled when false (e.g. otp.length !== 5). */
  canContinue: boolean;
};

export default function ResetPasswordOtpContent({
  otp,
  onOtpChange,
  onContinue,
  canContinue,
}: ResetPasswordOtpContentProps) {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#092A31]">
        Verify your email
      </h2>
      <p className="mt-1 text-sm text-[#64748B]">
        Enter the 5-digit code we sent to your email.
      </p>

      <div className="mt-6 flex justify-center">
        <InputOTP
          maxLength={5}
          value={otp}
          onChange={onOtpChange}
          containerClassName="gap-2"
        >
          <InputOTPGroup
            className={cn(
              "gap-2",
              "[&_div]:h-12 [&_div]:w-12 [&_div]:rounded-lg [&_div]:border [&_div]:border-gray-200 [&_div]:bg-[#F8FAFC] [&_div]:text-center [&_div]:text-lg",
              "[&_div[data-active=true]]:border-primary [&_div[data-active=true]]:ring-2 [&_div[data-active=true]]:ring-primary/20",
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
        disabled={!canContinue}
        onClick={onContinue}
        className="mt-6 w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
      >
        Continue
      </Button>
    </>
  );
}
