"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useCountries } from "@/features/portfolio/use-countries";
import type { CheckoutSelections } from "@/types/payment";
import {
  INTERNSHIP_FALLBACK_PLAN_TOTAL,
  INTERNSHIP_FALLBACK_FIRST_PAYMENT,
} from "@/constants/internship-pricing";
import { ChangeDate } from "./change-date";
import {
  EditUserData,
  getCountryCodeForCountry,
  stripCountryCodeFromPhone,
  type PersonalDataForm,
} from "./edit-user-data";
import { TermsConditionDialog } from "./terms-condition-dialog";

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

/** Get date N months from today as YYYY-MM-DD. Optional dayOfMonth (1–31) for fixed day. */
function formatDateToLocalYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Get date N months from today as YYYY-MM-DD. Optional dayOfMonth (1–31) for fixed day. */
function getNextPaymentDateYmd(
  monthsFromNow: number,
  dayOfMonth?: number,
): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  if (dayOfMonth != null) {
    d.setDate(dayOfMonth);
  }
  return formatDateToLocalYmd(d);
}

function getIntervalDays(planId: string | undefined): number {
  if (planId === "8-installments" || planId === "9-installments" || planId === "10-installments") return 7;
  if (planId === "5-installments" || planId === "6-installments") return 14;
  return 30;
}

function getTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getDefaultNextPaymentDateYmd(planId: string | undefined, cohortStartDate?: string): string {
  const tomorrow = getTomorrow();
  if (cohortStartDate) {
    const cohortStart = new Date(cohortStartDate + "T00:00:00");
    const minDate = cohortStart >= tomorrow ? cohortStart : tomorrow;
    return formatDateToLocalYmd(minDate);
  }
  const intervalDays = getIntervalDays(planId);
  const d = new Date();
  d.setDate(d.getDate() + intervalDays);
  return formatDateToLocalYmd(d);
}

function getNextPaymentWindow(
  planId: string | undefined,
  cohortStartDate: string | undefined,
): { minDate: string; maxDate: string } | undefined {
  if (!cohortStartDate || planId === "full" || planId == null) return undefined;
  const intervalDays = getIntervalDays(planId);
  const tomorrow = getTomorrow();
  const cohortStart = new Date(cohortStartDate + "T00:00:00");
  const fallbackMinDate = cohortStart >= tomorrow ? cohortStart : tomorrow;
  const fallbackMaxDate = new Date(cohortStart);
  fallbackMaxDate.setDate(fallbackMaxDate.getDate() + intervalDays);

  const isWeeklyPlan =
    planId === "8-installments" ||
    planId === "9-installments" ||
    planId === "10-installments";

  if (isWeeklyPlan) {
    // First payment happens today (at checkout), so the earliest selectable date is 7 days from today.
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    minDate.setDate(minDate.getDate() + 7);
    const maxDate = new Date(cohortStart);
    maxDate.setDate(maxDate.getDate() + 7);

    if (minDate <= maxDate) {
      return {
        minDate: formatDateToLocalYmd(minDate),
        maxDate: formatDateToLocalYmd(maxDate),
      };
    }
    // Invalid range (cohort already started a while ago) — fall back to the cohort-based window.
  }

  return {
    minDate: formatDateToLocalYmd(fallbackMinDate),
    maxDate: formatDateToLocalYmd(fallbackMaxDate),
  };
}

/** Format YYYY-MM-DD for display. */
function formatYmdToDisplay(ymd: string): string {
  const d = new Date(ymd + "T12:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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
    if (key === "phoneNumber" && raw != null && typeof raw === "string") {
      const location =
        (user.location as string) ?? (user.country as string) ?? "";
      const countryCode = getCountryCodeForCountry(location);
      raw = stripCountryCodeFromPhone(raw, countryCode);
    }
    const value = raw != null && typeof raw === "string" ? raw : "—";
    return { label, value, ...(withFlag && { withFlag }) };
  });
}

interface PaymentDetailsProps {
  checkoutSelections?: CheckoutSelections | null;
  /** Controlled next payment date (YYYY-MM-DD). When provided, used for payload and Change date. */
  nextPaymentDateYmd?: string;
  /** Called when user changes the next payment date. */
  onNextPaymentDateChange?: (ymd: string) => void;
  onProceed?: () => void;
  isProcessingPayment?: boolean;
  paymentError?: string | null;
  discount?: string;
}

