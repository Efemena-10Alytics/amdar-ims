"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import {
  isPreDiagnosticEnrollmentStepComplete,
  type PreDiagnosticStepKey,
} from "@/features/internship/use-update-completed-pre-diagnostic";
import {
  buildCareerKnowledgeDiscoveryHref,
  CAREER_KNOWLEDGE_DISCOVERY_ENROLLMENT_STEP_KEY,
  getFirstCareerKnowledgeDiscoveryStepKey,
} from "@/features/pre-diagnostic/career-knowledge-discovery-steps";
import {
  buildPracticalWalkthroughHref,
  getFirstPracticalWalkthroughStepKey,
  PRACTICAL_WALKTHROUGH_ENROLLMENT_STEP_KEY,
} from "@/features/pre-diagnostic/practical-walkthrough-steps";

const PRE_DIAGNOSTIC_DESCRIPTION =
  "Establishes a consistent operational baseline by ensuring alignment in foundational knowledge, tools, and professional working standards.";

const PRE_DIAGNOSTIC_CHECKLIST_ITEMS: {
  id: PreDiagnosticStepKey;
  label: string;
  href: string;
}[] = [
  {
    id: "welcome-video",
    label: "Welcome video",
    href: "/pre-diagnostic-test?step=welcome-video",
  },
  {
    id: CAREER_KNOWLEDGE_DISCOVERY_ENROLLMENT_STEP_KEY,
    label: "Career curriculum",
    href: buildCareerKnowledgeDiscoveryHref(
      getFirstCareerKnowledgeDiscoveryStepKey(),
    ),
  },
  {
    id: "career-path-diagnostics",
    label: "Career path diagnostics",
    href: "/pre-diagnostic-test?step=career-path-diagnostics",
  },
  {
    id: "technology-use-case",
    label: "Technology use case",
    href: "/pre-diagnostic-test/technology-readiness?step=technology-use-case",
  },
  {
    id: PRACTICAL_WALKTHROUGH_ENROLLMENT_STEP_KEY,
    label: "Practical walkthrough",
    href: buildPracticalWalkthroughHref(getFirstPracticalWalkthroughStepKey()),
  },
  {
    id: "technology-diagnostics",
    label: "Technology diagnostics",
    href: "/pre-diagnostic-test/technology-readiness?step=technology-diagnostics",
  },
  {
    id: "how-the-ims-works",
    label: "How the IMS works",
    href: "/pre-diagnostic-test/ims-readiness?step=how-the-ims-works",
  },
  {
    id: "ims-diagnostics",
    label: "IMS Diagnostics",
    href: "/pre-diagnostic-test/ims-readiness?step=ims-diagnostics",
  },
];

function PreDiagnosticTaskBadge({ completed }: { completed: boolean }) {
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

const PreDiagnostic = () => {
  const { data: enrollment } = useGetUserEnrollment();
  const preDiagnosticStepsCompleted =
    enrollment?.isPreDiagnosticStepsCompleted;

  return (
    <div className="border-t border-[#E2E8F0] px-3 pb-4 pt-3 sm:px-4">
      <p className="text-sm leading-relaxed text-[#64748B]">
        {PRE_DIAGNOSTIC_DESCRIPTION}
      </p>

      <ul className="mt-3 space-y-3">
        {PRE_DIAGNOSTIC_CHECKLIST_ITEMS.map((task) => {
          const isCompleted = isPreDiagnosticEnrollmentStepComplete(
            preDiagnosticStepsCompleted,
            task.id,
            { enrollmentId: enrollment?.id },
          );

          return (
            <li
              key={task.id}
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
                  href={task.href}
                  className="text-sm font-medium text-[#092A31] underline-offset-2 hover:underline"
                >
                  {task.label}
                </Link>
              </div>
              <PreDiagnosticTaskBadge completed={isCompleted} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PreDiagnostic;
