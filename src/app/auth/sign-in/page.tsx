"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, X } from "lucide-react";
import { AppleSvg, GoogleSvg, LinkedInSvg } from "@/components/_core/auth/svg";
import ErrorAlert from "@/components/_core/auth/error-alert";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error] = useState("Invalid email or password.");

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
        <div className="flex items-center gap-10 mb-2 px-6">
          <h1 className="text-2xl font-semibold text-[#092A31]">Login</h1>
          <ErrorAlert error={error} />
        </div>
        <div className="flex-1 flex items-center px-6 pb-6">
          <div className="w-full rounded-2xl bg-white p-6 border border-gray-100">
            <p className="text-[#092A31] font-medium">Welcome back!</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Fill in your appropriate details below
            </p>

            <form className="mt-4 space-y-5">
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
                  className={cn(
                    "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8]",
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
                    className={cn(
                      "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 pr-12 text-[#092A31] placeholder:text-[#94A3B8]",
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
                  href="/forgot-password"
                  className="text-sm text-[#156374] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium"
              >
                Login
              </Button>
            </form>

            {/* Social login */}
            <div className="mt-8 flex justify-center gap-4">
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
          </div>
        </div>
      </div>
    </main>
  );
}
