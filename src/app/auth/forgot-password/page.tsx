"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PadlockInSvg } from "@/components/_core/auth/svg";

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8] border border-gray-200",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ type: "forgot-password" });
    if (email.trim()) params.set("email", email.trim());
    router.push(`/auth/otp?${params.toString()}`);
  };

  return (
    <main className="flex flex-col">
      <div className="flex justify-end p-6">
        <Link href="/sign-in" className="cursor-pointer">
          <Button
            variant="outline"
            className="rounded-md bg-[#C8DDE3] border-[#C8DDE3] text-[#092A31] hover:bg-[#B8CDD3] hover:border-[#B8CDD3] px-6"
          >
            Login
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-start justify-start px-6 pb-12">
        <div className="mb-4 pl-1">
          <PadlockInSvg />
        </div>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h1 className="text-xl font-bold text-[#092A31]">Forgot password</h1>
          <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
            Enter your email address to reset your password.
          </p>

          <form className="mt-6" onSubmit={handleSubmit}>
            <label
              htmlFor="forgot-email"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
            />
            <Button
              type="submit"
              disabled={!email.trim()}
              className="mt-6 w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
