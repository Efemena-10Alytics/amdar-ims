import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import type {
  CheckoutCohort,
  CheckoutData,
  CheckoutPricing,
  CheckoutSelections,
} from "@/types/payment";

/** API response for POST /payment/payment-plans */
interface PaymentPlanResponse {
  success: boolean;
  message?: string;
  data?: {
    checkout_session?: { url?: string };
    [key: string]: unknown;
  };
}

/** Extract a user-facing error message from API error response */
function extractErrorMessage(
  data: unknown
): string {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (obj.errors && typeof obj.errors === "object") {
      const errs = obj.errors as Record<string, unknown>;
      const first = Object.values(errs)[0];
      if (Array.isArray(first) && first[0]) return String(first[0]);
      if (typeof first === "string") return first;
    }
  }
  return "Something went wrong. Please try again.";
}

export interface UsePayNowParams {
  /** Checkout data from API (program, pricings, cohorts) */
  checkoutData: CheckoutData | null | undefined;
  /** User's current selections (cohort, plan, pricing). Required to pay. */
  checkoutSelections: CheckoutSelections | null | undefined;
  /** Program slug for success/cancel URLs */
  slug: string | undefined;
  /** Payment page [id] (e.g. program slug/id). When set, success redirects here with ?status=success for session verification. */
  paymentPageId?: string | undefined;
  /** Optional custom next payment date (for installments) */
  nextPaymentDate?: Date | null;
  /** If true, success URL goes to complete-your-profile with u-status=new */
  newUser?: boolean;
  /** Promo code to send (e.g. from URL or input) */
  promoCode?: string | null;
  /** Whether a promo is applied (if false, may send 'default' or omit) */
  promoApplied?: boolean;
  /** Called when payment session is created (e.g. redirect to checkout URL) */
  onSuccess?: (checkoutUrl: string) => void;
  /** Called with message when an error occurs (e.g. toast.error) */
  onError?: (message: string) => void;
  /** Optional custom check before allowing pay (e.g. form valid) */
  isPayNowEnabled?: () => boolean;
}

export function usePayNow({
  checkoutData,
  checkoutSelections,
  slug,
  paymentPageId,
  nextPaymentDate = null,
  newUser = false,
  promoCode = null,
  promoApplied = false,
  onSuccess,
  onError,
  isPayNowEnabled = () => true,
}: UsePayNowParams) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const payNow = useCallback(async () => {
    if (!isPayNowEnabled()) return;

    const cohort = checkoutSelections?.cohort;
    const pricing = checkoutSelections?.pricing;
    const planId = checkoutSelections?.planId;

    if (!checkoutData?.program || !cohort || !pricing || !planId || !slug) {
      onError?.("Please select a cohort and payment plan.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Use original amounts from API for payment-plans
      let originalTotalAmount: number;
      let originalNextPaymentAmount = 0;
      let installments = 1;

      if (planId === "full") {
        originalTotalAmount = Number(pricing.amount);
        installments = 1;
        originalNextPaymentAmount = 0;
      } else if (planId === "2-installments") {
        originalTotalAmount = Number(pricing.original_two_installments_amount);
        installments = 2;
        originalNextPaymentAmount = Number(pricing.two_installments_amount) / 2;
      } else {
        // 3-installments
        originalTotalAmount = Number(pricing.original_three_installments_amount);
        installments = 3;
        originalNextPaymentAmount =
          Number(pricing.three_installments_amount) / 3;
      }

      const formattedNextPaymentAmount =
        Math.round(originalNextPaymentAmount * 100) / 100;

      // Next payment date for API
      let apiNextPaymentDate: string | null = null;

      if (nextPaymentDate) {
        apiNextPaymentDate = nextPaymentDate.toISOString().split("T")[0];
      } else {
        const today = new Date();
        const oneMonthFromToday = new Date(today);
        oneMonthFromToday.setMonth(oneMonthFromToday.getMonth() + 1);
        apiNextPaymentDate = oneMonthFromToday.toISOString().split("T")[0];
      }

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const paymentData = {
        program_id: checkoutData.program.id,
        cohort_id: cohort.id,
        installments,
        next_payment_amount:
          planId === "full" ? 0.0 : formattedNextPaymentAmount,
        total_amount: originalTotalAmount,
        currency: checkoutSelections.currency,
        success_url: newUser
          ? `${origin}/complete-your-profile?program=${slug}&u-status=new`
          : paymentPageId
            ? `${origin}/payment/${paymentPageId}?status=success`
            : `${origin}/internship/${slug}/apply/payment-checkout?tab=3&status=success`,
        cancel_url: `${origin}/internship/${slug}/apply/payment-checkout?tab=3&status=cancelled${newUser ? "&u-status=new" : ""}`,
        next_payment_date: apiNextPaymentDate,
        promo_code: promoApplied && promoCode ? promoCode : "default",
      };

      const response = await axiosInstance.post<PaymentPlanResponse>(
        "/payment/payment-plans/demo",
        paymentData
      );

      const data = response.data;

      if (data?.success && data?.data?.checkout_session?.url) {
        const checkoutUrl = data.data.checkout_session.url;
        if (onSuccess) {
          onSuccess(checkoutUrl);
        } else if (typeof window !== "undefined") {
          window.location.href = checkoutUrl;
        }
      } else {
        const message =
          (data && typeof data === "object" && typeof (data as { message?: string }).message === "string")
            ? (data as { message: string }).message
            : extractErrorMessage(data ?? {});
        onError?.(message);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      if (err.response?.data) {
        onError?.(extractErrorMessage(err.response.data));
      } else if (err.response?.status === 401) {
        onError?.("Please log in to continue with payment.");
      } else if (err.response?.status === 500) {
        onError?.("Server error occurred. Please try again or contact support.");
      } else {
        onError?.("Payment failed. Please try again.");
      }
    } finally {
      setIsProcessingPayment(false);
    }
  }, [
    checkoutData,
    checkoutSelections,
    slug,
    paymentPageId,
    nextPaymentDate,
    newUser,
    promoCode,
    promoApplied,
    onSuccess,
    onError,
    isPayNowEnabled,
  ]);

  return { payNow, isProcessingPayment };
}
