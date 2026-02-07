"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SideNav, { type PaymentStepId } from "./side-nav";
import Checkout from "./checkout";
import PaymentDetails from "./payment-details";
import Coupon from "./coupon";
import type { InternshipProgram } from "@/types/internship-program";
import type { CheckoutData } from "@/features/payment/use-get-checkout-data";
import type { CheckoutSelections } from "@/types/payment";
import { usePayNow } from "@/features/payment/use-pay-now";
import { DEFAULT_PROMO_CODE } from "./coupon";

const VALID_STEPS: PaymentStepId[] = ["checkout", "personal", "complete-profile"];

function stepFromParam(param: string | null): PaymentStepId {
  return param && VALID_STEPS.includes(param as PaymentStepId)
    ? (param as PaymentStepId)
    : "checkout";
}

interface PaymentMainProps {
  program?: InternshipProgram;
  checkoutData?: CheckoutData;
  /** Payment page [id] for success redirect (so Stripe returns here with session_id) */
  paymentPageId?: string;
}

const PaymentMain = ({ program, checkoutData, paymentPageId }: PaymentMainProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const promoCode = searchParams.get("promo_code") ?? DEFAULT_PROMO_CODE;
  const activeStep = stepFromParam(searchParams.get("step"));
  const [checkoutSelections, setCheckoutSelections] =
    useState<CheckoutSelections | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const setActiveStep = useCallback(
    (value: React.SetStateAction<PaymentStepId>) => {
      const step =
        typeof value === "function" ? value(activeStep) : value;
      const next = new URLSearchParams(searchParams.toString());
      next.set("step", step);
      router.replace(`${pathname}?${next.toString()}`);
    },
    [activeStep, pathname, router, searchParams],
  );

  const { payNow, isProcessingPayment } = usePayNow({
    checkoutData: checkoutData ?? null,
    checkoutSelections,
    slug: program?.slug,
    paymentPageId,
    promoCode,
    promoApplied: !!searchParams.get("promo_code"),
    onError: (message) => setPaymentError(message),
    onSuccess: (checkoutUrl) => {
      setPaymentError(null);
      if (typeof window !== "undefined") {
        window.location.href = checkoutUrl;
      }
    },
  });

  const handlePayNow = () => {
    setPaymentError(null);
    payNow();
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <SideNav activeStep={activeStep} onStepChange={setActiveStep} />

      {/* Right content – render based on active step */}
      <div>
        {activeStep === "checkout" && (
          <Checkout
            checkoutData={checkoutData}
            program={program}
            setActiveStep={setActiveStep}
            onProceed={setCheckoutSelections}
          />
        )}
        {activeStep === "personal" && (
          <PaymentDetails
            checkoutSelections={checkoutSelections}
            onProceed={handlePayNow}
            isProcessingPayment={isProcessingPayment}
            paymentError={paymentError}
          />
        )}
      </div>
      <Coupon />
    </div>
  );
};

export default PaymentMain;
