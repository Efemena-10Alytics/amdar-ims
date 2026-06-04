import { Suspense } from "react";
import OnboardingPageContent from "@/components/_core/onboarding/onboarding-page-content";

function OnboardingFallback() {
  return (
    <div className="w-full max-w-190 px-4 pb-8 pt-0 sm:px-0">
      <p className="text-sm text-[#64748B]">Loading...</p>
    </div>
  );
}

const OnboardingPage = () => {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingPageContent />
    </Suspense>
  );
};

export default OnboardingPage;
