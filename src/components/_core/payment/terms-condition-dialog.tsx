"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsConditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree?: () => void;
  onDecline?: () => void;
}

const TERMS_PARAGRAPHS: string[] = [
  "Hello and welcome to Amdari! We are dedicated to offering you hands-on, project-based internship designed to provide you with real world experience, and we want to make sure you are aware of all the terms and conditions that come with taking part in our program.",
  "As a participant in our program, please update yourself on the policies and procedures outlined in this document. Please carefully read and comprehend these terms and conditions before starting this program.",
  "Our goal at Amdari is to provide each participant with exceptional opportunities for real-world experience through projects and internships that build practical skills. However, we acknowledge that unforeseen circumstances may sometimes necessitate a refund or deferment.",
];

const POLICY_POINTS: string[] = [
  "Installment Payment: All installment agreements must be honored. All participants are required to make installment payments on or before their agreed installment date. If ability to meet the agreed date is impaired, a mail must be sent to finance@amdari.io to agree on a compromise to payments.",
  "Failure to make Installment Payment: Failure to make payment on or before agreed installment date may result in your profile being flagged for immediate removal from active internship access.",
  "Code of Conduct: Participants must maintain professional behavior while interacting with mentors, teammates, and the broader community.",
  "Program Participation: Active participation in project tasks, check-ins, and feedback cycles is required throughout the internship period.",
];

export function TermsConditionDialog({
  open,
  onOpenChange,
  onAgree,
  onDecline,
}: TermsConditionDialogProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  const checkScrollPosition = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setHasReachedBottom(distanceFromBottom <= 8);
  };

  useEffect(() => {
    if (!open) {
      setHasReachedBottom(false);
      return;
    }
    const el = scrollContainerRef.current;
    if (!el) return;
    const isScrollable = el.scrollHeight > el.clientHeight + 1;
    setHasReachedBottom(!isScrollable);
  }, [open]);

  const handleDecline = () => {
    onDecline?.();
    onOpenChange(false);
  };

  const handleAgree = () => {
    onAgree?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[92vw] max-w-4xl! gap-0 overflow-hidden rounded-lg border-0 p-0"
      >
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="font-clash-display text-2xl font-semibold text-[#092A31]">
            Terms & Conditions
          </DialogTitle>
          <DialogDescription className="sr-only">
            Read and accept Amdari terms and conditions to continue payment.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="max-h-[70vh] space-y-5 overflow-y-auto px-6 pb-6 text-[#52616B]"
        >
          {TERMS_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph} className="text-base leading-7">
              {paragraph}
            </p>
          ))}

          <section className="space-y-4">
            <h3 className="font-clash-display text-2xl font-semibold text-[#092A31]">
              Removal/Access Restriction Policy for Amdari
            </h3>
            <p className="text-base leading-7">
              Participants in any of Amdari&apos;s programs may have their access
              restricted or be removed under the following circumstances:
            </p>
            <ol className="list-decimal space-y-3 pl-5">
              {POLICY_POINTS.map((point) => (
                <li key={point} className="text-base leading-7">
                  {point}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="grid grid-cols-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDecline}
            className="h-14 rounded-none border-t border-r border-[#D8E4E7] text-lg font-medium text-[#52616B] hover:bg-[#f4f7f8]"
          >
            Decline
          </Button>
          <Button
            type="button"
            onClick={handleAgree}
            disabled={!hasReachedBottom}
            className="h-14 rounded-none border-t border-primary bg-primary text-lg font-medium text-white hover:bg-primary/90"
          >
            Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TermsConditionDialog;
