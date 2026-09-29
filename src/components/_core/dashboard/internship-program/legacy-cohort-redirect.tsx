"use client";

import { useEffect } from "react";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";

export function LegacyCohortRedirect() {
  const { data: enrollment, isAuthReady, isLoading } = useGetUserEnrollment();

  useEffect(() => {
    if (!isAuthReady || isLoading || !enrollment) return;

    if (enrollment.is_specialist_preview) return;

    const startDate = new Date(enrollment.cohort.start_date);
    const cutoffDate = new Date("2026-08-01T00:00:00Z");

    if (startDate < cutoffDate) {
      window.location.replace("https://app.amdari.io/dashboard/internship");
    }
  }, [isAuthReady, isLoading, enrollment]);

  return null;
}
