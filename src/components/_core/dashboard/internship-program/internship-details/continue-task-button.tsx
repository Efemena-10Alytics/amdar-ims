"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import AssessmentResult from "@/components/_core/dashboard/internship-program/project-details/assessment/assessment-result";
import ReadinessTestDrawer from "@/components/_core/readiness-test/readiness-test-drawer";
import { useGetCurrentProject } from "@/features/interns-project/use-get-current-project";
import {
  ENROLLMENT_PROGRESS_QUERY_KEY,
  useGetInternshipProgress,
} from "@/features/interns-project/use-get-internship-progress";
import {
  INTERN_PROJECT_ASSESSMENTS_QUERY_KEY,
  useGetProjectAssessments,
} from "@/features/interns-project/use-get-project-assessments";
import { normalizeReadinessSubmitResultData } from "@/features/readiness-test/normalize-submit-result";
import type { ProjectAssessment } from "@/features/interns-project/internship-project.types";
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

export default function ContinueTaskButton() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const progressQuery = useGetInternshipProgress();
  const currentProjectQuery = useGetCurrentProject();

  const taskTracker = progressQuery.data?.taskTracker;
  const currentTask = taskTracker?.currentTask ?? null;
  const preAssessmentDone = taskTracker?.preAssessmentDone === true;
  const projectSlug = currentProjectQuery.data?.project?.slug?.trim() || null;
  const projectId =
    currentTask?.projectId ?? currentProjectQuery.data?.project?.id ?? null;

  const assessmentsQuery = useGetProjectAssessments(
    !preAssessmentDone ? projectId : null,
  );
  const preAssessment = assessmentsQuery.data?.pre ?? null;
  const savedResult = preAssessment?.my_latest_submission
    ? normalizeReadinessSubmitResultData(preAssessment.my_latest_submission)
    : null;
  const hasQuestions = (preAssessment?.question_count ?? 0) > 0;
  const canOpenPreAssessment =
    hasQuestions &&
    !preAssessment?.is_locked &&
    (savedResult != null || preAssessment?.can_attempt === true);

  const isLoading =
    progressQuery.isLoading ||
    progressQuery.isEnrollmentLoading ||
    currentProjectQuery.isLoading ||
    (!preAssessmentDone && assessmentsQuery.isLoading);

  const label = preAssessmentDone ? "Continue Task" : "Start Task";

  const continueHref = (() => {
    if (!preAssessmentDone || !projectSlug || !currentTask) return null;
    return buildCurrentTaskHref({
      projectSlug,
      todoId: currentTask.todoId,
      typeId: currentTask.type?.id,
    });
  })();

  const handleSubmitted = async () => {
    const invalidations = [
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_PROGRESS_QUERY_KEY(
          progressQuery.cohortId ?? "",
          progressQuery.programId ?? "",
        ),
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

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white opacity-70"
      >
        {label}
      </button>
    );
  }

  if (!preAssessmentDone) {
    if (!canOpenPreAssessment || !preAssessment) return null;

    return (
      <>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
        >
          {label}
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

  if (!continueHref) return null;

  return (
    <Link
      href={continueHref}
      className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
    >
      {label}
    </Link>
  );
}
