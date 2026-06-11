"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import { usePreDiagnosticData } from "@/components/_core/pre-diagnostic-test/pre-diagnostic-context";
import { usePreDiagnosticNavigation } from "@/components/_core/pre-diagnostic-test/use-pre-diagnostic-navigation";
import { getReadinessTestGuidelines } from "@/features/readiness-test/get-readiness-test-guidelines";
import { getSortedReadinessTestFields } from "@/features/readiness-test/get-sorted-form-fields";
import { useReadinessTestEntry } from "@/features/readiness-test/use-readiness-test-entry";
import {
  isPreDiagnosticEnrollmentStepComplete,
  useUpdateCompletedPreDiagnostic,
} from "@/features/internship/use-update-completed-pre-diagnostic";

const GUIDELINES = [
  "Answer honestly, this helps us make sure you get the right support from day one.",
  "There are no wrong answers, only the right fit.",
  "Ensure all questions are answered",
];

const DIAGNOSTIC_FLAGS = [
  { src: "/images/svgs/country/UK.svg", alt: "United Kingdom" },
  { src: "/images/svgs/country/CAD.svg", alt: "Canada" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
];

const ImsDiagnostics = () => {
  const router = useRouter();
  const { preDiagnostic } = usePreDiagnosticNavigation();
  const { enrollment } = usePreDiagnosticData();
  const { markPreDiagnosticStepComplete, isUpdating, errorMessage } =
    useUpdateCompletedPreDiagnostic();
  const diagnosticForm = preDiagnostic.ims_readiness.imsDiagnostic;
  const isStepCompleted = isPreDiagnosticEnrollmentStepComplete(
    enrollment?.isPreDiagnosticStepsCompleted,
    "ims-diagnostics",
  );
  const {
    savedResult,
    isLoadingLatest,
    canViewResults,
    isDrawerOpen,
    setIsDrawerOpen,
    handleSubmitted,
  } = useReadinessTestEntry(diagnosticForm?.id, isStepCompleted, {
    markStepComplete: () => markPreDiagnosticStepComplete("ims-diagnostics"),
  });

  const fields = useMemo(
    () => getSortedReadinessTestFields(diagnosticForm),
    [diagnosticForm],
  );
  const questionCount = fields.length;
  const durationMinutes = diagnosticForm?.duration ?? 10;
  const diagnosticTitle = diagnosticForm?.title ?? "IMS Diagnostics";

  const handleProceed = async () => {
    router.push("/setup");
  };

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">IMS Diagnostics</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-white p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-6">
        <h2 className="text-lg font-semibold text-[#2F6A78]">Your diagnostics</h2>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F4D98D] px-4 py-2 text-sm font-semibold text-[#6E5A1F]">
            <Lightbulb className="size-4 shrink-0" aria-hidden />
            IMS diagnostics
          </span>

          <div className="flex items-center">
            {DIAGNOSTIC_FLAGS.map((flag, index) => (
              <Image
                key={flag.alt}
                src={flag.src}
                height={18}
                width={18}
                alt={flag.alt}
                className={index > 0 ? "-ml-1.5" : ""}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#E0E8EC] p-4">
          <h3 className="text-lg font-semibold text-[#2D6A78]">Assessment guidelines</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm font-medium text-[#3F5E68]">
            {getReadinessTestGuidelines(diagnosticForm?.guidelines, GUIDELINES).map(
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
          <span className="h-10 w-px bg-[#D0DAE0]" aria-hidden />
          <div>
            <p className="text-lg font-semibold text-[#173740]">{durationMinutes}</p>
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
              : "Start diagnostic"}
      </button>

      <ReadinessTestDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        form={diagnosticForm}
        durationMinutes={durationMinutes}
        title={diagnosticTitle}
        finishLabel="Finish diagnostic"
        isProceeding={isUpdating}
        savedResult={savedResult}
        onSubmitted={handleSubmitted}
        onComplete={handleProceed}
      />
    </section>
  );
};

export default ImsDiagnostics;
