"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  formatInstallmentPlanLabel,
  formatModalOverdueDate,
  formatPaymentAmount,
  formatPaymentCodeAmount,
} from "@/features/payment/format-payment";
import { usePayInvoiceNow } from "@/features/payment/use-pay-invoice-now";
import type {
  PaymentLockReason,
  PaymentStatusData,
} from "@/features/payment/types";

const DISMISS_STORAGE_PREFIX = "amdari_overdue_modal_dismissed";

function getDismissStorageKey(data: PaymentStatusData): string {
  const planId = data.payment_plan?.id ?? "none";
  const invoiceId = data.invoice?.id ?? "none";
  return `${DISMISS_STORAGE_PREFIX}:${planId}:${invoiceId}:${data.status}`;
}

function getModalCopy(data: PaymentStatusData): {
  title: string;
  subtitle: string;
} {
  const { status, lock_reason: lockReason, invoice, grace_period_days: graceDays } =
    data;
  const formattedAmount = invoice
    ? formatPaymentAmount(invoice.amount, invoice.currency)
    : null;

  if (status === "grace_period") {
    return {
      title: "Your payment is overdue",
      subtitle: formattedAmount
        ? `Pay ${formattedAmount} within the ${graceDays}-day grace period to keep access to your dashboard and resources.`
        : `Pay within the ${graceDays}-day grace period to keep access to your dashboard and resources.`,
    };
  }

  if (status === "extension_period") {
    return {
      title: "Your payment is overdue",
      subtitle: formattedAmount
        ? `Pay ${formattedAmount} before your extension ends to keep access to your dashboard and resources.`
        : "Pay before your extension ends to keep access to your dashboard and resources.",
    };
  }

  const lockMessages: Record<
    PaymentLockReason,
    { title: string; subtitle: string }
  > = {
    grace_period_expired: {
      title: "Your payment is overdue",
      subtitle: formattedAmount
        ? `Your ${graceDays}-day grace period has expired. Pay ${formattedAmount} to restore access to your dashboard and resources.`
        : `Your ${graceDays}-day grace period has expired. Complete your payment to restore access to your dashboard and resources.`,
    },
    extension_expired: {
      title: "Your payment is overdue",
      subtitle: formattedAmount
        ? `Your payment extension period has expired. Pay ${formattedAmount} to restore access to your dashboard and resources.`
        : "Your payment extension period has expired. Complete your payment to restore access to your dashboard and resources.",
    },
    bad_debt: {
      title: "Your payment is overdue",
      subtitle: formattedAmount
        ? `Your payment plan is past due. Pay ${formattedAmount} to restore access to your dashboard and resources.`
        : "Your payment plan is past due. Complete your payment to restore access to your dashboard and resources.",
    },
    pending_first_payment: {
      title: "Complete your enrollment payment",
      subtitle:
        "Your initial checkout was not completed. Complete your first payment to unlock your dashboard and resources.",
    },
    cancelled: {
      title: "Payment plan cancelled",
      subtitle:
        "Your payment plan has been cancelled. Enroll in a program to regain access to your dashboard and resources.",
    },
    refunded: {
      title: "Payment plan refunded",
      subtitle:
        "Your payment plan has been refunded. Enroll in a program to regain access to your dashboard and resources.",
    },
    no_payment_plan: {
      title: "No active payment plan",
      subtitle:
        "You don't have an active payment plan for this dashboard yet. Enroll in a program to get started.",
    },
  };

  if (lockReason && lockMessages[lockReason]) {
    return lockMessages[lockReason];
  }

  return {
    title: "Dashboard access locked",
    subtitle: formattedAmount
      ? `Pay ${formattedAmount} to restore access to your dashboard and resources.`
      : "Complete your enrollment payment to access your dashboard and resources.",
  };
}

