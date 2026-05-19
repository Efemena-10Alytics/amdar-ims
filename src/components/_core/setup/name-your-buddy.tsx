"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NameYourBuddy = () => {
  const router = useRouter();
  const [buddyName, setBuddyName] = useState("");
  const canContinue = buddyName.trim().length > 0;

  return (
    <section className="w-full max-w-180 py-5 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
      </div>

      <h1 className="text-2xl font-semibold text-[#173740]">The Amdari-You</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-white p-6 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span
            className="size-20 rounded-full bg-[#4ADE80] sm:size-24"
            aria-hidden
          />

          <p className="mt-4 text-lg font-semibold text-[#173740]">Your Buddy</p>

          <div className="mt-6 w-full rounded-xl bg-[#E9EEF2] p-4 text-left sm:p-5">
            <h2 className="text-base font-semibold text-[#173740]">Who is your buddy?</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3B6B76]">
              Your buddy is the Amdari-you, representing your progress and will move with
              you through your journey to keep you going from your start point to completion
            </p>
          </div>

          <div className="mt-5 w-full rounded-xl bg-[#F1F4F6] px-4 py-4">
            <input
              type="text"
              value={buddyName}
              onChange={(event) => setBuddyName(event.target.value)}
              placeholder="Enter your buddy name"
              aria-label="Your buddy name"
              className="w-full bg-transparent text-center text-xl font-bold tracking-wide text-[#173740] uppercase outline-none placeholder:font-medium placeholder:normal-case placeholder:text-[#8C9DAC]"
            />
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() => router.push("/onboarding")}
            className="mt-8 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
          >
            Continue
          </button>
        </div>
      </article>
    </section>
  );
};

export default NameYourBuddy;
