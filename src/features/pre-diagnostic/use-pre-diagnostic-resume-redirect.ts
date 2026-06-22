"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePreDiagnosticData } from "@/components/_core/pre-diagnostic-test/pre-diagnostic-context";
import {
  resolveCareerReadinessResumeHref,
  resolveTechnologyReadinessResumeHref,
} from "@/features/pre-diagnostic/resolve-pre-diagnostic-resume";

export function useCareerReadinessResumeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enrollment, data, isLoading } = usePreDiagnosticData();
  const currentStep = searchParams.get("step");

  useEffect(() => {
    if (isLoading || !enrollment) return;

    const discoveryCount = Math.max(
      data?.career_readiness?.careerKnowledgeDiscovery?.length ?? 1,
      1,
    );

    const resumeHref = resolveCareerReadinessResumeHref({
      enrollmentId: enrollment.id,
      steps: enrollment.isPreDiagnosticStepsCompleted,
      careerKnowledgeDiscoveryCount: discoveryCount,
      currentStep,
    });

    if (resumeHref) {
      router.replace(resumeHref);
    }
  }, [currentStep, data, enrollment, isLoading, router]);
}

export function useTechnologyReadinessResumeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enrollment, data, isLoading } = usePreDiagnosticData();
  const currentStep = searchParams.get("step");

  useEffect(() => {
    if (isLoading || !enrollment) return;

    const walkthroughCount = Math.max(
      data?.technology_readiness?.PracticalWalkthrough?.length ?? 1,
      1,
    );

    const resumeHref = resolveTechnologyReadinessResumeHref({
      enrollmentId: enrollment.id,
      steps: enrollment.isPreDiagnosticStepsCompleted,
      practicalWalkthroughCount: walkthroughCount,
      currentStep,
    });

    if (resumeHref) {
      router.replace(resumeHref);
    }
  }, [currentStep, data, enrollment, isLoading, router]);
}
