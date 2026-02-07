"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8] border border-gray-200",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
);

const selectBase = cn(
  inputBase,
  "appearance-none pr-10 cursor-pointer",
);

const HOW_DID_YOU_HEAR_OPTIONS = [
  { value: "", label: "Select medium" },
  { value: "social", label: "Social media" },
  { value: "search", label: "Search engine" },
  { value: "referral", label: "Referral" },
  { value: "event", label: "Event or webinar" },
  { value: "other", label: "Other" },
];

const REASON_OPTIONS = [
  { value: "", label: "Select for decision" },
  { value: "career", label: "Career growth" },
  { value: "skills", label: "Learn new skills" },
  { value: "industry", label: "Industry exposure" },
  { value: "other", label: "Other" },
];

const SESSION_OPTIONS = [
  { value: "", label: "Select session of decision" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "flexible", label: "Flexible" },
];

export default function CompleteProfile() {
  const [howDidYouHear, setHowDidYouHear] = useState("");
  const [reasonForDecision, setReasonForDecision] = useState("");
  const [sessionOfDecision, setSessionOfDecision] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit to API
  };

  return (
    <div className="flex-1 w-full">
      <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
        Complete profile to confirm enrollment
      </h2>
      <p className="mt-1 text-sm text-[#6b7280]">
        complete your enrollment profile
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 w-full">
        <div>
          <label
            htmlFor="how-did-you-hear"
            className="block text-sm font-medium text-[#092A31] mb-1.5"
          >
            How did you hear about Amdari
          </label>
          <div className="relative">
            <select
              id="how-did-you-hear"
              className={selectBase}
              value={howDidYouHear}
              onChange={(e) => setHowDidYouHear(e.target.value)}
              required
            >
              {HOW_DID_YOU_HEAR_OPTIONS.map((opt) => (
                <option key={opt.value || "placeholder"} value={opt.value} disabled={!opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none"
              aria-hidden
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="reason-for-decision"
            className="block text-sm font-medium text-[#092A31] mb-1.5"
          >
            Reason for decision
          </label>
          <div className="relative">
            <select
              id="reason-for-decision"
              className={selectBase}
              value={reasonForDecision}
              onChange={(e) => setReasonForDecision(e.target.value)}
              required
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value || "placeholder"} value={opt.value} disabled={!opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none"
              aria-hidden
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="session-of-decision"
            className="block text-sm font-medium text-[#092A31] mb-1.5"
          >
            Session of decision
          </label>
          <div className="relative">
            <select
              id="session-of-decision"
              className={selectBase}
              value={sessionOfDecision}
              onChange={(e) => setSessionOfDecision(e.target.value)}
              required
            >
              {SESSION_OPTIONS.map((opt) => (
                <option key={opt.value || "placeholder"} value={opt.value} disabled={!opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none"
              aria-hidden
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="referral-code"
            className="block text-sm font-medium text-[#092A31] mb-1.5"
          >
            Referral code <span className="text-[#6b7280] font-normal">(Optional)</span>
          </label>
          <input
            id="referral-code"
            type="text"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className={inputBase}
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium"
        >
          Complete profile
        </Button>
      </form>
    </div>
  );
}
