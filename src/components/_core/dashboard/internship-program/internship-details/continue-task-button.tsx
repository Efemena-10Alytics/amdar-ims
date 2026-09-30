"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import AssessmentResult from "@/components/_core/dashboard/internship-program/project-details/assessment/assessment-result";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import {
  ENROLLMENT_PROGRESS_QUERY_KEY,
  useGetInternshipProgress,
} from "@/features/interns-project/use-get-internship-progress";
import {
  INTERN_PROJECT_ASSESSMENTS_QUERY_KEY,
  useGetProjectAssessments,
} from "@/features/interns-project/use-get-project-assessments";
import type { ProjectAssessment } from "@/features/interns-project/internship-project.types";
import { normalizeReadinessSubmitResultData } from "@/features/readiness-test/normalize-submit-result";
import type { ReadinessTestQuizForm } from "@/features/readiness-test/types";

function buildCurrentTaskHref({
  projectSlug,
  todoId,
  typeId,
}: {
  projectSlug: string;
  todoId: number;
  typeId?: number | null;
}) {
  const base = `/dashboard/internship-program/projects/${encodeURIComponent(projectSlug)}/classroom/${todoId}`;
  return typeId != null ? `${base}?type=${typeId}` : base;
}

const DEFAULT_DURATION_MINUTES = 10;

function toDurationMinutes(durationSeconds: number | null | undefined) {
  if (durationSeconds == null) return DEFAULT_DURATION_MINUTES;
  return Math.round(durationSeconds / 60);
}

function toQuizForm(assessment: ProjectAssessment): ReadinessTestQuizForm {
  return { id: assessment.id, fields: assessment.fields };
}

const BUTTON_CLASS =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white transition hover:bg-[#0C5662]";
const BUTTON_DISABLED_CLASS =
  "inline-flex h-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white opacity-70";

export default function ContinueTaskButton() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [locallyCompletedPre, setLocallyCompletedPre] = useState(false);

  const {
    data: progress,
    currentTask,
    preAssessmentDone: progressPreAssessmentDone,
    isLoading,
    isEnrollmentLoading,
    cohortId,
    programId,
  } = useGetInternshipProgress();

  console.log("progress", progress);

  const preAssessmentDone =
    progressPreAssessmentDone ||
    progress?.assessments?.pre?.isComplete === true ||
    locallyCompletedPre;

  const projectId = currentTask?.projectId ?? null;
  const projectSlug = currentTask?.projectSlug?.trim() || null;

  const assessmentsQuery = useGetProjectAssessments(
    !preAssessmentDone ? projectId : null,
  );
  const preAssessment = assessmentsQuery.data?.pre ?? null;
  const savedResult = preAssessment?.my_latest_submission
    ? normalizeReadinessSubmitResultData(preAssessment.my_latest_submission)
    : null;
  const canStartPreAssessment =
    preAssessment != null &&
    (preAssessment.question_count ?? 0) > 0 &&
    preAssessment.can_attempt === true &&
    !preAssessment.is_locked;

  const isProgressLoading =
    !progress && (isLoading || isEnrollmentLoading);

  const continueHref =
    currentTask && projectSlug
      ? buildCurrentTaskHref({
          projectSlug,
          todoId: currentTask.todoId,
          typeId: currentTask.type?.id,
        })
      : null;

  const handleSubmitted = async () => {
    setLocallyCompletedPre(true);
    setIsDrawerOpen(false);

    const invalidations = [
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_PROGRESS_QUERY_KEY(cohortId ?? "", programId ?? ""),
      }),
    ];
    if (projectId != null) {
      invalidations.push(
        queryClient.invalidateQueries({
          queryKey: INTERN_PROJECT_ASSESSMENTS_QUERY_KEY(projectId),
        }),
      );
    }
    await Promise.all(invalidations);
  };

  if (isProgressLoading) {
    return (
      <button type="button" disabled className={BUTTON_DISABLED_CLASS}>
        {preAssessmentDone ? "Continue Task" : "Start Task"}
      </button>
    );
  }

  if (preAssessmentDone && continueHref) {
    return (
      <Link href={continueHref} className={BUTTON_CLASS}>
        Continue Task
      </Link>
    );
  }

  if (!preAssessmentDone) {
    if (assessmentsQuery.isLoading) {
      return (
        <button type="button" disabled className={BUTTON_DISABLED_CLASS}>
          Start Task
        </button>
      );
    }

    if (canStartPreAssessment && preAssessment) {
      return (
        <>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={BUTTON_CLASS}
          >
            Start Task
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
      );
    }
  }

  return null;
}
