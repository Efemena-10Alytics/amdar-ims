"use client";

import { Eye } from "lucide-react";
import { useGetInternshipDetails } from "@/features/interns-project/use-get-internship-details";
import { useIsSpecialistPreview } from "@/features/internship/use-is-specialist-preview";

/**
 * Names what a specialist is looking at when the page is showing someone else's
 * cohort.
 *
 * Without this the page is indistinguishable from an intern's own dashboard,
 * and the figures that don't apply to a specialist read as broken rather than
 * as not-about-you.
 */
export function SpecialistPreviewBanner() {
  const { isPreview } = useIsSpecialistPreview();
  const { data: details } = useGetInternshipDetails();

  if (!isPreview) return null;

  const cohortName = details?.cohort?.name?.trim();
  const programTitle = details?.program?.title?.trim();
  const subject = [programTitle, cohortName].filter(Boolean).join(" · ");

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-[#BFD8E0] bg-[#EEF6F9] px-4 py-3"
    >
      <Eye className="mt-0.5 size-4 shrink-0 text-[#0F4652]" aria-hidden />
      <p className="text-sm text-[#0F4652]">
        <span className="font-semibold">
          You&apos;re viewing {subject || "this cohort"} as a specialist.
        </span>{" "}
        This is the intern&apos;s view of the programme. Figures that track one
        intern&apos;s own completion are shown as
        <span className="font-medium"> —</span>, and you can&apos;t submit work
        or complete steps here.
      </p>
    </div>
  );
}

export default SpecialistPreviewBanner;
