"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutData } from "@/features/payment/use-get-checkout-data";
import type { CheckoutPricing, CheckoutSelections } from "@/types/payment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { InternshipProgram } from "@/types/internship-program";
import { PaymentStepId } from "./side-nav";

type PaymentPlanId = "full" | "2-installments" | "3-installments";

interface PaymentPlanOption {
  id: PaymentPlanId;
  label: string;
  description: string;
  total: string;
  breakdown: { label: string; amount: string }[] | null;
}

function getOrdinal(i: number): string {
  if (i === 0) return "1st";
  if (i === 1) return "2nd";
  if (i === 2) return "3rd";
  return `${i + 1}th`;
}

/** Derive payment plan options from the selected pricing (full = original_amount, 2 = two_installments_amount/2 each, 3 = display_three_installment_breakdown). */
function getPaymentPlansFromPricing(
  price: CheckoutPricing,
): PaymentPlanOption[] {
  const {
    currency,
    amount,
    original_amount,
    two_installments_amount,
    three_installments_amount,
    display_three_installment_breakdown,
  } = price;
  const half = Math.round(two_installments_amount / 2);
  const threeBreakdown =
    display_three_installment_breakdown &&
    display_three_installment_breakdown.length >= 3
      ? display_three_installment_breakdown
      : [
          Math.round(three_installments_amount / 3),
          Math.round(three_installments_amount / 3),
          three_installments_amount -
            2 * Math.round(three_installments_amount / 3),
        ];

  return [
    {
      id: "full",
      label: "Full Payment",
      description:
        "Make one time payment now and get full access to your course",
      total: `${currency} ${amount}`,
      breakdown: null,
    },
    {
      id: "2-installments",
      label: "2 Installments",
      description: `Pay ${currency} ${half} now and 2nd installment in the next month`,
      total: `${currency} ${two_installments_amount}`,
      breakdown: [
        { label: "1st payment", amount: `${currency} ${half}` },
        { label: "2nd payment", amount: `${currency} ${half}` },
      ],
    },
    {
      id: "3-installments",
      label: "3 Installments",
      description: "Pay in 3 installments over 3 months",
      total: `${currency} ${three_installments_amount}`,
      breakdown: threeBreakdown.map((amt, i) => ({
        label: `${getOrdinal(i)} payment`,
        amount: `${currency} ${amt}`,
      })),
    },
  ];
}

interface CheckoutProps {
  checkoutData?: CheckoutData;
  program?: InternshipProgram;
  setActiveStep: React.Dispatch<React.SetStateAction<PaymentStepId>>;
  onProceed?: (selections: CheckoutSelections) => void;
}

