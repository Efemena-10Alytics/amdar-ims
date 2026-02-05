"use client";

import { useState } from "react";
import SideNav, { type PaymentStepId } from "./side-nav";
import Checkout from "./checkout";
import PaymentDetails from "./payment-details";
import type { InternshipProgram } from "@/types/internship-program";
import type { CheckoutData } from "@/features/payment/use-get-checkout-data";

interface PaymentMainProps {
  program?: InternshipProgram;
  checkoutData?: CheckoutData;
}

const PaymentMain = ({ program, checkoutData }: PaymentMainProps) => {
  const [activeStep, setActiveStep] = useState<PaymentStepId>("checkout");

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <SideNav activeStep={activeStep} onStepChange={setActiveStep} />

      {/* Right content – render based on active step */}
      {activeStep === "checkout" && (
        <Checkout
          checkoutData={checkoutData}
          program={program}
          setActiveStep={setActiveStep}
        />
      )}
      {activeStep === "personal" && <PaymentDetails />}
      {/* {activeStep === "payment" && <Payment />} */}
    </div>
  );
};

export default PaymentMain;
