"use client";

import { useEffect, useMemo, useState } from "react";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { useGetWeeklySurveyStatus } from "./use-get-weekly-survey-status";

/** Returns the Date for Thu 21:00:00 UTC that opened the current window. */
function getCurrentSurveyWindowStart(date: Date): Date {
  const dow = date.getUTCDay();
  const daysBack = (dow - 4 + 7) % 7;
  const windowStart = new Date(date);
  windowStart.setUTCDate(windowStart.getUTCDate() - daysBack);
  windowStart.setUTCHours(21, 0, 0, 0);
  return windowStart;
}

/** Thu 21:00 UTC through Mon 01:00 UTC (Monday 01:00 exclusive). */
function isWithinWeeklySurveyUtcWindow(date: Date): boolean {
  const dow = date.getUTCDay();
  const msSinceUtcMidnight =
    date.getUTCHours() * 3600000 +
    date.getUTCMinutes() * 60000 +
    date.getUTCSeconds() * 1000 +
    date.getUTCMilliseconds();
  const thu2100 = 21 * 3600000;
  const mon0100 = 1 * 3600000;

  if (dow === 4) return msSinceUtcMidnight >= thu2100;
  if (dow === 5 || dow === 6 || dow === 0) return true;
  if (dow === 1) return msSinceUtcMidnight < mon0100;
  return false;
}

export type WeeklySurveyPhase = "intro" | "questions" | "success";

/**
 * Resolves whether the weekly-survey overlay should be showing at all, independent
 * of which phase it's currently in. Mirrors the original amdari-frontend gating:
 * Thu 21:00 UTC - Mon 01:00 UTC window, active (not upcoming/ended/just-started) cohort,
 * not already submitted this period, and hidden for internship-specialist staff.
 */
export function useWeeklySurveyEligibility({
  phase,
  flowComplete,
}: {
  phase: WeeklySurveyPhase;
  flowComplete: boolean;
}) {
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();
  const { data: enrollment } = useGetUserEnrollment();

  const [utcWindowCheckMs, setUtcWindowCheckMs] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(
      () => setUtcWindowCheckMs(Date.now()),
      30_000,
    );
    return () => window.clearInterval(id);
  }, []);

  const surveyInAllowedWindow = useMemo(
    () => isWithinWeeklySurveyUtcWindow(new Date(utcWindowCheckMs)),
    [utcWindowCheckMs],
  );

  const cohortId = enrollment?.cohort_id ?? null;
  const internshipCourseId = enrollment?.internship_course_id ?? null;
  const cohortStartDate = enrollment?.cohort?.start_date;
  const cohortEndDate = enrollment?.cohort?.end_date;

  const cohortNotStarted = useMemo(() => {
    if (!cohortStartDate) return false;
    const start = new Date(cohortStartDate);
    if (Number.isNaN(start.getTime())) return false;
    return start.getTime() > Date.now();
  }, [cohortStartDate]);

  const cohortEnded = useMemo(() => {
    if (!cohortEndDate) return false;
    const end = new Date(cohortEndDate);
    if (Number.isNaN(end.getTime())) return false;
    return Date.now() > end.getTime();
    // utcWindowCheckMs re-triggers this on the same 30s cadence as the window check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cohortEndDate, utcWindowCheckMs]);

  // Cohorts that started within the current Thu-Mon window sit out until next Thursday.
  const cohortStartedInCurrentWindow = useMemo(() => {
    if (!surveyInAllowedWindow || !cohortStartDate) return false;
    const start = new Date(cohortStartDate);
    if (Number.isNaN(start.getTime())) return false;
    const windowStart = getCurrentSurveyWindowStart(new Date(utcWindowCheckMs));
    return start.getTime() >= windowStart.getTime();
  }, [cohortStartDate, surveyInAllowedWindow, utcWindowCheckMs]);

  const gatesPass =
    isRoleReady &&
    !isInternshipSpecialist &&
    cohortId != null &&
    internshipCourseId != null &&
    surveyInAllowedWindow &&
    !cohortNotStarted &&
    !cohortEnded &&
    !cohortStartedInCurrentWindow;

  const statusQuery = useGetWeeklySurveyStatus({
    cohortId,
    internshipCourseId,
    enabled: gatesPass,
  });

  const statusSettled = !statusQuery.isLoading && !statusQuery.isFetching;
  const alreadySubmitted =
    statusQuery.isSuccess && statusQuery.data?.submitted === true;

  const questionsEnabled =
    gatesPass &&
    !flowComplete &&
    statusSettled &&
    !alreadySubmitted &&
    phase !== "success";

  const shouldRenderOverlay =
    !flowComplete &&
    gatesPass &&
    statusSettled &&
    (phase === "success" || !alreadySubmitted);

  return {
    shouldRenderOverlay,
    cohortId,
    internshipCourseId,
    statusQuery,
    questionsEnabled,
  };
}
