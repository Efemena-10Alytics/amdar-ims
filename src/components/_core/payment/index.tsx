"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SideNav, { type PaymentStepId } from "./side-nav";
import Checkout from "./checkout";
import PaymentDetails from "./payment-details";
import CompleteProfile from "./complete-profile";
import Coupon from "./coupon";
import type { InternshipProgram } from "@/types/internship-program";
import type { CheckoutData } from "@/features/payment/use-get-checkout-data";
import type { CheckoutSelections } from "@/types/payment";
import { usePayNow } from "@/features/payment/use-pay-now";
import { useCheckoutSelectionsStorage } from "@/features/payment/use-checkout-storage";
import { DEFAULT_PROMO_CODE } from "./coupon";
import { PaymentSuccessModal } from "./payment-success-modal";

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
  const statusParam = searchParams.get("status") ?? "";
  const statusSuccess =
    statusParam === "success" ||
    statusParam === "sucess" ||
    (typeof window !== "undefined" &&
      (window.location.search.includes("status=success") ||
        window.location.search.includes("status=sucess")));
  const sessionId = searchParams.get("session_id") ?? null;
  const [successModalDismissed, setSuccessModalDismissed] = useState(false);
  const showSuccessModal = statusSuccess && !successModalDismissed;
  const [checkoutSelections, setCheckoutSelections] =
    useCheckoutSelectionsStorage(program?.id);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Reset dismissed state when URL has status=success again (e.g. return from Stripe)
  useEffect(() => {
    if (statusSuccess) setSuccessModalDismissed(false);
  }, [statusSuccess]);

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
    <div className="flex flex-col gap-8 lg:flex-row">
      <SideNav activeStep={activeStep} onStepChange={setActiveStep} />

      {/* Right content – render based on active step */}
      <div className="min-w-0 flex-1 w-full">
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
        {activeStep === "complete-profile" && (
            <CompleteProfile programTitle={program?.title} />
          )}
      </div>
      {activeStep !== "complete-profile" && <Coupon />}

      <PaymentSuccessModal
        open={showSuccessModal}
        onOpenChange={(open) => {
          if (!open) {
            setSuccessModalDismissed(true);
            const next = new URLSearchParams(searchParams.toString());
            next.delete("status");
            next.delete("session_id");
            next.set("step", "complete-profile");
            router.replace(`${pathname}?${next.toString()}`);
          }
        }}
        programSlug={program?.slug}
        sessionId={sessionId}
        setActiveStep={setActiveStep}
      />
    </div>
  );
};

export default PaymentMain;
