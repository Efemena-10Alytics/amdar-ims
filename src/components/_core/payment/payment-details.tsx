"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Coupon from "./coupon";

const PERSONAL_DATA: Array<{
  label: string;
  value: string;
  withFlag?: boolean;
}> = [
  { label: "First name", value: "Juwonlo" },
  { label: "Last name", value: "Amber" },
  { label: "Email", value: "juwonlo@amdari.io" },
  { label: "Phone number", value: "(+234) 081 1122 333" },
  { label: "Location", value: "Nigeria", withFlag: true },
];

const PaymentDetails = () => {
  const [confirmInfo, setConfirmInfo] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
      {/* Left column */}
      <div className="min-w-0 flex-1 space-y-8 pb-24">
        {/* Personal data */}
        <section>
          <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
            Personal data
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-x-6 bg-[#F8FAFC] p-5 rounded-xl">
            {PERSONAL_DATA.map(({ label, value, withFlag }) => (
              <React.Fragment key={label}>
                <dt className="text-sm text-[#6b7280]">{label}</dt>
                <dd className="flex items-center justify-end gap-2 text-right text-sm font-medium text-[#092A31] sm:justify-end">
                  {withFlag && (
                    <span className="text-base leading-none" aria-hidden>
                      🇳🇬
                    </span>
                  )}
                  {value}
                </dd>
              </React.Fragment>
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
                  February Cohort
                  <span className="inline-flex rounded-full bg-[#d1fae5] px-2.5 py-0.5 text-xs font-medium text-[#065f46]">
                    February 7, 2026
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-[#B6CFD4]/50 pt-4">
              <p className="text-sm text-[#6b7280]">Plan selected</p>
              <p className="mt-1 font-medium text-[#092A31]">Full payment</p>
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
              <span className="font-medium text-[#092A31]">USD 500</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Coupon (Discount)</span>
              <span className="font-medium text-[#092A31]">30%</span>
            </div>
            <div className="flex justify-between border-t border-[#e5e7eb] pt-3 text-base">
              <span className="font-medium text-[#092A31]">Amount to pay</span>
              <span className="font-clash-display font-bold text-primary">
                USD 390
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

        <Button
          className={cn(
            "w-full py-6 text-base font-semibold",
            (!confirmInfo || !confirmTerms) && "pointer-events-none opacity-60",
          )}
          size="lg"
          disabled={!confirmInfo || !confirmTerms}
        >
          Proceed
        </Button>
      </div>

      {/* Right column – Coupon/promo code */}
      <Coupon />
    </div>
  );
};

export default PaymentDetails;
