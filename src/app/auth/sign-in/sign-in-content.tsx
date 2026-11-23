"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { AppleSvg, GoogleSvg, LinkedInSvg } from "@/components/_core/auth/svg";
import { InfoToastBanner } from "@/components/ui/info-toast-banner";
import { useLogin } from "@/features/auth/use-login";
import {
  buildExternalAuthRedirectUrl,
  openOldAppLoginTab,
} from "@/utils/externalAuthLogic";

export default function SignInContent() {
  const searchParams = useSearchParams();
  const { login, isLoggingIn, errorMessage, clearError } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showForgotPrompt, setShowForgotPrompt] = useState(false);

  const program = searchParams.get("program");
  const redirectParam = searchParams.get("redirect") ?? undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    const user = await login({ email, password }, undefined, true);
    if (!user) {
      const nextAttempt = failedAttempts + 1;
      setFailedAttempts(nextAttempt);
      if (nextAttempt % 3 === 0) {
        clearError();
        setShowForgotPrompt(true);
      }
      return;
    }

    const token = typeof user.token === "string" ? user.token : undefined;
    const redirectUrl = await buildExternalAuthRedirectUrl(
      redirectParam ?? "/dashboard",
      token,
    );
    await openOldAppLoginTab(token, redirectUrl);
    window.location.replace(redirectUrl);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit(e);
  };
  const signUpHref = program
    ? `/auth/sign-up?program=${program}`
    : "/auth/sign-up";

  return (
    <main className="flex-1 w-full h-full overflow-y-auto flex flex-col">
      {errorMessage && !showForgotPrompt ? (
        <InfoToastBanner
          variant="danger"
          message={errorMessage}
          onDismiss={clearError}
        />
      ) : null}

      <Dialog open={showForgotPrompt} onOpenChange={setShowForgotPrompt}>
        <DialogContent className="gap-4 rounded-2xl p-5 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#092A31]">
              Forgot your password?
            </DialogTitle>
            <DialogDescription className="text-[#64748B]">
              It seems you have forgotten your password. Reset it and try
              signing in again.
            </DialogDescription>
          </DialogHeader>
          <Button
            asChild
            className="h-10 w-full rounded-md bg-[#0F4652] text-base font-medium text-white hover:bg-[#0d3d47]"
          >
            <Link href="/auth/forgot-password">Forgot password</Link>
          </Button>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-120 mx-auto md:mx-[unset] mt-10">
        <div className="flex items-center gap-10 mb-2 px-4 sm:px-6">
          <h1 className="text-2xl font-semibold text-[#092A31]">Login</h1>
        </div>
        <div className="flex-1 flex items-center px-4 sm:px-6 pb-6">
          <div className="w-full rounded-2xl bg-white p-4 sm:p-6 border border-gray-100">
            <p className="text-[#092A31] font-medium">Welcome back!</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Fill in your appropriate details below
            </p>

            <form className="mt-4 space-y-3" onSubmit={onFormSubmit} noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#092A31] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={cn(
                    "w-full rounded-md bg-[#F8FAFC] text-sm px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8]",
                    "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#092A31] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={cn(
                      "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 pr-12 text-sm text-[#092A31] placeholder:text-[#94A3B8]",
                      "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#092A31] p-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
            </form>

            {/* Social login */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#092A31] hover:bg-gray-50 transition-colors"
                aria-label="Login with Google"
              >
                <GoogleSvg />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#092A31] hover:bg-gray-50 transition-colors"
                aria-label="Login with Apple"
              >
                <AppleSvg />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0A66C2] hover:bg-gray-50 transition-colors"
                aria-label="Login with LinkedIn"
              >
                <LinkedInSvg />
              </button>
            </div>

            <div className="text-center text-[#334155] mt-2 text-sm">
              Don’t have an account yet?{" "}
              <Link
                href={signUpHref}
                role="button"
                className="text-[#156374] cursor-pointer"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
