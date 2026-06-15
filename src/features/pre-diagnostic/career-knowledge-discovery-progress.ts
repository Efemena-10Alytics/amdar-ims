"use client";

import { useSyncExternalStore } from "react";
import {
  buildCareerKnowledgeDiscoveryStepKey,
  isCareerKnowledgeDiscoveryStep,
  parseCareerKnowledgeDiscoveryStepNumber,
} from "@/features/pre-diagnostic/career-knowledge-discovery-steps";
import type { PreDiagnosticStepsCompletedState } from "@/types/user/enrollment";

const STORAGE_PREFIX = "amdari-career-knowledge-discovery";

type StoredProgress = {
  completedStepKeys: string[];
};

const progressListeners = new Set<() => void>();

function notifyProgressListeners() {
  progressListeners.forEach((listener) => listener());
}

function subscribeToCareerKnowledgeDiscoveryProgress(listener: () => void) {
  progressListeners.add(listener);
  return () => progressListeners.delete(listener);
}

function getStorageKey(enrollmentId: number): string {
  return `${STORAGE_PREFIX}:${enrollmentId}`;
}

function readStoredProgress(enrollmentId: number): StoredProgress {
  if (typeof window === "undefined") {
    return { completedStepKeys: [] };
  }

  try {
    const raw = localStorage.getItem(getStorageKey(enrollmentId));
    if (!raw) return { completedStepKeys: [] };

    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    if (!Array.isArray(parsed.completedStepKeys)) {
      return { completedStepKeys: [] };
    }

    return {
      completedStepKeys: parsed.completedStepKeys.filter(
        (key): key is string =>
          typeof key === "string" && isCareerKnowledgeDiscoveryStep(key),
      ),
    };
  } catch {
    return { completedStepKeys: [] };
  }
}

function writeStoredProgress(enrollmentId: number, progress: StoredProgress) {
  if (typeof window === "undefined") return;

  localStorage.setItem(getStorageKey(enrollmentId), JSON.stringify(progress));
  notifyProgressListeners();
}

export function getCompletedCareerKnowledgeDiscoverySteps(
  enrollmentId: number | undefined,
): string[] {
  if (enrollmentId == null) return [];
  return readStoredProgress(enrollmentId).completedStepKeys;
}

export function isCareerKnowledgeDiscoveryStepLocallyComplete(
  enrollmentId: number | undefined,
  stepKey: string,
): boolean {
  if (enrollmentId == null || !isCareerKnowledgeDiscoveryStep(stepKey)) {
    return false;
  }

  return getCompletedCareerKnowledgeDiscoverySteps(enrollmentId).includes(stepKey);
}

export function markCareerKnowledgeDiscoveryStepLocallyComplete(
  enrollmentId: number | undefined,
  stepKey: string,
): void {
  if (enrollmentId == null || !isCareerKnowledgeDiscoveryStep(stepKey)) return;

  const progress = readStoredProgress(enrollmentId);
  if (progress.completedStepKeys.includes(stepKey)) return;

  writeStoredProgress(enrollmentId, {
    completedStepKeys: [...progress.completedStepKeys, stepKey],
  });
}

export function isCareerKnowledgeDiscoveryGroupCompleteOnBackend(
  steps: PreDiagnosticStepsCompletedState | undefined,
): boolean {
  return steps?.carrerReadiness?.careerKnowledgeDiscovery === "completed";
}

export function isCareerKnowledgeDiscoveryAsideStepComplete(
  enrollmentId: number | undefined,
  stepKey: string,
  steps: PreDiagnosticStepsCompletedState | undefined,
): boolean {
  if (!isCareerKnowledgeDiscoveryStep(stepKey)) return false;

  if (isCareerKnowledgeDiscoveryGroupCompleteOnBackend(steps)) return true;

  return isCareerKnowledgeDiscoveryStepLocallyComplete(enrollmentId, stepKey);
}

export function isCareerKnowledgeDiscoveryAsideStepLocked(
  enrollmentId: number | undefined,
  stepKey: string,
  steps: PreDiagnosticStepsCompletedState | undefined,
  welcomeVideoComplete: boolean,
): boolean {
  const stepNumber = parseCareerKnowledgeDiscoveryStepNumber(stepKey);
  if (stepNumber == null) return false;

  if (stepNumber === 1) return !welcomeVideoComplete;

  const previousStepKey = buildCareerKnowledgeDiscoveryStepKey(stepNumber - 2);
  return !isCareerKnowledgeDiscoveryAsideStepComplete(
    enrollmentId,
    previousStepKey,
    steps,
  );
}

function getCareerKnowledgeDiscoveryProgressSnapshot(
  enrollmentId: number | undefined,
): string {
  return getCompletedCareerKnowledgeDiscoverySteps(enrollmentId).join(",");
}

export function useCareerKnowledgeDiscoveryProgress(
  enrollmentId: number | undefined,
): string[] {
  const snapshot = useSyncExternalStore(
    subscribeToCareerKnowledgeDiscoveryProgress,
    () => getCareerKnowledgeDiscoveryProgressSnapshot(enrollmentId),
    () => "",
  );

  return snapshot ? snapshot.split(",").filter(Boolean) : [];
}
