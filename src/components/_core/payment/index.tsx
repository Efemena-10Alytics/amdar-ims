"use client";

import React, { useState } from "react";
import SideNav, { type PaymentStepId } from "./side-nav";
import Checkout from "./checkout";
import PaymentDetails from "./payment-details";
import Payment from "./payment";

const PaymentMain = () => {
  const [activeStep, setActiveStep] = useState<PaymentStepId>("checkout");

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <SideNav activeStep={activeStep} onStepChange={setActiveStep} />

      {/* Right content – render based on active step */}
      {activeStep === "checkout" && <Checkout />}
      {activeStep === "personal" && <PaymentDetails />}
      {activeStep === "payment" && <Payment />}
    </div>
  );
};

export default PaymentMain;
