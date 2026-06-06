import type {
  ReadinessTestFieldType,
  ReadinessTestForm,
  ReadinessTestFormField,
} from "@/features/readiness-test/types";

/** Field types skipped in the readiness/diagnostic quiz flow. */
export const EXCLUDED_READINESS_TEST_FIELD_TYPES = new Set<ReadinessTestFieldType>([
  "upload",
]);

export function getSortedReadinessTestFields(
  form: ReadinessTestForm | null | undefined,
): ReadinessTestFormField[] {
  if (!form?.fields?.length) return [];
  return [...form.fields]
    .filter((field) => !EXCLUDED_READINESS_TEST_FIELD_TYPES.has(field.type))
    .sort((a, b) => a.order - b.order);
}
