"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarDays, User } from "lucide-react";
import AssessmentResult from "@/components/_core/dashboard/internship-program/project-details/assessment/assessment-result";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import { formatDurationLabel } from "../project-content";
import type {
  InternProject,
  ProjectAssessment,
} from "@/features/interns-project/internship-project.types";
import {
  ENROLLMENT_PROGRESS_QUERY_KEY,
  useGetInternshipProgress,
} from "@/features/interns-project/use-get-internship-progress";
import {
  INTERN_PROJECT_ASSESSMENTS_QUERY_KEY,
  useGetProjectAssessments,
} from "@/features/interns-project/use-get-project-assessments";
import { normalizeReadinessSubmitResultData } from "@/features/readiness-test/normalize-submit-result";
import type { ReadinessTestQuizForm } from "@/features/readiness-test/types";

const DEFAULT_DURATION_MINUTES = 10;
const CONTINUE_BUTTON_CLASS =
  "mt-5 inline-flex h-11 w-full max-w-[14.5rem] cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-6 text-sm font-semibold text-white transition hover:bg-[#0C5662]";
const CONTINUE_BUTTON_DISABLED_CLASS =
  "mt-5 inline-flex h-11 w-full max-w-[14.5rem] cursor-not-allowed items-center justify-center rounded-full bg-[#0F6371] px-6 text-sm font-semibold text-white opacity-70";

function toDurationMinutes(durationSeconds: number | null | undefined) {
  if (durationSeconds == null) return DEFAULT_DURATION_MINUTES;
  return Math.round(durationSeconds / 60);
}

function toQuizForm(assessment: ProjectAssessment): ReadinessTestQuizForm {
  return { id: assessment.id, fields: assessment.fields };
}

type ProjectSummaryProps = {
  project: InternProject;
  continueHref?: string | null;
};

export default function ProjectSummary({
  project,
  continueHref,
}: ProjectSummaryProps) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [locallyCompletedPre, setLocallyCompletedPre] = useState(false);
  const { cohortId, programId } = useGetInternshipProgress();
  const assessmentsQuery = useGetProjectAssessments(project.id);
  const preAssessment = assessmentsQuery.data?.pre ?? null;
  const savedResult = preAssessment?.my_latest_submission
    ? normalizeReadinessSubmitResultData(preAssessment.my_latest_submission)
    : null;
  const projectPreDone =
    locallyCompletedPre ||
    !preAssessment ||
    Boolean(preAssessment.my_latest_submission);
  const needsPreAssessment = !assessmentsQuery.isLoading && !projectPreDone;
  const canOpenAssessment =
    preAssessment != null && (preAssessment.question_count ?? 0) > 0;

  const durationLabel = formatDurationLabel(project.duration);

  const handleSubmitted = async () => {
    setLocallyCompletedPre(true);
    setIsDrawerOpen(false);

    const invalidations = [
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_PROGRESS_QUERY_KEY(
          cohortId ?? "",
          programId ?? "",
        ),
      }),
    ];
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: INTERN_PROJECT_ASSESSMENTS_QUERY_KEY(project.id),
      }),
    );
    await Promise.all(invalidations);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#F7F9FA] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.logoPreview || "/favicon.svg"}
            alt={project.companyName || project.title}
            className="mt-1 size-5 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 space-y-3">
            <h2 className="text-xl leading-snug font-semibold text-[#34445E] sm:text-2xl">
              {project.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {project.industry ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#78909C]">
                  <Building2 className="size-3.5" aria-hidden />
                  {project.industry}
                </span>
              ) : null}
              {durationLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#78909C]">
                  <CalendarDays className="size-3.5" aria-hidden />
                  {durationLabel}
                </span>
              ) : null}
              {project.companyName ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#78909C]">
                  <User className="size-3.5" aria-hidden />
                  {project.companyName} contributor
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {assessmentsQuery.isLoading || needsPreAssessment ? (
          assessmentsQuery.isLoading ? (
            <button
              type="button"
              disabled
              className={CONTINUE_BUTTON_DISABLED_CLASS}
            >
              Continue task
            </button>
          ) : canOpenAssessment && preAssessment ? (
            <>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className={CONTINUE_BUTTON_CLASS}
              >
                Continue task
              </button>
              <ReadinessTestDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                form={toQuizForm(preAssessment)}
                durationMinutes={toDurationMinutes(preAssessment.duration)}
                title="Pre-assessment"
                finishLabel="Finish assessment"
                savedResult={savedResult}
                allowRetake={false}
                renderResult={(result) => (
                  <AssessmentResult
                    result={result}
                    maxScore={preAssessment.max_score}
                    isPreAssessment
                    fields={preAssessment.fields}
                    answers={preAssessment.my_latest_submission?.answers ?? []}
                    onClose={() => setIsDrawerOpen(false)}
                  />
                )}
                onSubmitted={handleSubmitted}
              />
            </>
          ) : continueHref ? (
            <Link href={continueHref} className={CONTINUE_BUTTON_CLASS}>
              Continue task
            </Link>
          ) : null
        ) : continueHref ? (
          <Link href={continueHref} className={CONTINUE_BUTTON_CLASS}>
            Continue task
          </Link>
        ) : null}
      </div>
    </div>
  );
}
