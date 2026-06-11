"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import { getReadinessTestGuidelines } from "@/features/readiness-test/get-readiness-test-guidelines";
import { getSortedReadinessTestFields } from "@/features/readiness-test/get-sorted-form-fields";
import { useReadinessTestEntry } from "@/features/readiness-test/use-readiness-test-entry";
import {
  isOnboardingEnrollmentStepComplete,
  useUpdateCompletedOnboardingStep,
} from "@/features/internship/use-update-completed-onboarding-step";
import Flag from "../landing-pages/home/hero/flag";
import { useOnboardingData } from "./onboarding-context";
import { useOnboardingNavigation } from "./use-onboarding-navigation";

const GUIDELINES = [
  "Answer honestly, this helps us make sure you get the right support from day one.",
  "There are no wrong answers, only the right fit.",
  "Ensure all questions are answered within the time frame",
  "Complete the quiz before time is up else the you would have to start again.",
];

const ReadinessTest = () => {
  const router = useRouter();
  const { onboarding } = useOnboardingNavigation();
  const { enrollment } = useOnboardingData();
  const { markOnboardingStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedOnboardingStep();

  const readinessForm = onboarding.readiness_test;
  const isStepCompleted = isOnboardingEnrollmentStepComplete(
    enrollment?.isOnboardingStepsCompleted,
    "readiness-test",
  );
  const {
    savedResult,
    isLoadingLatest,
    canViewResults,
    isDrawerOpen,
    setIsDrawerOpen,
    handleSubmitted,
  } = useReadinessTestEntry(readinessForm?.id, isStepCompleted, {
    markStepComplete: () => markOnboardingStepComplete("readiness-test"),
  });

  const fields = useMemo(
    () => getSortedReadinessTestFields(readinessForm),
    [readinessForm],
  );

  const questionCount = fields.length;
  const quizMinutes = readinessForm?.duration ?? 10;
  const quizTitle = readinessForm?.title ?? "Readiness Quiz";

  const handleProceed = async () => {
    router.push("/pre-diagnostic-test");
  };

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">Readiness Quiz</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-6">
        <h2 className="text-lg font-semibold text-[#2F6A78]">Your quiz</h2>

        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full bg-[#F4D98D] px-4 py-2 text-sm font-semibold text-[#6E5A1F]">
            💡 Complete the Readiness Quiz
          </span>
          <Flag width={18} />
        </div>

        <div className="mt-4 rounded-xl bg-[#E0E8EC] p-4">
          <h3 className="text-lg font-semibold text-[#2D6A78]">Assessment guidelines</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm font-medium text-[#3F5E68]">
            {getReadinessTestGuidelines(readinessForm?.guidelines, GUIDELINES).map(
              (item) => (
              <li key={item}>{item}</li>
            ),
            )}
          </ul>
        </div>

        <div className="mt-3 flex items-center justify-center gap-10 rounded-lg bg-[#EFF3F6] px-6 py-3 text-center">
          <div>
            <p className="text-lg font-semibold text-[#173740]">{questionCount}</p>
            <p className="text-sm font-medium text-[#6C7D88]">Question</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#173740]">{quizMinutes}</p>
            <p className="text-sm font-medium text-[#6C7D88]">Minutes</p>
          </div>
        </div>
      </article>

      {errorMessage ? (
        <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <button
        type="button"
        disabled={questionCount === 0 || isUpdating || isLoadingLatest}
        onClick={() => setIsDrawerOpen(true)}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0]"
      >
        {isUpdating
          ? "Saving..."
          : isLoadingLatest
            ? "Loading..."
            : canViewResults
              ? "View results"
              : "Start Quiz"}
      </button>

      <ReadinessTestDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        form={readinessForm}
        durationMinutes={quizMinutes}
        title={quizTitle}
        finishLabel="Finish Quiz"
        isProceeding={isUpdating}
        savedResult={savedResult}
        onSubmitted={handleSubmitted}
        onComplete={handleProceed}
      />
    </section>
  );
};

export default ReadinessTest;
