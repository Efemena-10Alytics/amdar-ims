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

const VALID_STEPS: PaymentStepId[] = [
  "checkout",
  "personal",
  "complete-profile",
];

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

const PaymentMain = ({
  program,
  checkoutData,
  paymentPageId,
}: PaymentMainProps) => {
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
  const [successModalDismissed, setSuccessModalDismissed] = useState(false);
  const [profileJustCompleted, setProfileJustCompleted] = useState(false);
  const showSuccessModal = profileJustCompleted && !successModalDismissed;
  const [checkoutSelections, setCheckoutSelections] =
    useCheckoutSelectionsStorage(program?.id);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [nextPaymentDateYmd, setNextPaymentDateYmd] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(11);
    return d.toISOString().slice(0, 10);
  });

  console.log("checkoutData", checkoutData);

  // When returning from Stripe with success: move to complete-profile step and clean URL (do not show modal yet)
  useEffect(() => {
    if (!statusSuccess) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("step", "complete-profile");
    next.delete("status");
    next.delete("session_id");
    router.replace(`${pathname}?${next.toString()}`);
  }, [statusSuccess, pathname, router, searchParams]);

  const handleProfileComplete = useCallback(() => {
    setProfileJustCompleted(true);
    setSuccessModalDismissed(false);
  }, []);

  const handleSuccessModalOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSuccessModalDismissed(true);
      setProfileJustCompleted(false);
    }
  }, []);

  const setActiveStep = useCallback(
    (value: React.SetStateAction<PaymentStepId>) => {
      const step = typeof value === "function" ? value(activeStep) : value;
      const next = new URLSearchParams(searchParams.toString());
      next.set("step", step);
      router.replace(`${pathname}?${next.toString()}`);
    },
    [activeStep, pathname, router, searchParams],
  );

  const isInstallmentPlan =
    checkoutSelections?.planId && checkoutSelections.planId !== "full";
  const nextPaymentDateForApi =
    isInstallmentPlan && nextPaymentDateYmd
      ? new Date(nextPaymentDateYmd + "T12:00:00")
      : null;

  const { payNow, isProcessingPayment } = usePayNow({
    checkoutData: checkoutData ?? null,
    checkoutSelections,
    slug: program?.slug,
    paymentPageId,
    nextPaymentDate: nextPaymentDateForApi,
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
            nextPaymentDateYmd={nextPaymentDateYmd}
            onNextPaymentDateChange={setNextPaymentDateYmd}
            onProceed={handlePayNow}
            isProcessingPayment={isProcessingPayment}
            paymentError={paymentError}
            discount={
              checkoutData?.promo_code_data?.discount_percentage as string
            }
          />
        )}
        {activeStep === "complete-profile" && (
          <CompleteProfile
            programTitle={program?.title}
            onProfileComplete={handleProfileComplete}
          />
        )}
      </div>
      {activeStep !== "complete-profile" && (
        <Coupon
          discount={
            checkoutData?.promo_code_data?.discount_percentage as string
          }
        />
      )}

      <PaymentSuccessModal
        open={showSuccessModal}
        onOpenChange={handleSuccessModalOpenChange}
        programSlug={program?.slug}
        sessionId={null}
        profileCompleted={profileJustCompleted}
        setActiveStep={setActiveStep}
      />
    </div>
  );
};

export default PaymentMain;
