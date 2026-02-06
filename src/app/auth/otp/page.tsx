"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ChangeEmail from "@/components/_core/auth/change-email";
import ErrorAlert from "@/components/_core/auth/error-alert";
import {
  useResendOtp,
  RESEND_COOLDOWN_SECONDS,
} from "@/features/auth/use-resend-otp";
import { useVerifyEmail } from "@/features/auth/use-verify-otp";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const OtpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") ?? "";
  const emailParam = searchParams.get("email") ?? "";
  const redirectParam = searchParams.get("redirect") ?? "";
  const uStatusParam = searchParams.get("u-status") ?? "";

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(emailParam || "amberinc.io");
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const { verify, isVerifying, errorMessage } = useVerifyEmail();
  const { resend, isResending, resendErrorMessage } = useResendOtp({
    onResendSuccess: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS),
  });

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

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
    if (typeParam) {
      const params = new URLSearchParams({ type: typeParam });
      if (email) params.set("email", email);
      router.push(`/auth/reset-password?${params.toString()}`);
    } else {
      await verify(otp, {
        redirect: redirectParam || undefined,
        newUser: uStatusParam === "new",
      });
    }
  };

  return (
    <main className="flex-1 w-full min-h-full overflow-y-auto flex flex-col">
      <div className="flex justify-end p-6">
        <Link href="/auth/sign-in" className="cursor-pointer">
          <Button
            variant="outline"
            className="rounded-md bg-[#C8DDE3] border-[#C8DDE3] text-[#092A31] hover:bg-[#B8CDD3] hover:border-[#B8CDD3] px-6"
          >
            Login
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-start justify-start px-6 pb-12">
        <div className="flex items-center gap-10 mb-2 px-6">
          <h1 className="text-2xl font-semibold text-[#092A31]">Sign Up</h1>
          {errorMessage ? (
            <ErrorAlert error={errorMessage} />
          ) : resendErrorMessage ? (
            <ErrorAlert error={resendErrorMessage} />
          ) : null}
        </div>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 border border-gray-100">
          <h1 className="text-xl font-semibold text-[#092A31]">
            Email verification
          </h1>
          <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
            Check your email, we sent a code to {email}. If this is not your
            mail,{" "}
            <button
              type="button"
              onClick={() => setChangeEmailOpen(true)}
              className="text-primary font-medium underline hover:no-underline"
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
                className="text-primary font-medium hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending…" : "Resend code"}
              </button>
            ) : (
              <span className="text-primary font-medium">
                {formatTime(secondsLeft)}
              </span>
            )}
          </p>
        </div>
      </div>

      <ChangeEmail
        open={changeEmailOpen}
        onOpenChange={setChangeEmailOpen}
        defaultEmail={email}
        onContinue={setEmail}
      />
    </main>
  );
};

export default OtpPage;
