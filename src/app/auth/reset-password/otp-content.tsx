"use client";

import React from "react";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import ErrorAlert from "@/components/_core/auth/error-alert";
import { cn } from "@/lib/utils";

export type ResetPasswordOtpContentProps = {
  /** Email the code was sent to (from previous screen). */
  email?: string;
  /** Error message to display (e.g. from reset attempt). */
  errorMessage?: string;
  /** Current OTP value (5 digits). */
  otp: string;
  /** Called when OTP changes. */
  onOtpChange: (value: string) => void;
  /** Called when user clicks Verify. */
  onContinue: (e: React.FormEvent) => void;
  /** Verify button disabled when false (e.g. otp.length !== 5). */
  canContinue: boolean;
};

export default function ResetPasswordOtpContent({
  email = "",
  errorMessage,
  otp,
  onOtpChange,
  onContinue,
  canContinue,
}: ResetPasswordOtpContentProps) {
  const displayEmail = email || "your email";

  return (
    <>
      <h2 className="text-xl font-semibold text-[#092A31]">
        Email verification
      </h2>
      {errorMessage ? (
        <div className="mt-2">
          <ErrorAlert error={errorMessage} />
        </div>
      ) : null}
      <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
        Check your email, we sent a code to{" "}
        <span className="font-medium text-[#092A31]">{displayEmail}</span>. If
        this is not your mail,{" "}
        <Link
          href="/auth/forgot-password"
          className="text-[#156374] font-medium hover:underline"
        >
          Change email
        </Link>
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

      <Button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="mt-6 w-full rounded-lg bg-[#0F4652] hover:bg-[#0d3d47] text-white h-11 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
      >
        Verify
      </Button>

      <p className="mt-6 text-center text-sm text-[#64748B]">
        Didn&apos;t get a code?{" "}
        <Link
          href="/auth/forgot-password"
          className="text-[#156374] font-medium hover:underline"
        >
          Resend code
        </Link>
      </p>
    </>
  );
}
