"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AppleSvg, GoogleSvg, LinkedInSvg } from "@/components/_core/auth/svg";
import ErrorAlert from "@/components/_core/auth/error-alert";
import { useLogin } from "@/features/auth/use-login";

export interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user clicks "Sign up" link – if provided, modal closes and this runs (e.g. open sign-up modal). */
  onSignUpClick?: () => void;
}

export function SignInModal({
  open,
  onOpenChange,
  onSignUpClick,
}: SignInModalProps) {
  const { login, isLoggingIn, errorMessage } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password }, undefined, true);
    if (success) onOpenChange(false);
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    if (onSignUpClick) {
      e.preventDefault();
      onOpenChange(false);
      onSignUpClick();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-110 w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden border border-gray-200 rounded-2xl">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <div className="p-6">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-2xl font-semibold text-[#092A31]">Login</h2>
            {errorMessage ? <ErrorAlert error={errorMessage} /> : null}
          </div>

          <p className="text-[#092A31] font-medium">Welcome back!</p>
          <p className="mt-1 text-sm text-[#64748B]">
            Fill in your appropriate details below
          </p>

          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="sign-in-modal-email"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Email
              </label>
              <input
                id="sign-in-modal-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={cn(
                  "w-full rounded-md bg-[#F8FAFC] text-sm px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8] border border-transparent",
                  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0",
                )}
              />
            </div>

            <div>
              <label
                htmlFor="sign-in-modal-password"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="sign-in-modal-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={cn(
                    "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 pr-12 text-sm text-[#092A31] placeholder:text-[#94A3B8] border border-transparent",
                    "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0",
                  )}
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

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(v === true)}
                />
                <span className="text-sm text-[#64748B]">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#156374] hover:underline"
                onClick={() => onOpenChange(false)}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn || !email.trim() || !password.trim()}
              className="w-full rounded-md bg-[#0F4652] hover:bg-[#0d3d47] text-white h-10 text-base font-medium disabled:opacity-70"
            >
              {isLoggingIn ? "Signing in…" : "Login"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#E8EFF1] rounded-lg border-[#B6CFD4] text-primary hover:bg-[#156374]/5 h-11"
              onClick={handleSignUpClick}
            >
              Create an account
            </Button>
          </form>

          <div className="mt-4 flex justify-center gap-4">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#092A31] hover:bg-gray-50 transition-colors border border-gray-100"
              aria-label="Login with Google"
            >
              <GoogleSvg />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#092A31] hover:bg-gray-50 transition-colors border border-gray-100"
              aria-label="Login with Apple"
            >
              <AppleSvg />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0A66C2] hover:bg-gray-50 transition-colors border border-gray-100"
              aria-label="Login with LinkedIn"
            >
              <LinkedInSvg />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignInModal;
