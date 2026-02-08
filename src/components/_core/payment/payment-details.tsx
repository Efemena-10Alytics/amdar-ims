"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { CheckoutSelections } from "@/types/payment";

const PERSONAL_DATA_KEYS: Array<{
  key: keyof Record<string, unknown>;
  label: string;
  withFlag?: boolean;
}> = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Phone number" },
  { key: "location", label: "Location", withFlag: true },
];

function getPersonalDataFromUser(user: Record<string, unknown> | null): Array<{
  label: string;
  value: string;
  withFlag?: boolean;
}> {
  if (!user) {
    return PERSONAL_DATA_KEYS.map(({ label, withFlag }) => ({
      label,
      value: "—",
      ...(withFlag && { withFlag }),
    }));
  }
  return PERSONAL_DATA_KEYS.map(({ key, label, withFlag }) => {
    let raw = user[key as string];
    if (
      key === "location" &&
      (raw == null || raw === "") &&
      user.country != null
    ) {
      raw = user.country;
    }
    const value = raw != null && typeof raw === "string" ? raw : "—";
    return { label, value, ...(withFlag && { withFlag }) };
  });
}

interface PaymentDetailsProps {
  checkoutSelections?: CheckoutSelections | null;
  onProceed?: () => void;
  isProcessingPayment?: boolean;
  paymentError?: string | null;
}

const PaymentDetails = ({
  checkoutSelections,
  onProceed,
  isProcessingPayment = false,
  paymentError = null,
}: PaymentDetailsProps) => {
  const [confirmInfo, setConfirmInfo] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const { user } = useAuthStore();
  const profile =
    user &&
    typeof user === "object" &&
    "user" in user &&
    user.user &&
    typeof user.user === "object"
      ? (user.user as Record<string, unknown>)
      : (user as Record<string, unknown> | null);
  const personalData = useMemo(
    () => getPersonalDataFromUser(profile),
    [profile],
  );

  return (
    <div className="flex flex-1 flex-col w-full">
      {/* Left column */}
      <div className="flex-1 w-full space-y-8 lg:pb-24">
        {/* Personal data */}
        <section>
          <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
            Personal data
          </h2>
          <dl className="mt-4 space-y-3 sm:gap-x-6 bg-[#F8FAFC] p-5 rounded-xl">
            {personalData.map(({ label, value, withFlag }) => (
              <div key={label}>
                <div className="flex items-center justify-between gap-2 text-right text-sm font-medium text-[#092A31]">
                  <div className="text-sm text-[#6b7280]">{label}</div>
                  <div className="flex gap-2">
                    {withFlag && (
                      <span className="text-base leading-none" aria-hidden>
                        🇳🇬
                      </span>
                    )}
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* Payment plan */}
        <section>
          <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
            Payment plan
          </h2>
          <div className="mt-4 rounded-xl bg-[#F8FAFC] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#6b7280]">Preferred cohort</p>
                <p className="mt-1 flex items-center gap-2 font-medium text-[#092A31]">
                  {checkoutSelections?.cohort?.name ?? "February Cohort"}
                  <span className="inline-flex rounded-full bg-[#d1fae5] px-2.5 py-0.5 text-xs font-medium text-[#065f46]">
                    {checkoutSelections?.cohort?.start_date ??
                      "February 7, 2026"}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-[#B6CFD4]/50 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6b7280]">Plan selected</p>
                <p className="mt-1 font-medium text-[#092A31]">
                  {checkoutSelections?.planLabel ?? "Full payment"}
                </p>
              </div>
              {checkoutSelections?.installmentBreakdown &&
              checkoutSelections.installmentBreakdown.length > 0 ? (
                <div className="space-y-2 border-[#B6CFD4]/50 pt-3">
                  {checkoutSelections.installmentBreakdown.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#6b7280]">
                        {item.label === "1st payment"
                          ? "First payment"
                          : item.label === "2nd payment"
                            ? "Second payment"
                            : item.label === "3rd payment"
                              ? "Third payment"
                              : item.label}
                      </span>
                      <span className="font-medium text-[#092A31]">
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : checkoutSelections?.planTotal ? (
                <div className="mt-3 flex justify-between text-sm border-t border-[#B6CFD4]/50 pt-3">
                  <span className="text-[#6b7280]">Payment</span>
                  <span className="font-medium text-[#092A31]">
                    {checkoutSelections.planTotal}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Total fee */}
        <section>
          <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
            Total fee
          </h2>
          <div className="mt-4 space-y-3 bg-[#F8FAFC] p-5 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Payment</span>
              <span className="font-medium text-[#092A31]">Full Payment</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Program fee</span>
              <span className="font-medium text-[#092A31]">
                {checkoutSelections?.planTotal ?? "USD 500"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Coupon (Discount)</span>
              <span className="font-medium text-[#092A31]">30%</span>
            </div>
            <div className="flex justify-between border-t border-[#e5e7eb] pt-3 text-base">
              <span className="font-medium text-[#092A31]">Amount to pay</span>
              <span className="font-clash-display font-bold text-primary">
                {checkoutSelections
                  ? (checkoutSelections.firstPaymentAmount ??
                    checkoutSelections.planTotal)
                  : "USD 390"}
              </span>
            </div>
          </div>
        </section>

        {/* Confirmation checkboxes */}
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              checked={confirmInfo}
              onCheckedChange={(v) => setConfirmInfo(v === true)}
              className="mt-0.5"
            />
            <span className="text-[#4a5568]">
              I confirm that my information is correct.
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              checked={confirmTerms}
              onCheckedChange={(v) => setConfirmTerms(v === true)}
              className="mt-0.5"
            />
            <span className="text-[#4a5568]">
              I have read the{" "}
              <Link
                href="/terms"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/90"
              >
                Amdari Terms & Conditions
              </Link>{" "}
              attached above and I agree.
            </span>
          </label>
        </div>

        {paymentError && (
          <p className="text-sm text-destructive" role="alert">
            {paymentError}
          </p>
        )}

        <Button
          className={cn(
            "w-full h-12 text-base font-semibold hidden lg:block",
            (!confirmInfo || !confirmTerms || isProcessingPayment) &&
              "pointer-events-none opacity-60",
          )}
          size="lg"
          disabled={!confirmInfo || !confirmTerms || isProcessingPayment}
          onClick={onProceed}
        >
          {isProcessingPayment ? "Processing…" : "Pay now"}
        </Button>
      </div>

      <Button
        className={cn(
          "w-full py-6 text-base font-semibold lg:hidden",
          (!confirmInfo || !confirmTerms || isProcessingPayment) &&
            "pointer-events-none opacity-60",
        )}
        size="lg"
        disabled={!confirmInfo || !confirmTerms || isProcessingPayment}
        onClick={onProceed}
      >
        {isProcessingPayment ? "Processing…" : "Pay now"}
      </Button>
    </div>
  );
};

export default PaymentDetails;
