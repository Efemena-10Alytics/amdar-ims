import Aside from "@/components/_core/onboarding/aside";
import { JourneyStepper } from "@/components/_core/onboarding/journey-stepper";
import React, { Suspense } from "react";

const OnboardingLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="w-full h-screen overflow-hidden flex bg-white p-3 2xl:p-5">
      {/* left side */}
      <Suspense fallback={<div className="hidden lg:flex lg:w-[45%] xl:w-[42%]" />}>
        <Aside />
      </Suspense>
      {/* right side - two backgrounds: solid color + pattern */}
      <div
        className="relative h-full min-h-0 w-full overflow-y-auto sm:pl-10"
        style={{
          backgroundColor: "#E8EFF1",
          backgroundImage: "url(/images/pngs/auth-pattern.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "0 0",
        }}
      >
        <div className="w-full max-w-190 px-4 pt-5 sm:px-0 sm:pt-8">
          <JourneyStepper activeStep={1} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;
