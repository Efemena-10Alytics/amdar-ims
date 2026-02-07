"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Check, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVerifyStripeSession } from "@/features/payment/use-verify-stripe-session";

export type PaymentSuccessPhase = "processing" | "success" | "error";

interface PaymentSuccessModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  programSlug?: string;
  /** When set, verification runs inside the modal when open. Phase is driven by verification result. */
  sessionId?: string | null;
  /** Only used when sessionId is not set: seconds before switching to success (default 2) */
  processingDuration?: number;
}

export function PaymentSuccessModal({
  open,
  onOpenChange,
  programSlug,
  sessionId = null,
  processingDuration = 2,
}: PaymentSuccessModalProps) {
  const [timerPhase, setTimerPhase] = useState<"processing" | "success">("processing");

  const {
    status: verifyStatus,
    errorMessage: verifyError,
    isVerifying,
    verify,
  } = useVerifyStripeSession({
    sessionId: open && sessionId?.trim() ? sessionId : null,
    enabled: open && !!sessionId?.trim(),
  });

  // When no sessionId, use timer to switch to success
  useEffect(() => {
    if (!open) {
      setTimerPhase("processing");
      return;
    }
    if (sessionId?.trim()) return;
    const t = setTimeout(() => setTimerPhase("success"), processingDuration * 1000);
    return () => clearTimeout(t);
  }, [open, sessionId, processingDuration]);

  const phase: PaymentSuccessPhase =
    sessionId?.trim()
      ? isVerifying || verifyStatus === "processing"
        ? "processing"
        : verifyStatus === "success"
          ? "success"
          : "error"
      : timerPhase;

  const seeMyProgramHref = programSlug
    ? `/internship/${programSlug}/apply/payment-checkout?tab=3`
    : "/internship";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={phase === "success" || phase === "error"}
        className="sm:max-w-md text-center"
      >
        {phase === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">
                Processing payment
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <Loader2
                  className="h-12 w-12 animate-spin text-primary"
                  aria-hidden
                />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[#092A31]">Processing...</p>
                <p className="text-sm text-[#6b7280]">
                  Hold on we are processing your payment
                </p>
              </div>
            </div>
          </>
        )}

        {phase === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#092A31]">
                Payment Successful!
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                aria-hidden
              >
                <Check className="h-9 w-9" strokeWidth={2.5} />
              </div>
              <p className="text-sm text-[#6b7280]">
                Your payment receipt has been sent to your mail
              </p>
              <Button asChild className="w-full bg-[#092A31] hover:bg-[#092A31]/90">
                <Link href={seeMyProgramHref}>See my program</Link>
              </Button>
            </div>
          </>
        )}

        {phase === "error" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#092A31]">
                Payment verification failed
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                aria-hidden
              >
                <AlertCircle className="h-9 w-9" strokeWidth={2} />
              </div>
              <p className="text-sm text-[#6b7280]">
                {verifyError ?? "Unable to verify your payment. Please contact support."}
              </p>
              <div className="flex w-full gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange?.(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-[#092A31] hover:bg-[#092A31]/90"
                  onClick={() => verify()}
                >
                  Try again
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
