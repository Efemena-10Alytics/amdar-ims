export const CAREER_KNOWLEDGE_DISCOVERY_STEP_PREFIX = "career-knowledge-discovery-";

/** Enrollment step key used when the final discovery video is completed. */
export const CAREER_KNOWLEDGE_DISCOVERY_ENROLLMENT_STEP_KEY =
  "career-knowledge-discovery-2" as const;

const CAREER_KNOWLEDGE_DISCOVERY_STEP_PATTERN =
  /^career-knowledge-discovery-(\d+)$/;

export function buildCareerKnowledgeDiscoveryStepKey(index: number): string {
  return `${CAREER_KNOWLEDGE_DISCOVERY_STEP_PREFIX}${index + 1}`;
}

export function parseCareerKnowledgeDiscoveryStepNumber(
  step: string,
): number | null {
  const match = step.match(CAREER_KNOWLEDGE_DISCOVERY_STEP_PATTERN);
  if (!match) return null;

  const stepNumber = Number.parseInt(match[1], 10);
  return Number.isFinite(stepNumber) && stepNumber > 0 ? stepNumber : null;
}

export function isCareerKnowledgeDiscoveryStep(step: string): boolean {
  return CAREER_KNOWLEDGE_DISCOVERY_STEP_PATTERN.test(step);
}

export function getCareerKnowledgeDiscoveryStepKeys(count: number): string[] {
  const safeCount = Math.max(count, 1);
  return Array.from({ length: safeCount }, (_, index) =>
    buildCareerKnowledgeDiscoveryStepKey(index),
  );
}

export function getFirstCareerKnowledgeDiscoveryStepKey(count = 1): string {
  return buildCareerKnowledgeDiscoveryStepKey(0);
}

export function getLastCareerKnowledgeDiscoveryStepKey(count: number): string {
  return buildCareerKnowledgeDiscoveryStepKey(Math.max(count, 1) - 1);
}

export function getNextCareerKnowledgeDiscoveryStepKey(
  currentStepNumber: number,
  count: number,
): string | null {
  if (currentStepNumber >= count) return null;
  return buildCareerKnowledgeDiscoveryStepKey(currentStepNumber);
}

export function buildCareerKnowledgeDiscoveryHref(stepKey: string): string {
  return `/pre-diagnostic-test?step=${stepKey}`;
}

export function isLastCareerKnowledgeDiscoveryStep(
  stepNumber: number,
  count: number,
): boolean {
  return stepNumber === Math.max(count, 1);
}
