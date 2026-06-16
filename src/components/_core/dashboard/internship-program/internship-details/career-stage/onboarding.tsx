"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { ONBOARDING_CHECKLIST_ITEMS } from "@/features/onboarding/types";
import { buildOnboardingStepHref } from "@/features/onboarding/use-get-onboarding";

function OnboardingTaskBadge() {
  return (
    <span className="rounded-full bg-[#CFF6DA] px-2.5 py-0.5 text-xs font-semibold text-[#1F7A4A]">
      Done
    </span>
  );
}

const OnboardingSession = () => {
  return (
    <div className="border-t border-[#E2E8F0] px-3 pb-4 pt-3 sm:px-4">
      <p className="text-sm leading-relaxed text-[#64748B]">
        Getting you familiar with your learning environment
      </p>

      <div className="my-4 border-t border-[#E2E8F0]" aria-hidden />

      <ul className="space-y-3">
        {ONBOARDING_CHECKLIST_ITEMS.map((task) => (
          <li key={task.key} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Check
                className="size-4 shrink-0 text-[#238A50]"
                strokeWidth={2.5}
                aria-hidden
              />
              <Link
                href={buildOnboardingStepHref(task.key)}
                className="text-sm font-medium text-[#092A31] underline-offset-2 hover:underline"
              >
                {task.label}
              </Link>
            </div>
            <OnboardingTaskBadge />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnboardingSession;
