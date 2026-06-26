"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutData } from "@/features/payment/use-get-checkout-data";
import type {
  CheckoutPricing,
  CheckoutSelections,
  SplitFirstPayment,
} from "@/types/payment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { InternshipProgram } from "@/types/internship-program";
import {
  useCheckoutFormStorage,
  type PaymentPlanId,
} from "@/features/payment/use-checkout-storage";
import { FillCalendaSvg } from "../landing-pages/internship-program/svg";
import { FirstPaymentModal } from "./first-payment-modal";

interface PaymentPlanOption {
  id: PaymentPlanId;
  label: string;
  description: string;
  total: string;
  breakdown: { label: string; amount: string; dueDate?: string }[] | null;
}

function getOrdinal(i: number): string {
  if (i === 0) return "1st";
  if (i === 1) return "2nd";
  if (i === 2) return "3rd";
  return `${i + 1}th`;
}

/** Format a date N months from today for "next payment" display. */
function getNextPaymentDate(monthsFromNow: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format a date N * 14 days from today for bi-weekly "next payment" display. */
function getBiweeklyPaymentDate(periodsFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + periodsFromNow * 14);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format a date N * 7 days from today for weekly "next payment" display. */
function getWeeklyPaymentDate(periodsFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + periodsFromNow * 7);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildBiweeklyBreakdown(
  currency: string,
  total: number,
  count: number,
  displayBreakdown?: number[],
): { label: string; amount: string; dueDate?: string }[] {
  const amounts =
    displayBreakdown && displayBreakdown.length >= count
      ? displayBreakdown
      : Array.from({ length: count }, (_, i) => {
          const base = Math.round(total / count);
          return i === count - 1 ? total - base * (count - 1) : base;
        });
  return amounts.map((amt, i) => ({
    label: `${getOrdinal(i)} payment`,
    amount: `${currency} ${amt}`,
    dueDate: i === 0 ? "Due now" : `Due ${getBiweeklyPaymentDate(i)}`,
  }));
}

function buildWeeklyBreakdown(
  currency: string,
  total: number,
  count: number,
  displayBreakdown?: number[],
): { label: string; amount: string; dueDate?: string }[] {
  const amounts =
    displayBreakdown && displayBreakdown.length >= count
      ? displayBreakdown
      : Array.from({ length: count }, (_, i) => {
          const base = Math.round(total / count);
          return i === count - 1 ? total - base * (count - 1) : base;
        });
  return amounts.map((amt, i) => ({
    label: `${getOrdinal(i)} payment`,
    amount: `${currency} ${amt}`,
    dueDate: i === 0 ? "Due now" : `Due ${getWeeklyPaymentDate(i)}`,
  }));
}

/** Derive payment plan options from the selected pricing (full = original_amount, 2 = two_installments_amount/2 each, 3 = display_three_installment_breakdown). */
function getPaymentPlansFromPricing(
  price: CheckoutPricing,
): PaymentPlanOption[] {
  const {
    currency,
    amount,
    two_installments_amount,
    three_installments_amount,
    display_three_installment_breakdown,
    five_installments_amount,
    display_five_installment_breakdown,
    six_installments_amount,
    display_six_installment_breakdown,
    eight_installments_amount,
    display_eight_installment_breakdown,
    nine_installments_amount,
    display_nine_installment_breakdown,
    ten_installments_amount,
    display_ten_installment_breakdown,
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

  const plans: PaymentPlanOption[] = [
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
        {
          label: "1st payment",
          amount: `${currency} ${half}`,
          dueDate: "Due now",
        },
        {
          label: "2nd payment",
          amount: `${currency} ${half}`,
          dueDate: `Due ${getNextPaymentDate(1)}`,
        },
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
        dueDate: i === 0 ? "Due now" : `Due ${getNextPaymentDate(i)}`,
      })),
    },
  ];

  if (five_installments_amount != null) {
    plans.push({
      id: "5-installments",
      label: "Bi-weekly Installments",
      description: "Pay in 5 installments, every 2 weeks",
      total: `${currency} ${five_installments_amount}`,
      breakdown: buildBiweeklyBreakdown(
        currency,
        five_installments_amount,
        5,
        display_five_installment_breakdown,
      ),
    });
  }

  if (six_installments_amount != null) {
    plans.push({
      id: "6-installments",
      label: "6 Bi-weekly Installments",
      description: "Pay in 6 installments, every 2 weeks",
      total: `${currency} ${six_installments_amount}`,
      breakdown: buildBiweeklyBreakdown(
        currency,
        six_installments_amount,
        6,
        display_six_installment_breakdown,
      ),
    });
  }

  if (eight_installments_amount != null) {
    plans.push({
      id: "8-installments",
      label: "8 Weekly Installments",
      description: "Pay in 8 installments, every week",
      total: `${currency} ${eight_installments_amount}`,
      breakdown: buildWeeklyBreakdown(
        currency,
        eight_installments_amount,
        8,
        display_eight_installment_breakdown,
      ),
    });
  }

  if (nine_installments_amount != null) {
    plans.push({
      id: "9-installments",
      label: "9 Weekly Installments",
      description: "Pay in 9 installments, every week",
      total: `${currency} ${nine_installments_amount}`,
      breakdown: buildWeeklyBreakdown(
        currency,
        nine_installments_amount,
        9,
        display_nine_installment_breakdown,
      ),
    });
  }

  if (ten_installments_amount != null) {
    plans.push({
      id: "10-installments",
      label: "Weekly Installments",
      description: "Pay in 10 installments, every week",
      total: `${currency} ${ten_installments_amount}`,
      breakdown: buildWeeklyBreakdown(
        currency,
        ten_installments_amount,
        10,
        display_ten_installment_breakdown,
      ),
    });
  }

  return plans;
}

