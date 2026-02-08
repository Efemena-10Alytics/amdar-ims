import { useCallback, useEffect, useRef, useState } from "react";
import type { CheckoutSelections } from "@/types/payment";

const CHECKOUT_FORM_STORAGE_KEY = "payment_checkout_form";
const CHECKOUT_SELECTIONS_STORAGE_KEY = "payment_checkout_selections";

export type PaymentPlanId = "full" | "2-installments" | "3-installments";

export type StoredCheckoutForm = {
  selectedCohort: number | null;
  selectedPlan: PaymentPlanId | null;
  currency: string;
};

function getCheckoutFormKey(programId: number | undefined): string {
  return `${CHECKOUT_FORM_STORAGE_KEY}_${programId ?? "unknown"}`;
}

function getCheckoutSelectionsKey(programId: number | undefined): string {
  return `${CHECKOUT_SELECTIONS_STORAGE_KEY}_${programId ?? "unknown"}`;
}

function getStoredCheckoutSelections(
  programId: number | undefined,
): CheckoutSelections | null {
  if (typeof window === "undefined" || programId == null) return null;
  try {
    const raw = sessionStorage.getItem(getCheckoutSelectionsKey(programId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CheckoutSelections;
    if (
      parsed &&
      typeof parsed.cohort === "object" &&
      typeof parsed.planId === "string" &&
      typeof parsed.currency === "string" &&
      typeof parsed.pricing === "object"
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

/** Checkout data shape needed for validating restored form (cohorts + currencies). */
export interface CheckoutFormValidationData {
  upcoming_cohorts?: { id: number }[];
  pricings?: { currency: string }[];
}

/**
 * Persists and hydrates checkout selections (full payload) for the payment flow.
 * Use in the parent payment component so selections survive refresh and are available on personal step.
 */
export function useCheckoutSelectionsStorage(programId: number | undefined) {
  const [checkoutSelections, setCheckoutSelectionsState] = useState<
    CheckoutSelections | null
  >(() => getStoredCheckoutSelections(programId));

  useEffect(() => {
    if (programId != null && checkoutSelections == null) {
      const stored = getStoredCheckoutSelections(programId);
      if (stored) setCheckoutSelectionsState(stored);
    }
  }, [programId]);

  const setCheckoutSelections = useCallback(
    (value: CheckoutSelections | null) => {
      setCheckoutSelectionsState(value);
      if (typeof window !== "undefined" && programId != null) {
        try {
          if (value == null) {
            sessionStorage.removeItem(getCheckoutSelectionsKey(programId));
          } else {
            sessionStorage.setItem(
              getCheckoutSelectionsKey(programId),
              JSON.stringify(value),
            );
          }
        } catch {
          // ignore quota etc.
        }
      }
    },
    [programId],
  );

  return [checkoutSelections, setCheckoutSelections] as const;
}

/**
 * Persists and hydrates checkout form state (cohort, plan, currency).
 * Restores once from sessionStorage when programId and checkoutData are available; persists on every change.
 * persistSelections() writes the full selections to storage when user proceeds.
 */
export function useCheckoutFormStorage(
  programId: number | undefined,
  checkoutData: CheckoutFormValidationData | null | undefined,
  firstCurrency: string,
) {
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId | null>(null);
  const [currency, setCurrency] = useState<string>(firstCurrency);
  const hasRestoredForm = useRef(false);

  // Restore form from sessionStorage once when we have checkoutData and programId
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      programId == null ||
      !checkoutData ||
      hasRestoredForm.current
    )
      return;
    hasRestoredForm.current = true;
    try {
      const key = getCheckoutFormKey(programId);
      const raw = sessionStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredCheckoutForm;
      const cohortIds =
        checkoutData.upcoming_cohorts?.map((c) => c.id) ?? [];
      const currencies = checkoutData.pricings?.map((p) => p.currency) ?? [];
      if (
        (parsed.selectedCohort == null ||
          cohortIds.includes(parsed.selectedCohort)) &&
        (parsed.selectedPlan == null ||
          ["full", "2-installments", "3-installments"].includes(
            parsed.selectedPlan,
          )) &&
        (parsed.currency ? currencies.includes(parsed.currency) : true)
      ) {
        if (parsed.selectedCohort != null)
          setSelectedCohort(parsed.selectedCohort);
        if (parsed.selectedPlan != null)
          setSelectedPlan(parsed.selectedPlan);
        if (parsed.currency) setCurrency(parsed.currency);
      }
    } catch {
      // ignore invalid stored data
    }
  }, [programId, checkoutData]);

  // Persist form to sessionStorage when selections change
  useEffect(() => {
    if (typeof window === "undefined" || programId == null) return;
    sessionStorage.setItem(
      getCheckoutFormKey(programId),
      JSON.stringify({
        selectedCohort,
        selectedPlan,
        currency,
      } satisfies StoredCheckoutForm),
    );
  }, [programId, selectedCohort, selectedPlan, currency]);

  const persistSelections = useCallback(
    (selections: CheckoutSelections) => {
      if (typeof window !== "undefined" && programId != null) {
        try {
          sessionStorage.setItem(
            getCheckoutSelectionsKey(programId),
            JSON.stringify(selections),
          );
        } catch {
          // ignore
        }
      }
    },
    [programId],
  );

  return {
    selectedCohort,
    setSelectedCohort,
    selectedPlan,
    setSelectedPlan,
    currency,
    setCurrency,
    persistSelections,
  };
}
