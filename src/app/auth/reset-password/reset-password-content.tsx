"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { inputBase } from "@/components/_core/auth/sign-up/create-password";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Eye, EyeOff, Lock } from "lucide-react";
import { PadlockInSvg } from "@/components/_core/auth/svg";
import { useResetPassword } from "@/features/auth/use-reset-password";
import ResetPasswordOtpContent from "./otp-content";

const REQUIREMENTS = [
  {
    id: "length",
    label: "Contains at least 8 character",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "upper",
    label: "One upper case",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lower case",
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    id: "special",
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const;

type Step = "otp" | "reset";

export default function ResetPasswordContent() {
  const [step, setStep] = useState<Step>("otp");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { reset, isLoading, errorMessage } = useResetPassword();

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;
  const canContinueFromOtp = otp.length === 5;

  const requirementStatus = useMemo(
    () => REQUIREMENTS.map((r) => ({ ...r, met: r.test(password) })),
    [password],
  );
  const allRequirementsMet = requirementStatus.every((r) => r.met);

  const handleOtpContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinueFromOtp) return;
    setStep("reset");
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !allRequirementsMet) return;
    reset({
      token: otp,
      password,
      password_confirmation: confirmPassword,
    });
  };

  return (
    <main className="flex-1 w-full h-full overflow-y-auto flex flex-col">
      <div className="flex justify-end p-6">
        <Link href="/auth/sign-up">
          <Button
            variant="outline"
            className="rounded-md bg-[#B6CFD4] border-[#C8DDE3] text-[#092A31] hover:bg-[#B8CDD3] hover:border-[#B8CDD3] px-6"
          >
            Sign Up
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-120">
        <div className="mb-4 pl-1">
          <PadlockInSvg />
        </div>
        <div className="rounded-2xl bg-white p-6 border border-gray-100">
          {step === "otp" ? (
            <ResetPasswordOtpContent
              otp={otp}
              onOtpChange={setOtp}
              onContinue={handleOtpContinue}
              canContinue={canContinueFromOtp}
            />
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#092A31]">
                Create Password
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                We value your security create a solid password
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleResetSubmit}>
                {errorMessage && (
                  <p className="text-sm text-red-600" role="alert">
                    {errorMessage}
                  </p>
                )}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#092A31] mb-1.5"
                  >
                    Create password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(inputBase, "pr-12")}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#092A31] p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#092A31] mb-1.5"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        inputBase,
                        "pr-12",
                        showMatchError && "border-red-500 focus:ring-red-500",
                      )}
                      aria-invalid={showMatchError}
                      aria-describedby={showMatchError ? "match-error" : undefined}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#092A31] p-1"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {showMatchError && (
                    <p id="match-error" className="mt-1.5 text-sm text-red-500">
                      Password doesn&apos;t match!
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#092A31]" aria-hidden />
                    <span className="text-sm font-semibold text-[#092A31]">
                      Password hint
                    </span>
                  </div>
                  <ul className="space-y-2" role="list">
                    {requirementStatus.map(({ id, label, met }) => (
                      <li
                        key={id}
                        className="flex items-center gap-2 text-sm text-[#64748B]"
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                            met
                              ? "border-transprent bg-[#C7F5D8] text-primary"
                              : "border-gray-300 bg-white",
                          )}
                          aria-hidden
                        >
                          {met ? (
                            <Check className="h-3 w-3" strokeWidth={3} />
                          ) : null}
                        </span>
                        <span className={met ? "text-[#359E5B]" : undefined}>
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={
                    !passwordsMatch || !allRequirementsMet || isLoading
                  }
                  className="w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? "Resetting…" : "Reset password"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#64748B]">
                Continuing means you agree to{" "}
                <Link
                  href="/terms"
                  className="text-[#156374] font-medium hover:underline"
                >
                  Amdari Terms
                </Link>{" "}
                &{" "}
                <Link
                  href="/terms#conditions"
                  className="text-[#156374] font-medium hover:underline"
                >
                  Conditions
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
