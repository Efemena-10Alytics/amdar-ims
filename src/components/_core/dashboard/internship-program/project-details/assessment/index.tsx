"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarDays, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichTextContent, formatDurationLabel } from "../project-content";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import AssessmentResult from "./assessment-result";
import {
  INTERN_PROJECT_ASSESSMENTS_QUERY_KEY,
  useGetProjectAssessments,
} from "@/features/interns-project/use-get-project-assessments";
import { normalizeReadinessSubmitResultData } from "@/features/readiness-test/normalize-submit-result";
import type {
  InternProject,
  ProjectAssessment,
  ProjectAssessmentType,
} from "@/features/interns-project/internship-project.types";
import type { ReadinessTestQuizForm } from "@/features/readiness-test/types";

const ASSESSMENT_TABS = [
  { id: "pre", label: "Pre-assessment" },
  { id: "post", label: "Post-assessment" },
] as const satisfies ReadonlyArray<{
  id: ProjectAssessmentType;
  label: string;
}>;

const DEFAULT_DURATION_MINUTES = 10;

/** The builder stores assessment `duration` in seconds; everything here counts in minutes. */
function toDurationMinutes(durationSeconds: number | null | undefined) {
  if (durationSeconds == null) return DEFAULT_DURATION_MINUTES;
  return Math.round(durationSeconds / 60);
}

function AssessmentState({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-xl bg-white p-8 text-center shadow-[0_5px_20px_rgba(15,99,113,0.14)]">
      <p className="text-sm text-[#64748B]">{message}</p>
    </div>
  );
}

/** The drawer only needs an id to submit against and the questions themselves. */
function toQuizForm(assessment: ProjectAssessment): ReadinessTestQuizForm {
  return { id: assessment.id, fields: assessment.fields };
}

const Assessment = ({ project }: { project: InternProject }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ProjectAssessmentType>("pre");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: assessments,
    isLoading,
    isError,
  } = useGetProjectAssessments(project.id);

  const isPreAssessment = activeTab === "pre";
  const assessment = assessments?.[activeTab] ?? null;
  const postAssessment = assessments?.post ?? null;
  // Locked until the pre-assessment has been submitted — the server enforces
  // the same rule, this only keeps the tab from looking available.
  const isPostLocked = postAssessment?.is_locked ?? false;

  const savedResult = assessment?.my_latest_submission
    ? normalizeReadinessSubmitResultData(assessment.my_latest_submission)
    : null;
  const hasQuestions = (assessment?.question_count ?? 0) > 0;
  const canOpen =
    hasQuestions && (savedResult != null || assessment?.can_attempt === true);

  const durationLabel = formatDurationLabel(project.duration);
  const durationMinutes = toDurationMinutes(assessment?.duration);
  const activeTabLabel =
    ASSESSMENT_TABS.find((tab) => tab.id === activeTab)?.label ?? "Assessment";

  const handleSubmitted = async () => {
    await queryClient.invalidateQueries({
      queryKey: INTERN_PROJECT_ASSESSMENTS_QUERY_KEY(project.id),
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-[#F7F9FA] px-5 py-4 sm:px-7">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.logoPreview || "/favicon.svg"}
            alt={project.companyName || project.title}
            className="mt-0.5 size-5 shrink-0 rounded-full object-cover"
          />
          <h2 className="max-w-3xl text-xl leading-tight font-semibold text-[#34445E] sm:text-2xl">
            {project.title}
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {project.industry ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
            <Building2 className="size-3.5" aria-hidden />
            {project.industry}
          </span>
        ) : null}
        {durationLabel ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
            <CalendarDays className="size-3.5" aria-hidden />
            {durationLabel}
          </span>
        ) : null}
        {project.companyName ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#78909C]">
            <User className="size-3.5" aria-hidden />
            {project.companyName}
          </span>
        ) : null}
      </div>

      <div>
        <div className="flex items-end gap-6 border-b border-[#E2E8F0]">
          {ASSESSMENT_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.id === "post" && isPostLocked;

            return (
              <button
                key={tab.id}
                type="button"
                disabled={isDisabled}
                title={
                  isDisabled
                    ? (postAssessment?.locked_reason ?? undefined)
                    : undefined
                }
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-1.5 pb-2 text-sm font-medium transition-colors",
                  isDisabled
                    ? "cursor-not-allowed text-[#BCD0D5]"
                    : isActive
                      ? "cursor-pointer text-[#156374]"
                      : "cursor-pointer text-[#BCD0D5] hover:text-[#78909C]",
                )}
              >
                {tab.label}
                {isDisabled ? <Lock className="size-3" aria-hidden /> : null}
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#156374]" />
                ) : null}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <AssessmentState message="Loading assessment..." />
        ) : isError ? (
          <AssessmentState message="Something went wrong while loading this assessment." />
        ) : !assessment ? (
          <AssessmentState
            message={`Your specialist hasn't set up the ${activeTabLabel.toLowerCase()} for this project yet.`}
          />
        ) : (
          <>
            <article className="mt-4 rounded-xl bg-white p-4 shadow-[0_5px_20px_rgba(15,99,113,0.14)]">
              <div className="rounded-lg bg-[#E8F0F3] px-4 py-3">
                <h3 className="text-sm font-semibold text-[#156374]">
                  Assessment details
                </h3>
                <p className="mt-2 text-sm font-semibold text-[#173740]">
                  {assessment.title}
                </p>
                {assessment.description ? (
                  <RichTextContent
                    value={assessment.description}
                    className="mt-1 max-w-3xl text-xs text-[#3F5E68] sm:text-sm"
                  />
                ) : null}
              </div>

              <div className="mt-2 flex items-center justify-center gap-12 rounded-lg bg-[#FFF4D6] px-5 py-3 text-center sm:gap-20">
                <div>
                  <p className="text-base font-semibold text-[#173740]">
                    {assessment.question_count}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {assessment.question_count === 1 ? "Question" : "Questions"}
                  </p>
                </div>
                <div>
                  <p className="text-base font-semibold text-[#173740]">
                    {durationMinutes}
                  </p>
                  <p className="text-xs text-[#64748B]">Minutes</p>
                </div>
              </div>

              {!hasQuestions ? (
                <p className="mt-3 text-center text-sm text-[#64748B]">
                  No questions have been added to this assessment yet.
                </p>
              ) : null}

              {assessment.is_locked && assessment.locked_reason ? (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-[#64748B]">
                  <Lock className="size-3.5" aria-hidden />
                  {assessment.locked_reason}
                </p>
              ) : null}
            </article>

            <button
              type="button"
              disabled={!canOpen}
              onClick={() => setIsDrawerOpen(true)}
              className="mt-5 ml-auto block h-11 w-full cursor-pointer rounded-full bg-[#156374] px-6 text-sm font-medium text-white transition hover:bg-[#124F5D] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] sm:max-w-64"
            >
              {savedResult ? "View result" : "Continue"}
            </button>

            <ReadinessTestDrawer
              open={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
              form={toQuizForm(assessment)}
              durationMinutes={durationMinutes}
              title={activeTabLabel}
              finishLabel="Finish assessment"
              savedResult={savedResult}
              allowRetake={false}
              renderResult={(result) => (
                <AssessmentResult
                  result={result}
                  maxScore={assessment.max_score}
                  isPreAssessment={isPreAssessment}
                  fields={assessment.fields}
                  answers={assessment.my_latest_submission?.answers ?? []}
                  onClose={() => setIsDrawerOpen(false)}
                />
              )}
              onSubmitted={handleSubmitted}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Assessment;
