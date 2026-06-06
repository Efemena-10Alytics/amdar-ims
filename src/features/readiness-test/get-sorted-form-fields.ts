import type {
  ReadinessTestForm,
  ReadinessTestFormField,
} from "@/features/readiness-test/types";

export function getSortedReadinessTestFields(
  form: ReadinessTestForm | null | undefined,
): ReadinessTestFormField[] {
  if (!form?.fields?.length) return [];
  return [...form.fields].sort((a, b) => a.order - b.order);
}
