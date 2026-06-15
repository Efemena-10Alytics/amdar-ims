"use client";

import { useSyncExternalStore } from "react";
import {
  buildPracticalWalkthroughStepKey,
  isPracticalWalkthroughStep,
  parsePracticalWalkthroughStepNumber,
} from "@/features/pre-diagnostic/practical-walkthrough-steps";
import type { PreDiagnosticStepsCompletedState } from "@/types/user/enrollment";

const STORAGE_PREFIX = "amdari-practical-walkthrough";

type StoredProgress = {
  completedStepKeys: string[];
};

const progressListeners = new Set<() => void>();

function notifyProgressListeners() {
  progressListeners.forEach((listener) => listener());
}

function subscribeToPracticalWalkthroughProgress(listener: () => void) {
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
          typeof key === "string" && isPracticalWalkthroughStep(key),
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

export function getCompletedPracticalWalkthroughSteps(
  enrollmentId: number | undefined,
): string[] {
  if (enrollmentId == null) return [];
  return readStoredProgress(enrollmentId).completedStepKeys;
}

export function isPracticalWalkthroughStepLocallyComplete(
  enrollmentId: number | undefined,
  stepKey: string,
): boolean {
  if (enrollmentId == null || !isPracticalWalkthroughStep(stepKey)) {
    return false;
  }

  return getCompletedPracticalWalkthroughSteps(enrollmentId).includes(stepKey);
}

export function markPracticalWalkthroughStepLocallyComplete(
  enrollmentId: number | undefined,
  stepKey: string,
): void {
  if (enrollmentId == null || !isPracticalWalkthroughStep(stepKey)) return;

  const progress = readStoredProgress(enrollmentId);
  if (progress.completedStepKeys.includes(stepKey)) return;

  writeStoredProgress(enrollmentId, {
    completedStepKeys: [...progress.completedStepKeys, stepKey],
  });
}

export function isPracticalWalkthroughGroupCompleteOnBackend(
  steps: PreDiagnosticStepsCompletedState | undefined,
): boolean {
  return steps?.TechnologyDiagnostic?.practicalWalkthrough === "completed";
}

export function isPracticalWalkthroughAsideStepComplete(
  enrollmentId: number | undefined,
  stepKey: string,
  steps: PreDiagnosticStepsCompletedState | undefined,
): boolean {
  if (!isPracticalWalkthroughStep(stepKey)) return false;

  if (isPracticalWalkthroughGroupCompleteOnBackend(steps)) return true;

  return isPracticalWalkthroughStepLocallyComplete(enrollmentId, stepKey);
}

export function isPracticalWalkthroughAsideStepLocked(
  enrollmentId: number | undefined,
  stepKey: string,
  steps: PreDiagnosticStepsCompletedState | undefined,
  technologyUseCaseComplete: boolean,
): boolean {
  const stepNumber = parsePracticalWalkthroughStepNumber(stepKey);
  if (stepNumber == null) return false;

  if (stepNumber === 1) return !technologyUseCaseComplete;

  const previousStepKey = buildPracticalWalkthroughStepKey(stepNumber - 2);
  return !isPracticalWalkthroughAsideStepComplete(
    enrollmentId,
    previousStepKey,
    steps,
  );
}

function getPracticalWalkthroughProgressSnapshot(
  enrollmentId: number | undefined,
): string {
  return getCompletedPracticalWalkthroughSteps(enrollmentId).join(",");
}

export function usePracticalWalkthroughProgress(
  enrollmentId: number | undefined,
): string[] {
  const snapshot = useSyncExternalStore(
    subscribeToPracticalWalkthroughProgress,
    () => getPracticalWalkthroughProgressSnapshot(enrollmentId),
    () => "",
  );

  return snapshot ? snapshot.split(",").filter(Boolean) : [];
}
