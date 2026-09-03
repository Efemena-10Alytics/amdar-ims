"use client";

import { useState } from "react";
import { formatCurrency } from "@/features/payment/mock-data";
import { usePayInvoiceNow } from "@/features/payment/use-pay-invoice-now";
import type { NextPayment } from "@/features/payment/types";
import { CalendarBadgeIcon, GracePeriodIcon, PayNowIcon } from "./icons";
import { GracePeriodDrawer } from "./grace-period-drawer";

export function PaymentBanner({
  nextPayment,
  nextInvoiceId,
  paymentPlanId,
  cohort,
  program,
}: {
  nextPayment: NextPayment;
  nextInvoiceId?: string | number | null;
  paymentPlanId?: string | number;
  cohort?: string;
  program?: string;
}) {
  const [isGracePeriodOpen, setIsGracePeriodOpen] = useState(false);
  const { mutate: payNow, isPending: isPayingNow } = usePayInvoiceNow();
  const [payNowError, setPayNowError] = useState("");

  const handlePayNow = () => {
    if (!nextInvoiceId || isPayingNow) return;
    setPayNowError("");
    payNow(nextInvoiceId, {
      onSuccess: (response) => {
        const url = response?.data?.checkout_session?.url;
        if (url) {
          window.location.href = url;
        } else {
          setPayNowError("Could not start checkout. Please try again.");
        }
      },
      onError: () => {
        setPayNowError("Could not start checkout. Please try again.");
      },
    });
  };

  return (
    <div
      className="flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between"
      style={{ background: "#FFF5D8", border: "0.5px solid #E4BF7F" }}
    >
      <div className="flex items-center gap-4">
        <CalendarBadgeIcon />
        <div className="flex flex-col gap-1">
          <span className="font-sora text-sm text-[#092A31]">Next Payment Date</span>
          <div className="flex items-center gap-2">
            <span className="font-clash-display text-2xl font-semibold text-[#334155]">
              {nextPayment.dueDate}
            </span>
            <span
              className="inline-flex h-6.75 w-fit items-center gap-2 rounded-full p-1.5 font-sora text-xs text-[#092A31]"
              style={{ background: "#EDD3A7", border: "1px solid #EDD3A7" }}
            >
              In {nextPayment.daysUntilDue} days
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 sm:mr-4">
        <span className="font-sora text-sm text-[#092A31]">
          {nextPayment.installmentLabel}
        </span>
        <span className="font-clash-display text-xl font-semibold text-[#092A31]">
          {formatCurrency(nextPayment.amount)}
        </span>
      </div>

      <div className="flex flex-col items-start gap-1 sm:items-end">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isPayingNow || !nextInvoiceId}
            className="flex h-12 items-center gap-2 rounded-full bg-[#156374] px-4 font-sora text-base text-white transition-colors hover:bg-[#156374]/90 disabled:opacity-60"
          >
            <PayNowIcon />
            {isPayingNow ? "Processing…" : "Pay Now"}
          </button>
          <button
            type="button"
            onClick={() => setIsGracePeriodOpen(true)}
            className="flex h-12 items-center gap-2 rounded-full border border-[#15637426] bg-white px-4 font-sora text-sm text-[#156374] transition-colors hover:bg-[#F8FAFC]"
          >
            <GracePeriodIcon />
            Grace Period
          </button>
        </div>
        {payNowError ? (
          <span className="font-sora text-xs text-[#AA3030]">{payNowError}</span>
        ) : null}
      </div>

      <GracePeriodDrawer
        open={isGracePeriodOpen}
        onOpenChange={setIsGracePeriodOpen}
        paymentPlanId={paymentPlanId}
        defaultCohort={cohort}
        defaultProgram={program}
      />
    </div>
  );
}
