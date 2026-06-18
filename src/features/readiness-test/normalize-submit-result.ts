import { getReadinessScoreProgressPercent } from "@/features/readiness-test/get-readiness-score-tier";
import type {
  ReadinessTestSubmitResultData,
  ReadinessTestSubmitResultDataRaw,
} from "@/features/readiness-test/types";

function parseScoreValue(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function normalizeReadinessSubmitResultData(
  raw: ReadinessTestSubmitResultDataRaw,
): ReadinessTestSubmitResultData {
  const total_score = parseScoreValue(raw.total_score);
  const hasPercentageScore =
    raw.percentage_score !== undefined && raw.percentage_score !== null;

  return {
    submission_id: raw.submission_id,
    attempt_number: raw.attempt_number,
    total_score,
    percentage_score: hasPercentageScore
      ? parseScoreValue(raw.percentage_score)
      : getReadinessScoreProgressPercent(total_score),
    passed: raw.passed ?? null,
    submitted_at: raw.submitted_at,
  };
}
