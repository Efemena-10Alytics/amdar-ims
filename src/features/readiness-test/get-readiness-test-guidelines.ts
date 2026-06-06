import type { ReadinessTestForm } from "@/features/readiness-test/types";

export function getReadinessTestGuidelines(
  guidelines: ReadinessTestForm["guidelines"] | string[] | unknown,
  fallback: string[],
): string[] {
  if (Array.isArray(guidelines)) {
    return guidelines.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
  }

  if (typeof guidelines === "string" && guidelines.trim()) {
    return guidelines.split("\n").filter(Boolean);
  }

  return fallback;
}
