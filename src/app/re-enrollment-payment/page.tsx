"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useVerifyReenrollmentSession } from "@/features/payment/use-verify-reenrollment-session";

function ReenrollmentPaymentContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { status, errorMessage, isVerifying, verify } =
    useVerifyReenrollmentSession({
      sessionId,
      enabled: !!sessionId?.trim(),
    });

  if (!sessionId?.trim()) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto size-10 text-destructive" aria-hidden />
        <h1 className="mt-4 text-xl font-semibold text-[#173740]">
          Missing payment session
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          No payment session was found. Return to your dashboard and try again.
        </p>
        <Link
          href="/dashboard/internship-program"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#156374] px-6 text-sm font-semibold text-white hover:bg-[#124F5D]"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  const isProcessing =
    isVerifying || status === "pending" || status === "verifying";
  const isSuccess = status === "success";
  const isFailed = status === "failed";

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
      {isProcessing ? (
        <>
          <Loader2
            className="mx-auto size-10 animate-spin text-[#156374]"
            aria-hidden
          />
          <h1 className="mt-4 text-xl font-semibold text-[#173740]">
            Verifying payment
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            {errorMessage ??
              "Hold on while we confirm your re-enrollment payment."}
          </p>
        </>
      ) : null}

      {isSuccess ? (
        <>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#156374]/10 text-[#156374]">
            <Check className="size-7" strokeWidth={2.5} aria-hidden />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-[#173740]">
            Payment verified
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Your re-enrollment payment was successful. You can return to your
            dashboard while your deferment request is reviewed.
          </p>
          <Link
            href="/dashboard/internship-program"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#156374] px-6 text-sm font-semibold text-white hover:bg-[#124F5D]"
          >
            Go to dashboard
          </Link>
        </>
      ) : null}

      {isFailed ? (
        <>
          <AlertCircle className="mx-auto size-10 text-destructive" aria-hidden />
          <h1 className="mt-4 text-xl font-semibold text-[#173740]">
            Payment verification failed
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            {errorMessage ??
              "Unable to verify your re-enrollment payment. Please contact support."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => verify()}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#156374] px-6 text-sm font-semibold text-white hover:bg-[#124F5D]"
            >
              Try again
            </button>
            <Link
              href="/dashboard/internship-program"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#CBD5E1] px-6 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC]"
            >
              Go to dashboard
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function ReenrollmentPaymentFallback() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
      <Loader2
        className="mx-auto size-10 animate-spin text-[#156374]"
        aria-hidden
      />
      <p className="mt-4 text-sm text-[#64748B]">Loading payment status...</p>
    </div>
  );
}

export default function ReenrollmentPaymentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1F5F9] px-4 py-10">
      <Suspense fallback={<ReenrollmentPaymentFallback />}>
        <ReenrollmentPaymentContent />
      </Suspense>
    </main>
  );
}
