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
import { usePayNow } from "@/features/payment/use-pay-now";
import { useCheckoutSelectionsStorage } from "@/features/payment/use-checkout-storage";
import { useAuthStore } from "@/store/auth-store";
import { DEFAULT_PROMO_CODE } from "./coupon";
import { PaymentSuccessModal } from "./payment-success-modal";
import { SignInModal } from "./auth/sign-in-modal";
import { SignUpModal } from "./auth/sign-up-modal";
import { OtpModal } from "./auth/otp-modal";

const VALID_STEPS: PaymentStepId[] = [
  "checkout",
  "personal",
  "complete-profile",
];

const PAYMENT_SHOW_OTP_AFTER_PROFILE_KEY = "payment_show_otp_after_profile";

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
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const showSuccessModal = profileJustCompleted && !successModalDismissed;
  const { user } = useAuthStore();
  const userEmail =
    typeof user === "object" && user !== null && "user" in user && user.user && typeof user.user === "object" && "email" in user.user
      ? String((user.user as Record<string, unknown>).email)
      : typeof user === "object" && user !== null && "email" in user
        ? String(user.email)
        : "";
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

  // When on complete-profile step and user is not logged in, open sign-in modal
  useEffect(() => {
    if (activeStep === "personal" && user == null) {
      setSignInOpen(true);
    }
  }, [activeStep, user]);

  const handleProfileComplete = useCallback(() => {
    const shouldShowOtp =
      typeof window !== "undefined" &&
      sessionStorage.getItem(PAYMENT_SHOW_OTP_AFTER_PROFILE_KEY) === "1";
    if (shouldShowOtp) {
      if (typeof window !== "undefined")
        sessionStorage.removeItem(PAYMENT_SHOW_OTP_AFTER_PROFILE_KEY);
      setOtpModalOpen(true);
    } else {
      setProfileJustCompleted(true);
      setSuccessModalDismissed(false);
    }
  }, []);

  const handleOtpVerifySuccess = useCallback(() => {
    if (typeof window !== "undefined")
      sessionStorage.removeItem(PAYMENT_SHOW_OTP_AFTER_PROFILE_KEY);
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

      <SignInModal
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSignUpClick={() => {
          setSignInOpen(false);
          setSignUpOpen(true);
        }}
        paymentShowOtpStorageKey={PAYMENT_SHOW_OTP_AFTER_PROFILE_KEY}
      />

      <SignUpModal
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
        onLoginClick={() => {
          setSignUpOpen(false);
          setSignInOpen(true);
        }}
        paymentShowOtpStorageKey={PAYMENT_SHOW_OTP_AFTER_PROFILE_KEY}
      />

      <OtpModal
        open={otpModalOpen}
        onOpenChange={setOtpModalOpen}
        email={userEmail || undefined}
        skipRedirect
        onVerifySuccess={handleOtpVerifySuccess}
      />
    </div>
  );
};

export default PaymentMain;
