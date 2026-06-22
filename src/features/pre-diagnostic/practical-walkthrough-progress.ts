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
  lastActiveStepKey?: string;
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
      lastActiveStepKey:
        typeof parsed.lastActiveStepKey === "string" &&
        isPracticalWalkthroughStep(parsed.lastActiveStepKey)
          ? parsed.lastActiveStepKey
          : undefined,
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

export function getPracticalWalkthroughLastActiveStep(
  enrollmentId: number | undefined,
): string | null {
  if (enrollmentId == null) return null;
  return readStoredProgress(enrollmentId).lastActiveStepKey ?? null;
}

export function setPracticalWalkthroughLastActiveStep(
  enrollmentId: number | undefined,
  stepKey: string,
): void {
  if (enrollmentId == null || !isPracticalWalkthroughStep(stepKey)) return;

  const progress = readStoredProgress(enrollmentId);
  if (progress.lastActiveStepKey === stepKey) return;

  writeStoredProgress(enrollmentId, {
    ...progress,
    lastActiveStepKey: stepKey,
  });
}

export function getResumePracticalWalkthroughStep(
  enrollmentId: number | undefined,
  steps: PreDiagnosticStepsCompletedState | undefined,
  count: number,
  technologyUseCaseComplete: boolean,
): string | null {
  if (isPracticalWalkthroughGroupCompleteOnBackend(steps)) return null;

  const stepKeys = Array.from({ length: Math.max(count, 1) }, (_, index) =>
    buildPracticalWalkthroughStepKey(index),
  );

  const isStepIncomplete = (key: string) =>
    !isPracticalWalkthroughAsideStepComplete(enrollmentId, key, steps);

  const isStepLocked = (key: string) =>
    isPracticalWalkthroughAsideStepLocked(
      enrollmentId,
      key,
      steps,
      technologyUseCaseComplete,
    );

  const lastActiveStep = getPracticalWalkthroughLastActiveStep(enrollmentId);
  if (
    lastActiveStep &&
    stepKeys.includes(lastActiveStep) &&
    isStepIncomplete(lastActiveStep) &&
    !isStepLocked(lastActiveStep)
  ) {
    return lastActiveStep;
  }

  for (const stepKey of stepKeys) {
    if (!isStepLocked(stepKey) && isStepIncomplete(stepKey)) {
      return stepKey;
    }
  }

  return null;
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
    lastActiveStepKey: progress.lastActiveStepKey,
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
  if (enrollmentId == null) return "";
  const progress = readStoredProgress(enrollmentId);
  return `${progress.completedStepKeys.join(",")}|${progress.lastActiveStepKey ?? ""}`;
}

export function usePracticalWalkthroughProgress(
  enrollmentId: number | undefined,
): string[] {
  const snapshot = useSyncExternalStore(
    subscribeToPracticalWalkthroughProgress,
    () => getPracticalWalkthroughProgressSnapshot(enrollmentId),
    () => "",
  );

  if (!snapshot) return [];
  const [completedPart] = snapshot.split("|");
  return completedPart ? completedPart.split(",").filter(Boolean) : [];
}
