"use client";

import React, { useState } from "react";
import { Check, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const COHORTS = [
  {
    id: "feb",
    label: "February Cohort",
    date: "February 7, 2026",
    months: "4 months",
  },
  {
    id: "mar",
    label: "March Cohort",
    date: "March 7, 2026",
    months: "4 months",
  },
];

const PAYMENT_PLANS = [
  {
    id: "full",
    label: "Full Payment",
    description: "Make one time payment now and get full access to your course",
    total: "USD 390",
    breakdown: null,
  },
  {
    id: "2-installments",
    label: "2 Installments",
    description: "Pay GBP 195 now and 2nd installment in the next month",
    total: "USD 390",
    breakdown: [
      { label: "1st payment", date: "Jan 21, 2026", amount: "USD 195" },
      { label: "2nd payment", date: "Feb 21, 2026", amount: "USD 195" },
    ],
  },
  {
    id: "3-installments",
    label: "3 installments",
    description: "Pay GBP 130 monthly for 3 months",
    total: "USD 390",
    breakdown: null,
  },
];

const CURRENCIES = ["USD", "GBP", "EUR", "CAD"] as const;

const Checkout = () => {
  const [selectedCohort, setSelectedCohort] = useState<string>("feb");
  const [selectedPlan, setSelectedPlan] = useState<string>("2-installments");
  const [currency, setCurrency] = useState<string>("USD");

  return (
    <main className="lg:max-w-2xl flex-1 space-y-10 pb-24">
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
            Cybersecurity
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#4a5568]">
            Protect systems, analyze threats, investigate incidents, run
            assessments, and apply industry frameworks used by modern security
            teams.
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b7280]">
              <span>30% discount</span>
              <span>Ending soon</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-[#9ca3af] line-through">
                USD 500
              </span>
              <span className="font-clash-display text-xl font-bold text-primary">
                USD 390
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
          {COHORTS.map((cohort) => {
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
                <span
                  className={cn(
                    "absolute left-4 top-4 flex h-5 w-5 items-center justify-center rounded border",
                    isSelected
                      ? "border-[#22c55e] bg-[#22c55e] text-white"
                      : "border-[#d1d5db] bg-white",
                  )}
                >
                  {isSelected && (
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  )}
                </span>
                <div className="pl-8">
                  <span
                    className={cn(
                      "font-clash-display font-semibold",
                      isSelected ? "text-[#092A31]" : "text-[#4a5568]",
                    )}
                  >
                    {cohort.label}
                  </span>
                  <div className="mt-2 flex items-center gap-2 text-sm text-[#6b7280]">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>{cohort.date}</span>
                    <span>·</span>
                    <span>{cohort.months}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Payment options */}
      <section>
        <div className="flex flex-wrap items-start justify-between gap-4">
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
                {CURRENCIES.map((code) => (
                  <DropdownMenuRadioItem key={code} value={code}>
                    {code}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 space-y-3">
          {PAYMENT_PLANS.map((plan) => {
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
                  {plan.breakdown && (
                    <div className="mt-3 space-y-1 rounded-lg bg-white/60 py-2 pl-3 pr-4 text-sm text-[#6b7280]">
                      {plan.breakdown.map((row, i) => (
                        <div key={i} className="flex justify-between gap-4">
                          <span>{row.label}</span>
                          <span>{row.date}</span>
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
        <Button className="w-full bg-primary h-12 font-medium text-white hover:bg-primary/90">
          Proceed to Payment
        </Button>
      </div>
    </main>
  );
};

export default Checkout;
