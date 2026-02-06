"use client";

import { useState } from "react";
import SideNav, { type PaymentStepId } from "./side-nav";
import Checkout from "./checkout";
import PaymentDetails from "./payment-details";
import type { InternshipProgram } from "@/types/internship-program";
import type { CheckoutData } from "@/features/payment/use-get-checkout-data";
import type { CheckoutSelections } from "@/types/payment";
import Coupon from "./coupon";

interface PaymentMainProps {
  program?: InternshipProgram;
  checkoutData?: CheckoutData;
}

const PaymentMain = ({ program, checkoutData }: PaymentMainProps) => {
  const [activeStep, setActiveStep] = useState<PaymentStepId>("checkout");
  const [checkoutSelections, setCheckoutSelections] =
    useState<CheckoutSelections | null>(null);

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
            onProceed={() => {}}
          />
        )}
      </div>
      <Coupon />
    </div>
  );
};

export default PaymentMain;
