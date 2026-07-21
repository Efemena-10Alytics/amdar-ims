"use client";

import { useState } from "react";
import { Building2, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import type { ReadinessTestFieldAnswer } from "@/features/readiness-test/field-answers";
import type {
  ReadinessTestForm,
  ReadinessTestSubmitResultData,
} from "@/features/readiness-test/types";

const ASSESSMENT_TABS = [
  { id: "pre-assessment", label: "Pre-assessment" },
  { id: "post-assessment", label: "Post-assessment" },
] as const;

type AssessmentTabId = (typeof ASSESSMENT_TABS)[number]["id"];

const ASSESSMENT_QUESTIONS = [
  "What is the primary purpose of an interactive dashboard?",
  "Which visual is best for comparing values across categories?",
  "What does a dashboard filter allow a user to do?",
  "Which metric best represents customer retention?",
  "Why should dashboard colours remain consistent?",
  "What is the purpose of a KPI card?",
  "Which action improves dashboard accessibility?",
  "What should happen when a user selects a chart element?",
  "Why is data validation important before visualization?",
  "What makes a dashboard insight actionable?",
] as const;

const ASSESSMENT_OPTIONS = [
  "Communicate insights clearly",
  "Store raw data permanently",
  "Replace every detailed report",
  "Decorate a presentation",
] as const;

function buildAssessmentForm(tab: AssessmentTabId): ReadinessTestForm {
  const isPreAssessment = tab === "pre-assessment";
  const formId = isPreAssessment ? 9001 : 9002;

  return {
    id: formId,
    created_by: 0,
    title: isPreAssessment ? "Pre-assessment" : "Post-assessment",
    description: null,
    context_type: "project_assessment",
    context_type_id: 0,
    cohort_id: 0,
    program_id: 0,
    passing_score: 70,
    max_attempts: 3,
    duration: 10,
    guidelines: null,
    is_published: true,
    created_at: "",
    updated_at: "",
    sections: [],
    fields: ASSESSMENT_QUESTIONS.map((question, questionIndex) => {
      const fieldId = formId * 100 + questionIndex + 1;

      return {
        id: fieldId,
        form_id: formId,
        form_section_id: null,
        type: "single_choice" as const,
        label: question,
        description: null,
        is_required: true,
        order: questionIndex + 1,
        settings: { option_condition: "correct_answer" as const },
        created_at: "",
        updated_at: "",
        options: ASSESSMENT_OPTIONS.map((option, optionIndex) => ({
          id: fieldId * 10 + optionIndex + 1,
          form_field_id: fieldId,
          label: option,
          points: optionIndex === 0 ? 1 : 0,
          is_correct: optionIndex === 0,
          order: optionIndex + 1,
          created_at: "",
          updated_at: "",
        })),
      };
    }),
  };
}

function submitLocalAssessment(
  form: ReadinessTestForm,
  answers: Record<string, ReadinessTestFieldAnswer>,
): ReadinessTestSubmitResultData {
  const correctAnswers = form.fields.reduce((total, field) => {
    const selectedAnswer = answers[String(field.id)];
    const isCorrect = field.options.some(
      (option) => option.is_correct && option.label === selectedAnswer,
    );
    return total + (isCorrect ? 1 : 0);
  }, 0);
  const percentageScore = Math.round(
    (correctAnswers / Math.max(form.fields.length, 1)) * 100,
  );

  return {
    submission_id: Date.now(),
    attempt_number: 1,
    total_score: correctAnswers,
    percentage_score: percentageScore,
    passed:
      form.passing_score == null
        ? null
        : percentageScore >= form.passing_score,
    submitted_at: new Date().toISOString(),
  };
}

const Assessment = () => {
  const [activeTab, setActiveTab] =
    useState<AssessmentTabId>("pre-assessment");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isPreAssessment = activeTab === "pre-assessment";
  const assessmentForm = buildAssessmentForm(activeTab);

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-[#F7F9FA] px-5 py-4 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#4285F4]">
            G
          </span>
          <h2 className="max-w-3xl text-xl leading-tight font-semibold text-[#34445E] sm:text-2xl">
            Tenant Retention Optimization: Building an Interactive Power BI
            Dashboard for...
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
          <Building2 className="size-3.5" aria-hidden />
          Healthcare
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
          <CalendarDays className="size-3.5" aria-hidden />
          3 weeks duration
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
          <User className="size-3.5" aria-hidden />
          Jennifer Okeke contributor
        </span>
      </div>

      <div>
        <div className="flex items-end gap-6 border-b border-[#E2E8F0]">
          {ASSESSMENT_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative cursor-pointer pb-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#156374]"
                    : "text-[#BCD0D5] hover:text-[#78909C]",
                )}
              >
                {tab.label}
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#156374]" />
                ) : null}
              </button>
            );
          })}
        </div>

        <article className="mt-4 rounded-xl bg-white p-4 shadow-[0_5px_20px_rgba(15,99,113,0.14)]">
          <div className="rounded-lg bg-[#E8F0F3] px-4 py-3">
            <h3 className="text-sm font-semibold text-[#156374]">
              Assessment details
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#173740]">
              {isPreAssessment
                ? "Testing your knowledge on interactive dashboard before project commencement"
                : "Testing your knowledge on interactive dashboard after project completion"}
            </p>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#3F5E68] sm:text-sm">
              This is just a simple check to help you compare your knowledge on
              basic dashboard interaction before start and after completion of
              this project.
            </p>
          </div>

          <div className="mt-2 flex items-center justify-center gap-12 rounded-lg bg-[#FFF4D6] px-5 py-3 text-center sm:gap-20">
            <div>
              <p className="text-base font-semibold text-[#173740]">10</p>
              <p className="text-xs text-[#64748B]">Question</p>
            </div>
            <div>
              <p className="text-base font-semibold text-[#173740]">10</p>
              <p className="text-xs text-[#64748B]">Minutes</p>
            </div>
          </div>
        </article>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="mt-5 ml-auto block h-11 w-full cursor-pointer rounded-full bg-[#156374] px-6 text-sm font-medium text-white transition hover:bg-[#124F5D] sm:max-w-64"
        >
          Continue
        </button>
      </div>

      <ReadinessTestDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        form={assessmentForm}
        durationMinutes={assessmentForm.duration ?? 10}
        title={assessmentForm.title}
        finishLabel="Finish assessment"
        submitAnswers={submitLocalAssessment}
      />
    </section>
  );
};

export default Assessment;
