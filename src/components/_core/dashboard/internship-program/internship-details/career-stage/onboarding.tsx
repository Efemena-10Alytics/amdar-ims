"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ONBOARDING_CHECKLIST_ITEMS } from "@/features/onboarding/types";
import { buildOnboardingStepHref } from "@/features/onboarding/use-get-onboarding";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { isOnboardingEnrollmentStepComplete } from "@/features/internship/use-update-completed-onboarding-step";

function OnboardingTaskBadge({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <span className="rounded-full bg-[#CFF6DA] px-2.5 py-0.5 text-xs font-semibold text-[#1F7A4A]">
        Done
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-semibold text-[#64748B]">
      Not started
    </span>
  );
}

const OnboardingSession = () => {
  const { data: enrollment } = useGetUserEnrollment();
  const onboardingStepsCompleted = enrollment?.isOnboardingStepsCompleted;

  return (
    <div className="border-t border-[#E2E8F0] px-3 pb-4 pt-3 sm:px-4">
      <p className="text-sm leading-relaxed text-[#64748B]">
        Getting you familiar with your learning environment
      </p>

      <ul className="mt-3 space-y-3">
        {ONBOARDING_CHECKLIST_ITEMS.map((task) => {
          const isCompleted = isOnboardingEnrollmentStepComplete(
            onboardingStepsCompleted,
            task.key,
          );

          return (
            <li
              key={task.key}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={cn(
                    "rounded p-0.5",
                    isCompleted ? "bg-[#C7F5D8]" : "bg-[#E2E8F0]",
                  )}
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      isCompleted ? "text-[#238A50]" : "text-[#94A3B8]",
                    )}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </div>
                <Link
                  href={buildOnboardingStepHref(task.key)}
                  className="text-sm font-medium text-[#092A31] underline-offset-2 hover:underline"
                >
                  {task.label}
                </Link>
              </div>
              <OnboardingTaskBadge completed={isCompleted} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OnboardingSession;
