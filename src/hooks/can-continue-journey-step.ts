/** When a journey step is already completed, Continue stays enabled. */
export function canContinueJourneyStep(
  requirementsMet: boolean,
  isStepCompleted: boolean,
  isUpdating = false,
): boolean {
  if (isStepCompleted) return true;
  return requirementsMet && !isUpdating;
}

/** Skip the completion PUT when the step is already marked completed. */
export function shouldMarkJourneyStepComplete(isStepCompleted: boolean): boolean {
  return !isStepCompleted;
}
