"use client";

import { useEffect, useRef } from "react";
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
  const hasResumedRef = useRef(false);
  const currentStep = searchParams.get("step");

  useEffect(() => {
    if (isLoading || !enrollment || hasResumedRef.current) return;

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

    hasResumedRef.current = true;

    if (resumeHref) {
      router.replace(resumeHref);
    }
  }, [currentStep, data, enrollment, isLoading, router]);
}

export function useTechnologyReadinessResumeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enrollment, data, isLoading } = usePreDiagnosticData();
  const hasResumedRef = useRef(false);
  const currentStep = searchParams.get("step");

  useEffect(() => {
    if (isLoading || !enrollment || hasResumedRef.current) return;

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

    hasResumedRef.current = true;

    if (resumeHref) {
      router.replace(resumeHref);
    }
  }, [currentStep, data, enrollment, isLoading, router]);
}
