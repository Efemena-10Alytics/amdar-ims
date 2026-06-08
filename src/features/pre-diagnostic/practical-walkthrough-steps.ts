export const PRACTICAL_WALKTHROUGH_STEP_PREFIX = "practical-walkthrough-";

/** Enrollment step key used when the final walkthrough video is completed. */
export const PRACTICAL_WALKTHROUGH_ENROLLMENT_STEP_KEY =
  "practical-walkthrough-2" as const;

const PRACTICAL_WALKTHROUGH_STEP_PATTERN = /^practical-walkthrough-(\d+)$/;

export function buildPracticalWalkthroughStepKey(index: number): string {
  return `${PRACTICAL_WALKTHROUGH_STEP_PREFIX}${index + 1}`;
}

export function parsePracticalWalkthroughStepNumber(step: string): number | null {
  const match = step.match(PRACTICAL_WALKTHROUGH_STEP_PATTERN);
  if (!match) return null;

  const stepNumber = Number.parseInt(match[1], 10);
  return Number.isFinite(stepNumber) && stepNumber > 0 ? stepNumber : null;
}

export function isPracticalWalkthroughStep(step: string): boolean {
  return PRACTICAL_WALKTHROUGH_STEP_PATTERN.test(step);
}

export function getPracticalWalkthroughStepKeys(count: number): string[] {
  const safeCount = Math.max(count, 1);
  return Array.from({ length: safeCount }, (_, index) =>
    buildPracticalWalkthroughStepKey(index),
  );
}

export function getFirstPracticalWalkthroughStepKey(count = 1): string {
  return buildPracticalWalkthroughStepKey(0);
}

export function getLastPracticalWalkthroughStepKey(count: number): string {
  return buildPracticalWalkthroughStepKey(Math.max(count, 1) - 1);
}

export function getNextPracticalWalkthroughStepKey(
  currentStepNumber: number,
  count: number,
): string | null {
  if (currentStepNumber >= count) return null;
  return buildPracticalWalkthroughStepKey(currentStepNumber);
}

export function buildPracticalWalkthroughHref(stepKey: string): string {
  return `/pre-diagnostic-test/technology-readiness?step=${stepKey}`;
}

export function isLastPracticalWalkthroughStep(
  stepNumber: number,
  count: number,
): boolean {
  return stepNumber === Math.max(count, 1);
}
