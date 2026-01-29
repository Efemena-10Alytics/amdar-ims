"use client";

import React, { useState } from "react";
import Link from "next/link";
import Coupon from "./coupon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const inputClassName =
  "w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#092A31] placeholder:text-[#9ca3af] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const Payment = () => {
  const [saveCard, setSaveCard] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
      <div className="min-w-0 flex-1 space-y-8 pb-24">
        {/* Payment details */}
        <section>
          <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
            Payment details
          </h2>
          <div className="mt-4  bg-[#F8FAFC] p-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-[#6b7280]">Program</span>
              <span className="font-medium text-[#092A31]">Cybersecurity</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span className="text-[#6b7280]">Preferred cohort</span>
              <span className="font-medium text-[#092A31]">February Cohort</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span className="text-[#6b7280]">First payment</span>
              <span className="font-medium text-[#092A31]">USD 195</span>
            </div>
          </div>
        </section>

        {/* Total fee – card inputs */}
        <section>
          <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
            Total fee
          </h2>
          <div className="mt-4 rounded-xl bg-[#F8FAFC] p-5 space-y-4">
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-[#092A31]">
                Card number
              </label>
              <input
                id="card-number"
                type="text"
                placeholder="234 1234 1234 1234"
                className={inputClassName}
                maxLength={19}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-[#092A31]">
                  Expiry date
                </label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="mm/yy"
                  className={inputClassName}
                  maxLength={5}
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-[#092A31]">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  placeholder="3 digit behind your card"
                  className={inputClassName}
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label htmlFor="cardholder" className="block text-sm font-medium text-[#092A31]">
                Cardholder name
              </label>
              <input
                id="cardholder"
                type="text"
                placeholder="John Doe"
                className={inputClassName}
              />
            </div>
          </div>
        </section>

        {/* Checkboxes */}
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              checked={saveCard}
              onCheckedChange={(v) => setSaveCard(v === true)}
              className="mt-0.5"
            />
            <span className="text-[#4a5568]">Save my card details.</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              checked={agreeTerms}
              onCheckedChange={(v) => setAgreeTerms(v === true)}
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
          className="w-full py-6 text-base font-semibold"
          size="lg"
          disabled={!agreeTerms}
        >
          Make payment
        </Button>
      </div>
      <Coupon />
    </div>
  );
};

export default Payment;
