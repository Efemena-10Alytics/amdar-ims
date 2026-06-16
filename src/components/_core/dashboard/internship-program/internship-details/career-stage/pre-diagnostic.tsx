"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import {
  buildCareerKnowledgeDiscoveryHref,
  getFirstCareerKnowledgeDiscoveryStepKey,
} from "@/features/pre-diagnostic/career-knowledge-discovery-steps";
import {
  buildPracticalWalkthroughHref,
  getFirstPracticalWalkthroughStepKey,
} from "@/features/pre-diagnostic/practical-walkthrough-steps";

const PRE_DIAGNOSTIC_DESCRIPTION =
  "Establishes a consistent operational baseline by ensuring alignment in foundational knowledge, tools, and professional working standards.";

const PRE_DIAGNOSTIC_CHECKLIST_ITEMS = [
  {
    id: "welcome-video",
    label: "Welcome video",
    href: "/pre-diagnostic-test?step=welcome-video",
  },
  {
    id: "career-curriculum",
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
    id: "practical-walkthrough",
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
] as const;

function PreDiagnosticTaskBadge() {
  return (
    <span className="rounded-full bg-[#CFF6DA] px-2.5 py-0.5 text-xs font-semibold text-[#1F7A4A]">
      Done
    </span>
  );
}

const PreDiagnostic = () => {
  return (
    <div className="border-t border-[#E2E8F0] px-3 pb-4 pt-3 sm:px-4">
      <p className="text-sm leading-relaxed text-[#64748B]">
        {PRE_DIAGNOSTIC_DESCRIPTION}
      </p>

      <div className="my-4 border-t border-[#E2E8F0]" aria-hidden />

      <ul className="space-y-3">
        {PRE_DIAGNOSTIC_CHECKLIST_ITEMS.map((task) => (
          <li key={task.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Check
                className="size-4 shrink-0 text-[#238A50]"
                strokeWidth={2.5}
                aria-hidden
              />
              <Link
                href={task.href}
                className="text-sm font-medium text-[#092A31] underline-offset-2 hover:underline"
              >
                {task.label}
              </Link>
            </div>
            <PreDiagnosticTaskBadge />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreDiagnostic;
