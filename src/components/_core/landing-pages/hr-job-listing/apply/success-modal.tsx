"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * The design shows no button inside the modal, so it closes on the overlay or
 * Escape. The link underneath keeps the flow navigable.
 */
export function ApplicationSuccessModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-150 gap-0 rounded-2xl px-10 py-12 text-center sm:max-w-150"
      >
        <span
          aria-hidden
          className="mx-auto flex size-50 items-center justify-center rounded-full bg-[#FFE082] text-7xl"
        >
          🎉
        </span>

        <DialogTitle className="mt-8 font-sora text-xl font-semibold text-[#092A31]">
          Application Submitted Successfully!
        </DialogTitle>

        <p className="mt-3 font-sora text-base leading-relaxed text-[#475569]">
          You&apos;ve successfully applied for this role. Your application is now with our
          recruitment team for review.
        </p>
        <p className="mt-4 font-sora text-base leading-relaxed text-[#475569]">
          We&apos;ll notify you of any updates regarding your application status.
        </p>

        <Link
          href="/hr-job-listing#job-openings"
          className="mt-8 font-sora text-sm font-medium text-[#156374] underline-offset-4 hover:underline"
        >
          Back to positions
        </Link>
      </DialogContent>
    </Dialog>
  );
}