const PaymentDetails = ({
  checkoutSelections,
  nextPaymentDateYmd: nextPaymentDateYmdProp,
  onNextPaymentDateChange,
  onProceed,
  isProcessingPayment = false,
  paymentError = null,
  discount,
}: PaymentDetailsProps) => {
  const [confirmInfo, setConfirmInfo] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [editDataOpen, setEditDataOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const cohortStartDate = checkoutSelections?.cohort?.start_date;

  const [localNextPaymentDateYmd, setLocalNextPaymentDateYmd] = useState(() =>
    getDefaultNextPaymentDateYmd(checkoutSelections?.planId, cohortStartDate),
  );

  useEffect(() => {
    setLocalNextPaymentDateYmd(
      getDefaultNextPaymentDateYmd(checkoutSelections?.planId, cohortStartDate),
    );
  }, [checkoutSelections?.planId, cohortStartDate]);

  const nextPaymentDateYmd = nextPaymentDateYmdProp ?? localNextPaymentDateYmd;
  const setNextPaymentDateYmd =
    onNextPaymentDateChange ?? setLocalNextPaymentDateYmd;

  const nextPaymentWindow = getNextPaymentWindow(
    checkoutSelections?.planId,
    cohortStartDate,
  );

  const isInstallmentPlan =
    checkoutSelections?.planId && checkoutSelections.planId !== "full";
  const { user } = useAuthStore();
  const { data: countries = [] } = useCountries();
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

  const userLocation = useMemo(() => {
    if (!profile) return "";
    return (
      ((profile.location as string) || (profile.country as string)) ?? ""
    ).trim();
  }, [profile]);

  const locationCountry = useMemo(() => {
    if (!userLocation || countries.length === 0) return undefined;

    const normalizedLocation = userLocation.trim().toLowerCase();
    return countries.find(
      (country) => country.name.trim().toLowerCase() === normalizedLocation,
    );
  }, [countries, userLocation]);

  const editInitialData = useMemo((): Partial<PersonalDataForm> | null => {
    if (!profile) return null;
    const firstName = (profile.firstName as string) ?? "";
    const lastName = (profile.lastName as string) ?? "";
    const email = (profile.email as string) ?? "";
    const location =
      ((profile.location as string) || (profile.country as string)) ?? "";
    const countryCode = getCountryCodeForCountry(location);
    const rawPhone = (profile.phoneNumber as string) ?? "";
    const phone = stripCountryCodeFromPhone(rawPhone, countryCode);
    return {
      firstName,
      lastName,
      email,
      location,
      countryCode,
      phone,
    };
  }, [profile]);

  const { originalPlanTotal, originalAmounts } = useMemo(() => {
    const pricing = checkoutSelections?.pricing;
    const planId = checkoutSelections?.planId;
    if (!pricing || !planId) {
      return {
        originalPlanTotal: undefined,
        originalAmounts: [] as (string | undefined)[],
      };
    }
    const { currency } = pricing;
    if (planId === "full") {
      const orig = pricing.original_amount;
      return {
        originalPlanTotal: orig != null ? `${currency} ${orig}` : undefined,
        originalAmounts: [],
      };
    }
    if (planId === "2-installments") {
      const orig = pricing.original_two_installments_amount;
      const half = orig != null ? Math.round(orig / 2) : undefined;
      const amountStr = half != null ? `${currency} ${half}` : undefined;
      return {
        originalPlanTotal: orig != null ? `${currency} ${orig}` : undefined,
        originalAmounts: [amountStr, amountStr],
      };
    }
    if (planId === "3-installments") {
      const orig = pricing.original_three_installments_amount;
      if (orig == null) {
        return { originalPlanTotal: undefined, originalAmounts: [] };
      }
      const third = Math.round(orig / 3);
      const third2 = Math.round(orig / 3);
      const third3 = orig - third - third2;
      const amountStr = (n: number) => `${currency} ${n}`;
      return {
        originalPlanTotal: `${currency} ${orig}`,
        originalAmounts: [
          amountStr(third),
          amountStr(third2),
          amountStr(third3),
        ],
      };
    }
    if (planId === "5-installments") {
      const orig = pricing.original_five_installments_amount ?? pricing.five_installments_amount;
      if (orig == null) return { originalPlanTotal: undefined, originalAmounts: [] };
      const base = Math.round(orig / 5);
      const amountStr = (n: number) => `${currency} ${n}`;
      return {
        originalPlanTotal: `${currency} ${orig}`,
        originalAmounts: Array.from({ length: 5 }, (_, i) =>
          amountStr(i === 4 ? orig - base * 4 : base),
        ),
      };
    }
    if (planId === "6-installments") {
      const orig = pricing.original_six_installments_amount ?? pricing.six_installments_amount;
      if (orig == null) return { originalPlanTotal: undefined, originalAmounts: [] };
      const base = Math.round(orig / 6);
      const amountStr = (n: number) => `${currency} ${n}`;
      return {
        originalPlanTotal: `${currency} ${orig}`,
        originalAmounts: Array.from({ length: 6 }, (_, i) =>
          amountStr(i === 5 ? orig - base * 5 : base),
        ),
      };
    }
    if (planId === "8-installments") {
      const orig = pricing.original_eight_installments_amount ?? pricing.eight_installments_amount;
      if (orig == null) return { originalPlanTotal: undefined, originalAmounts: [] };
      const base = Math.round(orig / 8);
      const amountStr = (n: number) => `${currency} ${n}`;
      return {
        originalPlanTotal: `${currency} ${orig}`,
        originalAmounts: Array.from({ length: 8 }, (_, i) =>
          amountStr(i === 7 ? orig - base * 7 : base),
        ),
      };
    }
    if (planId === "9-installments") {
      const orig = pricing.original_nine_installments_amount ?? pricing.nine_installments_amount;
      if (orig == null) return { originalPlanTotal: undefined, originalAmounts: [] };
      const base = Math.round(orig / 9);
      const amountStr = (n: number) => `${currency} ${n}`;
      return {
        originalPlanTotal: `${currency} ${orig}`,
        originalAmounts: Array.from({ length: 9 }, (_, i) =>
          amountStr(i === 8 ? orig - base * 8 : base),
        ),
      };
    }
    if (planId === "10-installments") {
      const orig = pricing.original_ten_installments_amount ?? pricing.ten_installments_amount;
      if (orig == null) return { originalPlanTotal: undefined, originalAmounts: [] };
      const base = Math.round(orig / 10);
      const amountStr = (n: number) => `${currency} ${n}`;
      return {
        originalPlanTotal: `${currency} ${orig}`,
        originalAmounts: Array.from({ length: 10 }, (_, i) =>
          amountStr(i === 9 ? orig - base * 9 : base),
        ),
      };
    }
    return { originalPlanTotal: undefined, originalAmounts: [] };
  }, [checkoutSelections?.pricing, checkoutSelections?.planId]);

  return (
    <div className="flex flex-1 flex-col w-full min-w-0 max-w-3xl">
      {/* Left column */}
      <div className="flex-1 w-full space-y-8 lg:pb-24">
        {/* Personal data */}
        <section>
          <div className="flex items-center gap-4 justify-between">
            <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
              Personal data
            </h2>
            <Button
              onClick={() => setEditDataOpen(true)}
              variant={"outline"}
              className="border-2 text-primary border-primary"
            >
              Edit Data
            </Button>
          </div>
          <dl className="mt-4 space-y-3 sm:gap-x-6 bg-[#F8FAFC] p-5 rounded-xl">
            {personalData.map(({ label, value, withFlag }) => (
              <div key={label}>
                <div className="flex items-center justify-between gap-2 text-right text-sm font-medium text-[#092A31]">
                  <div className="text-sm text-[#6b7280]">{label}</div>
                  <div className="flex gap-2 text-[#092A31]">
                    {withFlag && locationCountry?.flag ? (
                      <Image
                        src={locationCountry.flag}
                        alt=""
                        width={20}
                        height={14}
                        className="shrink-0 rounded object-cover"
                        unoptimized
                      />
                    ) : null}
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
              </div>
              <p className="mt-1 flex items-center gap-2 font-medium text-[#092A31]">
                {checkoutSelections?.cohort?.name ?? "February Cohort"}
                <span className="inline-flex rounded-full bg-[#d1fae5] px-2.5 py-0.5 text-xs font-medium text-[##092A31]">
                  {checkoutSelections?.cohort?.start_date ?? "February 7, 2026"}
                </span>
              </p>
            </div>
            <div className="pt-1 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6b7280]">Plan selected</p>
                <p className="mt-1 font-medium text-[#092A31]">
                  {checkoutSelections?.planLabel ?? "Full payment"}
                </p>
              </div>
              {checkoutSelections?.installmentBreakdown &&
                checkoutSelections.installmentBreakdown.length > 0 ? (
                <div className="space-y-2 border-[#B6CFD4]/50">
                  {checkoutSelections.installmentBreakdown.map((item, i) => {
                    const split = checkoutSelections.splitFirstPayment;
                    const showSplitAfter = split && i === 0;
                    const displayAmount =
                      showSplitAfter
                        ? `${checkoutSelections.currency} ${split!.payNow}`
                        : item.amount;
                    const labelMap: Record<string, string> = {
                      "1st payment": "First payment",
                      "2nd payment": "Second payment",
                      "3rd payment": "Third payment",
                    };
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm pt-2">
                          <span className="text-[#6b7280]">
                            {labelMap[item.label] ?? item.label}
                          </span>
                          <span className="flex items-center gap-2 font-medium text-[#092A31]">
                            {!showSplitAfter && originalAmounts[i] != null && (
                              <span className="text-[#9ca3af] line-through text-xs">
                                {originalAmounts[i]}
                              </span>
                            )}
                            {displayAmount}
                          </span>
                        </div>
                        {showSplitAfter && (
                          <div className="mt-2 rounded-lg bg-[#FEFCE8] border border-[#FEF08A] px-3 py-2 space-y-1 text-sm">
                            <div className="flex items-center justify-between gap-x-4">
                              <span className="text-[#854d0e]">Balance of 1st installment</span>
                              <span className="font-bold text-[#854d0e]">
                                {checkoutSelections.currency} {split!.balance}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-x-4">
                              <span className="text-[#854d0e]">Deadline</span>
                              <span className="rounded-full bg-[#FEF08A] px-2 py-0.5 text-xs font-medium text-[#713F12]">
                                {split!.deadline}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : checkoutSelections?.planTotal ? (
                <div className="mt-3 flex justify-between text-sm border-t border-[#B6CFD4]/50 pt-3">
                  <span className="text-[#6b7280]">Payment</span>
                  <span className="flex items-center gap-2 font-medium text-[#092A31]">
                    {originalPlanTotal != null && (
                      <span className="text-[#9ca3af] line-through text-sm">
                        {originalPlanTotal}
                      </span>
                    )}
                    {checkoutSelections.planTotal}
                  </span>
                </div>
              ) : null}
              {isInstallmentPlan && (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-[#6b7280]">Next payment date</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#092A31]">
                        {formatYmdToDisplay(nextPaymentDateYmd)}
                      </span>
                      <ChangeDate
                        value={nextPaymentDateYmd}
                        onChange={setNextPaymentDateYmd}
                        minDate={nextPaymentWindow?.minDate}
                        maxDate={nextPaymentWindow?.maxDate}
                      />
                    </div>
                  </div>
                </div>
              )}
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
                {originalPlanTotal ??
                  checkoutSelections?.planTotal ??
                  INTERNSHIP_FALLBACK_PLAN_TOTAL}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Discounted Fee</span>
              {/* <span className="text-[#6b7280]">Coupon (Discount)</span> */}
              {/* <span className="font-medium text-[#092A31]">{discount}%</span> */}
              <span className="font-medium text-[#092A31]">
                {checkoutSelections && checkoutSelections.planTotal}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="font-medium text-[#092A31]">First payment</span>
              <span className="font-clash-display font-bold text-primary">
                {checkoutSelections
                  ? (checkoutSelections.firstPaymentAmount ??
                    checkoutSelections.planTotal)
                  : INTERNSHIP_FALLBACK_FIRST_PAYMENT}
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
              <button
                type="button"
                onClick={() => setTermsDialogOpen(true)}
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/90"
              >
                Amdari Terms & Conditions
              </button>
              {" "} and I agree.
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

      <EditUserData
        open={editDataOpen}
        onOpenChange={setEditDataOpen}
        initialData={editInitialData}
      />
      <TermsConditionDialog
        open={termsDialogOpen}
        onOpenChange={setTermsDialogOpen}
        onAgree={() => setConfirmTerms(true)}
        onDecline={() => setConfirmTerms(false)}
      />
    </div>
  );
};

export default PaymentDetails;
