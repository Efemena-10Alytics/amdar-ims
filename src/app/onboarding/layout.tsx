import OnboardingShell from "@/components/_core/onboarding/onboarding-shell";
import React, { Suspense } from "react";

const OnboardingLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <OnboardingShell>
      <Suspense fallback={null}>{children}</Suspense>
    </OnboardingShell>
  );
};

export default OnboardingLayout;
