import type { OnboardingStepKey } from "@/features/onboarding/types";
import { isOnboardingEnrollmentStepComplete } from "@/features/internship/use-update-completed-onboarding-step";
import type { UserEnrollment } from "@/types/user/enrollment";
import { ArrowLeft, ChevronLeft } from "lucide-react";

type OnboardingPreviousStepButtonProps = {
  enrollment?: UserEnrollment;
  previousStep: OnboardingStepKey;
  onClick: () => void;
};

export default function OnboardingPreviousStepButton({
  enrollment,
  previousStep,
  onClick,
}: OnboardingPreviousStepButtonProps) {
  const canGoBack = isOnboardingEnrollmentStepComplete(
    enrollment?.isOnboardingStepsCompleted,
    previousStep,
  );

  if (!canGoBack) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to previous step"
      className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#C9DDE2] text-[#5F8993] transition-colors hover:bg-[#B6CFD4] hover:text-[#156374]"
    >
      <ArrowLeft className="size-4" strokeWidth={2.5} />
    </button>
  );
}