function ModalPaymentIcon() {
  return (
    <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#FFF3C4]">
      <svg
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          x="1"
          y="2"
          width="20"
          height="14"
          rx="2.5"
          stroke="#156374"
          strokeWidth="1.75"
        />
        <circle
          cx="11"
          cy="9"
          r="2.75"
          stroke="#156374"
          strokeWidth="1.75"
        />
        <path
          d="M4.5 6V12M17.5 6V12"
          stroke="#156374"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function PaymentStatusModal({
  paymentStatus,
}: {
  paymentStatus: PaymentStatusData;
}) {
  const isDismissible = paymentStatus.can_access_dashboard;
  const dismissKey = getDismissStorageKey(paymentStatus);

  const [dismissedKey, setDismissedKey] = useState<string | null>(() => {
    if (typeof window === "undefined" || !isDismissible) return null;
    try {
      return sessionStorage.getItem(dismissKey) === "1" ? dismissKey : null;
    } catch {
      return null;
    }
  });

  const { mutate: payNow, isPending: isPayingNow } = usePayInvoiceNow();
  const [payError, setPayError] = useState("");

  const isDismissed = isDismissible && dismissedKey === dismissKey;

  const handleDismiss = () => {
    if (!isDismissible) return;
    try {
      sessionStorage.setItem(dismissKey, "1");
    } catch {
      // Ignore storage quota/privacy mode errors
    }
    setDismissedKey(dismissKey);
  };

  useEffect(() => {
    if (!isDismissible || isDismissed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!paymentStatus.show_modal || isDismissed) {
    return null;
  }

  const { title, subtitle } = getModalCopy(paymentStatus);
  const { invoice, payment_plan: plan } = paymentStatus;

  const handlePayNow = () => {
    if (!invoice || isPayingNow) return;
    setPayError("");
    payNow(
      { invoiceId: invoice.id },
      {
        onSuccess: (response) => {
          const url = response?.data?.checkout_session?.url;
          if (url) {
            window.location.href = url;
          } else {
            setPayError("Could not start checkout. Please try again.");
          }
        },
        onError: () => {
          setPayError("Could not start checkout. Please try again.");
        },
      },
    );
  };

  const checkoutHref = plan?.program?.id
    ? `/payment/${plan.program.id}`
    : "/internship";

  const dateLabel =
    paymentStatus.days_overdue > 0 ? "Overdue on" : "Due on";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-status-modal-title"
      className="absolute inset-0 z-40 bg-[#092A31]/45 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget && isDismissible) {
          handleDismiss();
        }
      }}
    >
      <div
        className="sticky top-0 flex min-h-screen w-full items-center justify-center p-4"
        onClick={(event) => {
          if (event.target === event.currentTarget && isDismissible) {
            handleDismiss();
          }
        }}
      >
        <div className="relative w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
          {isDismissible ? (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close modal"
              className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F2A33]"
            >
              <X className="size-4" />
            </button>
          ) : null}

          <ModalPaymentIcon />

          <h2
            id="payment-status-modal-title"
            className="mt-4 text-center font-sora text-xl font-bold text-[#0F2A33]"
          >
            {title}
          </h2>

          <p className="mt-2 text-center font-sora text-sm leading-relaxed text-[#475569]">
            {subtitle}
          </p>

          {invoice ? (
            <div className="mt-5 rounded-xl bg-[#F4F7F8] p-3.5">
              {plan ? (
                <p className="mb-2.5 font-sora text-xs font-medium text-[#334155]">
                  {formatInstallmentPlanLabel(plan.installments)}
                </p>
              ) : null}

              <div className="space-y-2.5 rounded-lg border border-[#F28B8B] bg-[#FEF4F4] px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sora text-sm font-medium text-[#1E293B]">
                    {invoice.installment_label}
                  </span>
                  <span className="font-sora text-sm font-bold text-[#0F2A33]">
                    {formatPaymentCodeAmount(invoice.amount, invoice.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-sora text-xs text-[#64748B]">
                    {dateLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#FDE2E2] px-2.5 py-0.5 font-sora text-[11px] font-medium text-[#B91C1C]">
                    {formatModalOverdueDate(invoice.original_due_date)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {payError ? (
            <p
              className="mt-3 text-center font-sora text-xs text-[#B91C1C]"
              role="alert"
            >
              {payError}
            </p>
          ) : null}

          <div className="mt-5">
            {invoice ? (
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isPayingNow}
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[#156374] px-5 font-sora text-sm font-medium text-white transition-colors hover:bg-[#125260] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPayingNow ? "Processing…" : "Proceed to make payment"}
              </button>
            ) : (
              <Link
                href={checkoutHref}
                className="flex h-11 w-full items-center justify-center rounded-full bg-[#156374] px-5 font-sora text-sm font-medium text-white transition-colors hover:bg-[#125260]"
              >
                {plan?.program?.id
                  ? "Proceed to program checkout"
                  : "Browse internship programs"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
