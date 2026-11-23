"use client";

import { useState } from "react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { isSpecialistPreviewEnrollment } from "@/features/internship/resolve-enrollment-journey";
import {
  formatBannerDueDate,
  formatPaymentAmount,
} from "@/features/payment/format-payment";
import { useGetPaymentStatus } from "@/features/payment/use-get-payment-status";
import { usePayInvoiceNow } from "@/features/payment/use-pay-invoice-now";
import type { PaymentStatusData } from "@/features/payment/types";
import { cn } from "@/lib/utils";
import { PayNowIcon } from "../billing/icons";
import { PaymentStatusCountdown } from "./payment-status-countdown";

type BannerStatus = "due_soon" | "due_today" | "grace_period" | "extension_period";

type BannerThemeConfig = {
  containerClassName: string;
  iconBgClassName: string;
  iconColorClassName: string;
  countdownVariant: "warning" | "danger";
  title: string;
  titleTag?: string;
  getSubtitle: (data: PaymentStatusData, formattedAmount: string) => string;
};

const BANNER_CONFIG: Record<BannerStatus, BannerThemeConfig> = {
  due_soon: {
    containerClassName: "border-[#E9C97B] bg-[#FFF6DA]",
    iconBgClassName: "bg-[#FDE68A]",
    iconColorClassName: "text-[#9C7A1F]",
    countdownVariant: "warning",
    title: "Payment due soon",
    getSubtitle: (data, formattedAmount) =>
      `Your next payment of ${formattedAmount} is due on ${formatBannerDueDate(data.invoice?.due_date)}.`,
  },
  due_today: {
    containerClassName: "border-[#EE7676] bg-[#FEF0F0]",
    iconBgClassName: "bg-[#FBC8C8]",
    iconColorClassName: "text-[#EF4444]",
    countdownVariant: "danger",
    title: "Payment due today",
    getSubtitle: (_data, formattedAmount) =>
      `Your payment of ${formattedAmount} is due today.`,
  },
  grace_period: {
    containerClassName: "border-[#EE7676] bg-[#FEF0F0]",
    iconBgClassName: "bg-[#FBC8C8]",
    iconColorClassName: "text-[#EF4444]",
    countdownVariant: "danger",
    title: "Payment overdue",
    titleTag: "(grace period)",
    getSubtitle: (data, formattedAmount) =>
      `Pay ${formattedAmount} within the ${data.grace_period_days}-day grace period to keep access to your dashboard and resources.`,
  },
  extension_period: {
    containerClassName: "border-[#E76A6A] bg-[#FBC5C5]",
    iconBgClassName: "bg-[#F7A8A8]",
    iconColorClassName: "text-[#DC2626]",
    countdownVariant: "danger",
    title: "Payment overdue",
    titleTag: "(extension period)",
    getSubtitle: (_data, formattedAmount) =>
      `Pay ${formattedAmount} now. When the extension period ends, you lose access to your dashboard and resources.`,
  },
};

function isBannerStatus(status: PaymentStatusData["status"]): status is BannerStatus {
  return (
    status === "due_soon" ||
    status === "due_today" ||
    status === "grace_period" ||
    status === "extension_period"
  );
}

function StatusClockIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12 7V12L15 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="15.5" cy="3.8" r="1" fill="currentColor" />
      <circle cx="18.5" cy="5.6" r="1" fill="currentColor" />
      <circle cx="20.3" cy="8.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function PaymentStatusBanner() {
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();
  const { data: enrollment } = useGetUserEnrollment();
  const isSpecialistPreview = isSpecialistPreviewEnrollment(enrollment);
  const shouldFetch = isRoleReady && !isInternshipSpecialist && !isSpecialistPreview;

  const { data: paymentStatus, refetch } = useGetPaymentStatus({
    enabled: shouldFetch,
  });
  const { mutate: payNow, isPending: isPayingNow } = usePayInvoiceNow();
  const [payError, setPayError] = useState("");

  if (
    !shouldFetch ||
    !paymentStatus ||
    !isBannerStatus(paymentStatus.status) ||
    !paymentStatus.invoice
  ) {
    return null;
  }

  const config = BANNER_CONFIG[paymentStatus.status];
  const { invoice } = paymentStatus;
  const formattedAmount = formatPaymentAmount(invoice.amount, invoice.currency);
  const daysUntilDue = paymentStatus.days_until_due;

  const handlePayNow = () => {
    if (isPayingNow) return;
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

  return (
    <section
      aria-label={config.title}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border px-5 py-4 lg:flex-row lg:items-center lg:justify-between",
        config.containerClassName,
      )}
    >
      <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12",
            config.iconBgClassName,
          )}
        >
          <StatusClockIcon className={cn("size-6", config.iconColorClassName)} />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-sora text-base font-bold text-[#0F2A33] sm:text-lg">
              {config.title}
            </h2>

            {config.titleTag ? (
              <span className="font-sora text-sm font-semibold text-[#0F2A33] sm:text-base">
                {config.titleTag}
              </span>
            ) : null}

            {paymentStatus.status === "due_soon" && daysUntilDue != null ? (
              <span className="inline-flex items-center rounded-full bg-[#EDD3A7] px-2.5 py-0.5 font-sora text-xs font-medium text-[#3B2E14]">
                In {daysUntilDue} {daysUntilDue === 1 ? "day" : "days"}
              </span>
            ) : null}
          </div>

          <p className="font-sora text-xs leading-relaxed text-[#334155] sm:text-sm">
            {config.getSubtitle(paymentStatus, formattedAmount)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1.5 lg:items-end">
        <div className="flex flex-wrap items-center gap-3">
          <PaymentStatusCountdown
            secondsRemaining={paymentStatus.seconds_remaining}
            anchorKey={`${paymentStatus.status}:${paymentStatus.deadline_at ?? ""}:${paymentStatus.seconds_remaining ?? ""}`}
            variant={config.countdownVariant}
            onExpire={() => {
              void refetch();
            }}
          />

          <button
            type="button"
            onClick={handlePayNow}
            disabled={isPayingNow}
            className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#156374] px-5 font-sora text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#125260] disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-base"
          >
            <PayNowIcon />
            {isPayingNow ? "Processing…" : `Pay ${formattedAmount}`}
          </button>
        </div>

        {payError ? (
          <p className="font-sora text-xs text-[#B91C1C]" role="alert">
            {payError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
