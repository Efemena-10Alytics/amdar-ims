"use client";

import Link from "next/link";
import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { USER_ENROLLMENT_QUERY_KEY } from "@/features/internship/use-get-user-enrollment";
import { PAYMENT_STATS_QUERY_KEY } from "@/features/payment/use-get-payment-stats";
import { PAYMENT_STATUS_QUERY_KEY } from "@/features/payment/use-get-payment-status";
import { USER_INVOICES_QUERY_KEY } from "@/features/payment/use-get-user-invoices";
import { useVerifyStripeSession } from "@/features/payment/use-verify-stripe-session";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  const handleVerified = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: PAYMENT_STATUS_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: PAYMENT_STATS_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: USER_INVOICES_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: USER_ENROLLMENT_QUERY_KEY });
  }, [queryClient]);

  const { status, errorMessage, isVerifying, verify } = useVerifyStripeSession({
    sessionId,
    enabled: !!sessionId?.trim(),
    onSuccess: handleVerified,
  });

  if (!sessionId?.trim()) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto size-10 text-destructive" aria-hidden />
        <h1 className="mt-4 font-sora text-xl font-semibold text-[#173740]">
          Missing payment session
        </h1>
        <p className="mt-2 font-sora text-sm text-[#64748B]">
          No payment session was found. Return to your dashboard or billing page
          to check your payment status.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#156374] px-6 font-sora text-sm font-semibold text-white hover:bg-[#124F5D]"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isProcessing =
    isVerifying || status === "idle" || status === "verifying" || status === "processing";
  const isSuccess = status === "success";
  const isFailed = status === "cancelled";

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
      {isProcessing ? (
        <>
          <Loader2
            className="mx-auto size-10 animate-spin text-[#156374]"
            aria-hidden
          />
          <h1 className="mt-4 font-sora text-xl font-semibold text-[#173740]">
            Verifying your payment
          </h1>
          <p className="mt-2 font-sora text-sm text-[#64748B]">
            {errorMessage ??
              "Please wait while we confirm your installment payment."}
          </p>
        </>
      ) : null}

      {isSuccess ? (
        <>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#156374]/10 text-[#156374]">
            <Check className="size-7" strokeWidth={2.5} aria-hidden />
          </div>
          <h1 className="mt-4 font-sora text-xl font-semibold text-[#173740]">
            Payment successful
          </h1>
          <p className="mt-2 font-sora text-sm text-[#64748B]">
            Your payment has been confirmed and your dashboard access is up to
            date.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#156374] px-6 font-sora text-sm font-semibold text-white hover:bg-[#124F5D]"
            >
              Return to dashboard
            </Link>
            <Link
              href="/dashboard/billing"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#CBD5E1] px-6 font-sora text-sm font-semibold text-[#173740] hover:bg-[#F8FAFC]"
            >
              View billing
            </Link>
          </div>
        </>
      ) : null}

      {isFailed ? (
        <>
          <AlertCircle className="mx-auto size-10 text-destructive" aria-hidden />
          <h1 className="mt-4 font-sora text-xl font-semibold text-[#173740]">
            Payment verification failed
          </h1>
          <p className="mt-2 font-sora text-sm text-[#64748B]">
            {errorMessage ??
              "We could not verify your payment yet. Please try again or contact support."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => verify()}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[#156374] px-6 font-sora text-sm font-semibold text-white hover:bg-[#124F5D]"
            >
              Try again
            </button>
            <Link
              href="/dashboard/billing"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#CBD5E1] px-6 font-sora text-sm font-semibold text-[#173740] hover:bg-[#F8FAFC]"
            >
              View billing
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
            <Loader2
              className="mx-auto size-10 animate-spin text-[#156374]"
              aria-hidden
            />
            <p className="mt-4 font-sora text-sm text-[#64748B]">
              Loading payment confirmation...
            </p>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
