"use client";

import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { isSpecialistPreviewEnrollment } from "@/features/internship/resolve-enrollment-journey";

/**
 * Whether the page is showing a cohort the caller services rather than one they
 * are enrolled in.
 *
 * Server-authoritative: the API sets `is_specialist_preview` when it resolves a
 * specialist onto a cohort they have an assignment for but no enrollment in.
 * Deriving it on the client would mean re-fetching the user's own enrollments
 * purely to compare, and would disagree with the API the moment the assignment
 * rules change.
 *
 * Note this reads false until the enrollment resolves, so callers that gate
 * destructive UI on it should wait for `isReady`.
 */
export function useIsSpecialistPreview(): {
  isPreview: boolean;
  isReady: boolean;
} {
  const { data: enrollment, isPending, isError } = useGetUserEnrollment();

  return {
    isPreview: isSpecialistPreviewEnrollment(enrollment),
    isReady: !isPending || isError,
  };
}