const Checkout = ({
  checkoutData,
  program,
  setActiveStep,
  onProceed,
}: CheckoutProps) => {
  const firstCurrency = checkoutData?.pricings?.[0]?.currency ?? "USD";
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId | null>(null);
  const [currency, setCurrency] = useState<string>(firstCurrency);

  const selectedPricing = useMemo(
    () =>
      checkoutData?.pricings?.find((p) => p.currency === currency) ??
      checkoutData?.pricings?.[0],
    [checkoutData?.pricings, currency],
  );
  const paymentPlans = useMemo(
    () => (selectedPricing ? getPaymentPlansFromPricing(selectedPricing) : []),
    [selectedPricing],
  );

  useEffect(() => {
    const currencies = checkoutData?.pricings?.map((p) => p.currency) ?? [];
    if (currencies.length > 0 && !currencies.includes(currency)) {
      setCurrency(currencies[0]);
    }
  }, [checkoutData?.pricings, currency]);

  const canProceed =
    selectedCohort !== null && !!selectedPricing && !!selectedPlan;

  const selectedCohortData = useMemo(
    () => checkoutData?.upcoming_cohorts?.find((c) => c.id === selectedCohort),
    [checkoutData?.upcoming_cohorts, selectedCohort],
  );
  const selectedPlanOption = useMemo(
    () => paymentPlans.find((p) => p.id === selectedPlan),
    [paymentPlans, selectedPlan],
  );

  const handleProceed = () => {
    if (!selectedCohortData || !selectedPricing || !selectedPlanOption) return;
    const firstPaymentAmount =
      selectedPlan === "full"
        ? null
        : (selectedPlanOption.breakdown?.[0]?.amount ?? null);
    onProceed?.({
      cohort: selectedCohortData,
      planId: selectedPlanOption.id,
      currency,
      pricing: selectedPricing,
      planLabel: selectedPlanOption.label,
      planTotal: selectedPlanOption.total,
      firstPaymentAmount,
      installmentBreakdown: selectedPlanOption.breakdown ?? null,
    });
    setActiveStep("personal");
  };

  return (
    <main className="min-w-0 w-full flex-1 space-y-10 pb-24">
      {/* 1. Confirm your enrollment */}
      <section>
        <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
          Confirm your enrollment
        </h2>
        <p className="mt-1 text-sm text-[#4a5568]">
          Please review your course details and choose a payment plan that works
          for you to proceed.
        </p>
        <div className="mt-4 rounded-xl bg-[#E8EFF1] p-5">
          <h3 className="font-clash-display font-semibold text-[#092A31]">
            {program?.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#4a5568]">
            {program?.description}
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b7280]">
              <span>30% discount</span>
              <span>Ending soon</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-[#9ca3af] line-through">
                {selectedPricing
                  ? `${selectedPricing.currency} ${selectedPricing.original_amount}`
                  : "—"}
              </span>
              <span className="font-clash-display text-xl font-bold text-primary">
                {selectedPricing
                  ? `${selectedPricing.currency} ${selectedPricing.amount}`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Select your preferred cohort */}
      <section>
        <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
          Select your preferred cohort
        </h2>
        <p className="mt-1 text-sm text-[#4a5568]">
          When will you like to start your internship? Choose the cohort that
          best fits your schedule.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {checkoutData?.upcoming_cohorts.map((cohort) => {
            const isSelected = selectedCohort === cohort.id;
            return (
              <button
                key={cohort.id}
                type="button"
                onClick={() => setSelectedCohort(cohort.id)}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-left transition-colors",
                  isSelected
                    ? "border-[#22c55e] bg-[#f0fdf4]"
                    : "border-[#e5e7eb] bg-white hover:border-[#d1d5db]",
                )}
              >
                <div className="flex gap-2 items-center mb-1">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border",
                      isSelected
                        ? "border-[#22c55e] bg-[#22c55e] text-white"
                        : "border-[#d1d5db] bg-white",
                    )}
                  >
                    {isSelected && (
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-clash-display font-semibold",
                      isSelected ? "text-[#092A31]" : "text-[#4a5568]",
                    )}
                  >
                    {cohort.name}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-[#6b7280]">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{cohort.start_date}</span>
                  <span>·</span>
                  <span>{cohort.month}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Payment options */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
              Payment options
            </h2>
            <p className="mt-1 text-sm text-[#4a5568]">
              Payment is flexible! Select a payment plan that works for you
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-22 justify-between gap-2 rounded-lg border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#092A31] hover:bg-[#f9fafb] focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {currency}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuRadioGroup
                value={currency}
                onValueChange={setCurrency}
              >
                {checkoutData?.pricings.map((price) => (
                  <DropdownMenuRadioItem key={price.id} value={price.currency}>
                    {price.currency}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 space-y-3">
          {paymentPlans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-colors",
                  isSelected
                    ? "border-[#22c55e] bg-[#f0fdf4]"
                    : "border-[#e5e7eb] bg-white hover:border-[#d1d5db]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    isSelected
                      ? "border-[#22c55e] bg-[#22c55e]"
                      : "border-[#d1d5db] bg-white",
                  )}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "font-clash-display font-semibold",
                      isSelected ? "text-[#092A31]" : "text-[#4a5568]",
                    )}
                  >
                    {plan.label}
                  </span>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    {plan.description}
                  </p>
                  {plan.breakdown && plan.breakdown.length > 0 && (
                    <div className="mt-3 space-y-1 rounded-lg bg-white/60 py-2 pl-3 pr-4 text-sm text-[#6b7280]">
                      {plan.breakdown.map((row, i) => (
                        <div key={i} className="flex justify-between gap-4">
                          <span>{row.label}</span>
                          <span className="font-medium text-[#4a5568]">
                            {row.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="shrink-0 font-clash-display font-semibold text-[#092A31]">
                  {plan.total}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="w-full">
        <Button
          onClick={handleProceed}
          disabled={!canProceed}
          className="w-full bg-primary h-12 font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          Proceed to Payment
        </Button>
      </div>
    </main>
  );
};

export default Checkout;
