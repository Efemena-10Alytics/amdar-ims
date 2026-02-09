"use client";

import { useMemo } from "react";
import { Eye, EyeOff, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { SignUpFormData } from "./types";

export const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] text-sm placeholder:text-xs px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8] border border-transparent",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
);

const REQUIREMENTS = [
  { id: "length", label: "Contains at least 8 character", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "One upper case", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lower case", test: (p: string) => /[a-z]/.test(p) },
  { id: "special", label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export interface CreatePasswordProps {
  formData: SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
  onSignUpSuccess?: () => void;
  isSigningUp?: boolean;
}

const CreatePassword = ({
  formData,
  setFormData,
  onSignUpSuccess,
  isSigningUp = false,
}: CreatePasswordProps) => {
  const {
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
  } = formData;
  const passwordsMatch = confirmPassword === "" || password === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUpSuccess?.();
  };

  const requirementStatus = useMemo(
    () => REQUIREMENTS.map((r) => ({ ...r, met: r.test(password) })),
    [password],
  );

  return (
    <div className="rounded-2xl bg-white p-4 border border-gray-100">
      <h2 className="text-xl font-semibold text-[#092A31]">Create Password</h2>
      <p className="mt-1 text-sm text-[#64748B]">
        We value your security create a solid password
      </p>

      <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className={cn(inputBase, "pr-12")}
            />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))
              }
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className={cn(
                inputBase,
                "pr-12",
                showMatchError && "border-red-500 focus:ring-red-500",
              )}
              aria-invalid={showMatchError}
              aria-describedby={showMatchError ? "match-error" : undefined}
            />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  showConfirmPassword: !prev.showConfirmPassword,
                }))
              }
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

        {/* Password hint */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#092A31]" aria-hidden />
            <span className="text-sm font-semibold text-[#092A31]">
              Password hint
            </span>
          </div>
          <ul className="space-y-2 grid grid-cols-2" role="list">
            {requirementStatus.map(({ id, label, met }) => (
              <li key={id} className="flex items-start gap-2 text-xs text-[#64748B]">
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                    met
                      ? "border-transprent bg-[#C7F5D8] text-primary"
                      : "border-gray-300 bg-white",
                  )}
                  aria-hidden
                >
                  {met ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
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
          disabled={isSigningUp || showMatchError}
          className="w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-11 text-base font-medium disabled:opacity-70"
        >
          {isSigningUp ? "Signing up…" : "Sign Up"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-[#64748B]">
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
    </div>
  );
};

export default CreatePassword;
