import type { ReadinessTestFieldAnswer } from "@/features/readiness-test/field-answers";
import { getSortedReadinessTestFields } from "@/features/readiness-test/get-sorted-form-fields";
import type {
  ReadinessTestForm,
  ReadinessTestFormField,
  ReadinessTestSubmitAnswer,
  ReadinessTestSubmitAnswerValue,
  ReadinessTestSubmitPayload,
  ReadinessTestSubmitUploadFile,
} from "@/features/readiness-test/types";

function findOptionIdByLabel(field: ReadinessTestFormField, label: string) {
  return field.options.find((option) => option.label === label)?.id ?? null;
}

function buildFieldSubmitValue(
  field: ReadinessTestFormField,
  answer: ReadinessTestFieldAnswer | ReadinessTestSubmitUploadFile[] | undefined,
): ReadinessTestSubmitAnswerValue | null {
  if (answer == null || answer === "") return null;

  if (field.type === "single_choice" || field.type === "dropdown") {
    if (typeof answer !== "string") return null;
    const optionId = findOptionIdByLabel(field, answer);
    return optionId != null ? { option_id: optionId } : null;
  }

  if (field.type === "multiple_choice") {
    if (!Array.isArray(answer)) return null;

    const selectedLabels = answer.filter(
      (item): item is string => typeof item === "string",
    );
    if (selectedLabels.length !== answer.length) return null;

    const optionIds = selectedLabels
      .map((label) => findOptionIdByLabel(field, label))
      .filter((optionId): optionId is number => optionId != null);

    return optionIds.length ? { option_ids: optionIds } : null;
  }

  if (field.type === "upload") {
    if (!Array.isArray(answer) || answer.length === 0) return null;
    return answer as ReadinessTestSubmitUploadFile[];
  }

  if (typeof answer === "string") return answer;

  return null;
}

export function buildFormSubmitPayload(
  form: ReadinessTestForm,
  answers: Record<string, ReadinessTestFieldAnswer>,
  uploadAnswers: Record<number, ReadinessTestSubmitUploadFile[]> = {},
): ReadinessTestSubmitPayload {
  const submitAnswers: ReadinessTestSubmitAnswer[] = [];

  for (const field of getSortedReadinessTestFields(form)) {
    const rawAnswer =
      field.type === "upload"
        ? uploadAnswers[field.id]
        : answers[String(field.id)];

    const value = buildFieldSubmitValue(field, rawAnswer);
    if (value == null) continue;

    submitAnswers.push({
      field_id: field.id,
      value,
    });
  }

  return { answers: submitAnswers };
}
