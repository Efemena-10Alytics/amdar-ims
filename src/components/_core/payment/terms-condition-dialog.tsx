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
import {
  POLICY_SECTIONS,
  TERMS_PARAGRAPHS,
} from "@/constants/terms-and-conditions";

interface TermsConditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree?: () => void;
  onDecline?: () => void;
}

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

          {POLICY_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-4">
              <h3 className="font-clash-display text-2xl font-semibold text-[#092A31]">
                {section.title}
              </h3>

              {section.intro && <p className="text-base leading-7">{section.intro}</p>}

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7">
                  {paragraph}
                </p>
              ))}

              {section.points && section.points.length > 0 && (
                <ol className="list-decimal space-y-3 pl-5">
                  {section.points.map((point) =>
                    typeof point === "string" ? (
                      <li key={point} className="text-base leading-7">
                        {point}
                      </li>
                    ) : (
                      <li key={point.text} className="text-base leading-7">
                        {point.title && (
                          <span className="font-semibold text-[#092A31]">
                            {point.title}
                          </span>
                        )}
                        <p className={point.title ? "mt-1" : undefined}>
                          {point.text}
                        </p>
                        {point.bullets && (
                          <ul className="mt-2 list-disc space-y-2 pl-5">
                            {point.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ),
                  )}
                </ol>
              )}
            </section>
          ))}
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
