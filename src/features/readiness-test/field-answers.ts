import type {
  ReadinessTestFieldSettings,
  ReadinessTestFormField,
  ReadinessTestUploadFieldSettings,
  ReadinessTestWordLimitFieldSettings,
} from "@/features/readiness-test/types";

export type ReadinessTestFieldAnswer = string | string[] | File | null;

export function getWordLimitSettings(
  settings: ReadinessTestFieldSettings,
): ReadinessTestWordLimitFieldSettings | null {
  if (
    typeof settings === "object" &&
    settings !== null &&
    "min_words" in settings &&
    "max_words" in settings
  ) {
    return settings as ReadinessTestWordLimitFieldSettings;
  }
  return null;
}

export function getUploadSettings(
  settings: ReadinessTestFieldSettings,
): ReadinessTestUploadFieldSettings | null {
  if (
    typeof settings === "object" &&
    settings !== null &&
    "allowed_types" in settings &&
    "size_limit_mb" in settings
  ) {
    return settings as ReadinessTestUploadFieldSettings;
  }
  return null;
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function isReadinessTestFieldAnswered(
  field: ReadinessTestFormField,
  answer: ReadinessTestFieldAnswer | undefined,
): boolean {
  if (!field.is_required) return true;

  if (field.type === "multiple_choice") {
    return Array.isArray(answer) && answer.length > 0;
  }

  if (field.type === "upload") {
    return answer instanceof File;
  }

  if (typeof answer !== "string" || !answer.trim()) return false;

  const wordLimits = getWordLimitSettings(field.settings);
  if (wordLimits) {
    const words = countWords(answer);
    return words >= wordLimits.min_words && words <= wordLimits.max_words;
  }

  return true;
}