interface CheckoutProps {
  checkoutData?: CheckoutData;
  program?: InternshipProgram;
  promoCode?: string;
  /** When true, shows the split-first-installment feature (Edit 1st payment). */
  isUnique?: boolean;
  /** Parent calls this with selections; parent is responsible for navigating to next step (or e.g. opening sign-in). */
  onProceed?: (selections: CheckoutSelections) => void;
}

const Checkout = ({
  checkoutData,
  program,
  promoCode,
  isUnique = false,
  onProceed,
}: CheckoutProps) => {
  const firstCurrency = checkoutData?.pricings?.[0]?.currency ?? "USD";
  const {
    selectedCohort,
    setSelectedCohort,
    selectedPlan,
    setSelectedPlan,
    currency,
    setCurrency,
    persistSelections,
  } = useCheckoutFormStorage(program?.id, checkoutData, firstCurrency);

  const [firstPaymentSplit, setFirstPaymentSplit] =
    useState<SplitFirstPayment | null>(null);
  const [splitModalOpen, setSplitModalOpen] = useState(false);

  // Persist selections and notify parent; parent controls navigation (e.g. may open sign-in if not logged in)
  const handleProceedWithPersist = (selections: CheckoutSelections) => {
    persistSelections(selections);
    onProceed?.(selections);
  };

  const selectedPricing = useMemo(
    () =>
      checkoutData?.pricings?.find((p) => p.currency === currency) ??
      checkoutData?.pricings?.[0],
    [checkoutData?.pricings, currency],
  );
  const paymentPlans = useMemo(() => {
    const plans = selectedPricing
      ? getPaymentPlansFromPricing(selectedPricing)
      : [];
    const normalizedPromoCode = promoCode?.trim().toUpperCase();

    return plans.filter((p) => {
      if (isUnique) return p.id === "3-installments";
      if (p.id === "2-installments") return false;
      if (normalizedPromoCode === "BBAMD26" && p.id === "3-installments") {
        return false;
      }
      return true;
    });
  }, [promoCode, selectedPricing, isUnique]);

  useEffect(() => {
    const currencies = checkoutData?.pricings?.map((p) => p.currency) ?? [];
    if (currencies.length > 0 && !currencies.includes(currency)) {
      setCurrency(currencies[0]);
    }
  }, [checkoutData?.pricings, currency]);

  // If a hidden payment plan was previously selected, switch to the first available plan.
  useEffect(() => {
    if (
      selectedPlan &&
      paymentPlans.length > 0 &&
      !paymentPlans.some((p) => p.id === selectedPlan)
    ) {
      setSelectedPlan(paymentPlans[0].id);
    }
  }, [paymentPlans, selectedPlan, setSelectedPlan]);

  // Reset split when the user changes their plan or cohort selection.
  useEffect(() => {
    setFirstPaymentSplit(null);
  }, [selectedPlan, selectedCohort]);

  /** Numeric value of the first installment. Used by FirstPaymentModal (3-installments only). */
  const firstInstallmentTotal = useMemo(() => {
    if (selectedPlan !== "3-installments" || !selectedPricing) return 0;
    const breakdown = selectedPricing.display_three_installment_breakdown;
    if (breakdown && breakdown.length >= 1) return breakdown[0];
    return Math.round(selectedPricing.three_installments_amount / 3);
  }, [selectedPlan, selectedPricing]);

  const isBiweekly =
    selectedPlan === "5-installments" || selectedPlan === "6-installments";
  const isWeekly =
    selectedPlan === "8-installments" ||
    selectedPlan === "9-installments" ||
    selectedPlan === "10-installments";

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
    const rawFirstPayment = selectedPlanOption.breakdown?.[0]?.amount ?? null;
    const firstPaymentAmount =
      selectedPlan === "full"
        ? null
        : firstPaymentSplit
          ? `${currency} ${firstPaymentSplit.payNow}`
          : rawFirstPayment;
    const selections: CheckoutSelections = {
      cohort: selectedCohortData,
      planId: selectedPlanOption.id,
      currency,
      pricing: selectedPricing,
      planLabel: selectedPlanOption.label,
      planTotal: selectedPlanOption.total,
      firstPaymentAmount,
      installmentBreakdown: selectedPlanOption.breakdown ?? null,
      splitFirstPayment: firstPaymentSplit ?? null,
    };
    handleProceedWithPersist(selections);
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
            <div className="flex flex-col gap-x-4 gap-y-1 text-sm text-[#6b7280]">
              <span className="text-[#092A31] font-semibold text-base">
                30% discount
              </span>
              <span>Ending soon</span>
            </div>
            <div className="flex flex-col items-baseline gap-2">
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
                  "relative rounded-lg border-2  p-4 text-left transition-colors",
                  isSelected
                    ? "border-[#22c55e] bg-[#f0fdf4]"
                    : "border-transparent bg-[#F8FAFC] hover:bg-[#E8EFF1]",
                )}
              >
                <div className="flex gap-2 items-center mb-1">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      isSelected
                        ? "border-transprent bg-[#C7F5D8] text-primary"
                        : "border-gray-300 bg-white",
                    )}
                    aria-hidden
                  >
                    {isSelected ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "font-clash-display font-semibold",
                      isSelected ? "text-[#092A31]" : "text-[#64748B]",
                    )}
                  >
                    {cohort.name}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-[#64748B]">
                  <div className="mr-2">
                    <FillCalendaSvg />
                  </div>
                  <span
                    className={`py-0.5 px-2 rounded-full ${isSelected ? "bg-[#C7F5D8]" : "bg-[#E8EFF1]"}`}
                  >
                    {cohort.start_date}
                  </span>
                  <span
                    className={`py-0.5 px-2 rounded-full ${isSelected ? "bg-[#C7F5D8]" : "bg-[#E8EFF1]"}`}
                  >
                    {cohort.duration} Month
                  </span>
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
                // variant="outline"
                className="min-w-22 justify-between gap-2 rounded-xl border-[#e5e7eb] bg-[#E8EFF1] px-3 py-2 text-sm font-medium text-[#156374] hover:bg-[#f9fafb] focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            const isWeeklyPlan =
              plan.id === "8-installments" ||
              plan.id === "9-installments" ||
              plan.id === "10-installments";
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "group flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-colors text-[#64748B]",
                  isWeeklyPlan
                    ? isSelected
                      ? "border-[#7C3AED] bg-[#EDE9FE]"
                      : "border-[#DDD6FE] bg-[#F5F3FF] hover:bg-[#EDE9FE]"
                    : isSelected
                      ? "border-[#22c55e] bg-[#f0fdf4]"
                      : "border-transparent bg-[#F8FAFC] hover:bg-[#E8EFF1]",
                )}
              >
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                    isWeeklyPlan
                      ? isSelected
                        ? "border-transparent bg-[#C4B5FD] text-[#7C3AED]"
                        : "border-[#A78BFA] bg-white"
                      : isSelected
                        ? "border-transprent bg-[#C7F5D8] text-primary"
                        : "border-gray-300 bg-white",
                  )}
                  aria-hidden
                >
                  {isSelected ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "font-clash-display font-semibold",
                        isSelected ? "text-[#092A31]" : "text-[#4a5568]",
                      )}
                    >
                      {plan.label}
                    </span>
                    {isWeeklyPlan && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-semibold text-white">
                        ⚡ Special
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm">{plan.description}</p>
                  {plan.breakdown && plan.breakdown.length > 0 && (
                    <div
                      className={cn(
                        "mt-3 grid transition-[grid-template-rows] duration-300 ease-out",
                        isSelected
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr] group-hover:grid-rows-[1fr]",
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="space-y-1 py-2 text-sm">
                          {plan.breakdown.map((row, i) => {
                            const showSplitAfter =
                              isUnique &&
                              plan.id === "3-installments" &&
                              firstPaymentSplit &&
                              i === 0;
                            const displayAmount = showSplitAfter
                              ? `${currency} ${firstPaymentSplit!.payNow}`
                              : row.amount;
                            return (
                              <div key={i}>
                                <div className="flex items-center justify-between gap-x-4 gap-y-0.5">
                                  <div className="flex-1">{row.label}</div>
                                  {row.dueDate != null && (
                                    <div className="ml-1.5 text-left flex-1">
                                      {row.dueDate}
                                    </div>
                                  )}
                                  <div className="font-medium flex-1">
                                    {displayAmount}
                                  </div>
                                </div>
                                {showSplitAfter && (
                                  <div className="mt-1 rounded-lg bg-[#FEFCE8] border border-[#FEF08A] px-3 py-2 space-y-1">
                                    <div className="flex items-center justify-between gap-x-4">
                                      <span className="flex-1 text-[#854d0e]">
                                        Balance of 1st installment
                                      </span>
                                      <span className="font-bold text-[#854d0e]">
                                        {currency} {firstPaymentSplit!.balance}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-x-4">
                                      <span className="text-[#854d0e]">
                                        Deadline
                                      </span>
                                      <span className="rounded-full bg-[#FEF08A] px-2 py-0.5 text-xs font-medium text-[#713F12]">
                                        {firstPaymentSplit!.deadline}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
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
        {isUnique &&
        selectedPlan === "3-installments" &&
        !firstPaymentSplit &&
        !isBiweekly &&
        !isWeekly ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSplitModalOpen(true)}
              disabled={!canProceed}
              className="flex-1 h-12 border-2 border-[#092A31] text-[#092A31] font-medium hover:bg-[#E8EFF1] disabled:opacity-50 disabled:pointer-events-none"
            >
              Edit 1st payment
            </Button>
            <Button
              onClick={handleProceed}
              disabled={!canProceed}
              className="flex-1 bg-primary h-12 font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Proceed
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className="w-full bg-primary h-12 font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            Proceed to Payment
          </Button>
        )}
      </div>

      {selectedCohortData && (
        <FirstPaymentModal
          open={splitModalOpen}
          onOpenChange={setSplitModalOpen}
          firstInstallmentTotal={firstInstallmentTotal}
          currency={currency}
          cohortStartDate={selectedCohortData.start_date}
          onConfirm={(payNow) =>
            setFirstPaymentSplit({
              payNow,
              balance: firstInstallmentTotal - payNow,
              deadline: selectedCohortData.start_date,
            })
          }
        />
      )}
    </main>
  );
};

export default Checkout;
