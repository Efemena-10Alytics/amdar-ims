import type { WeeklySurveyAnswers, WeeklySurveyPeriod, WeeklySurveyQuestion, WeeklySurveySection } from "./types";

const SCALE_RATING_LABELS = ["Very poor", "Poor", "Average", "Good", "Excellent"];

export function getScaleLabel(n: number, min: number, max: number): string {
  if (max === min) return SCALE_RATING_LABELS[0];
  const idx = Math.round(((n - min) / (max - min)) * (SCALE_RATING_LABELS.length - 1));
  return SCALE_RATING_LABELS[idx] ?? String(n);
}

export function getByPath(obj: unknown, dotted: string): unknown {
  const parts = dotted.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export function setByPath(
  obj: WeeklySurveyAnswers,
  dotted: string,
  value: unknown,
): WeeklySurveyAnswers {
  const parts = dotted.split(".");
  const next: Record<string, unknown> = { ...obj };
  let cur = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const prev = cur[p];
    cur[p] =
      prev && typeof prev === "object" && !Array.isArray(prev)
        ? { ...(prev as Record<string, unknown>) }
        : {};
    cur = cur[p] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
  return next;
}

export function matchesShowWhen(
  showWhen: Record<string, unknown> | undefined,
  answers: WeeklySurveyAnswers,
): boolean {
  if (!showWhen) return true;
  return Object.entries(showWhen).every(([k, v]) => getByPath(answers, k) === v);
}

export function getVisibleQuestions(
  section: WeeklySurveySection | undefined,
  answers: WeeklySurveyAnswers,
): WeeklySurveyQuestion[] {
  if (!section?.questions?.length) return [];
  return section.questions.filter(
    (q) => !q.show_when || matchesShowWhen(q.show_when, answers),
  );
}

export function followUpRequired(
  question: WeeklySurveyQuestion,
  answers: WeeklySurveyAnswers,
): boolean {
  const fu = question.follow_up;
  if (!fu) return false;
  const parentVal = getByPath(answers, question.key);
  if (question.type === "scale") {
    const n = Number(parentVal);
    const max = question.max ?? 5;
    return !Number.isNaN(n) && n >= 1 && n < max;
  }
  if (question.type === "multi_select") {
    const selected = Array.isArray(parentVal) ? (parentVal as unknown[]) : [];
    if (fu.when_any) return fu.when_any.some((w) => selected.includes(w));
    if (fu.when !== undefined) return selected.includes(fu.when);
    return false;
  }
  if (fu.when_any) return fu.when_any.includes(parentVal);
  return parentVal === fu.when;
}

export function validateStep(
  question: WeeklySurveyQuestion,
  answers: WeeklySurveyAnswers,
): boolean {
  const val = getByPath(answers, question.key);
  if (question.type === "text" && question.required === false) {
    if (followUpRequired(question, answers)) {
      const t = getByPath(answers, question.follow_up!.key);
      return !!(t && String(t).trim());
    }
    return true;
  }
  if (question.type === "multi_select") {
    if (!Array.isArray(val) || val.length === 0) return false;
    if (followUpRequired(question, answers)) {
      const t = getByPath(answers, question.follow_up!.key);
      if (String(t ?? "").trim().length < 150) return false;
    }
    return true;
  }
  if (val === undefined || val === null || val === "") return false;
  if (question.type === "scale") {
    const n = Number(val);
    const min = question.min ?? 1;
    const max = question.max ?? 5;
    if (!(n >= min && n <= max)) return false;
    if (followUpRequired(question, answers)) {
      const t = getByPath(answers, question.follow_up!.key);
      if (String(t ?? "").trim().length < 150) return false;
    }
    return true;
  }
  if (followUpRequired(question, answers)) {
    const t = getByPath(answers, question.follow_up!.key);
    if (!t || !String(t).trim()) return false;
  }
  return true;
}

export function validateSectionQuestions(
  section: WeeklySurveySection,
  answers: WeeklySurveyAnswers,
): boolean {
  return getVisibleQuestions(section, answers).every((q) => validateStep(q, answers));
}

export function getMainFieldError(
  question: WeeklySurveyQuestion,
  answers: WeeklySurveyAnswers,
): string | null {
  if (validateStep(question, answers)) return null;

  const val = getByPath(answers, question.key);

  if (question.type === "text" && question.required === false) {
    return null;
  }

  if (question.type === "multi_select") {
    return "Please select at least one option";
  }

  if (val === undefined || val === null || val === "") {
    return "This field is required";
  }

  if (question.type === "scale") {
    const n = Number(val);
    const min = question.min ?? 1;
    const max = question.max ?? 5;
    if (Number.isNaN(n) || n < min || n > max) {
      return "Please select a rating";
    }
  }

  return null;
}

export function getFollowUpFieldError(
  question: WeeklySurveyQuestion,
  answers: WeeklySurveyAnswers,
): string | null {
  const fu = question.follow_up;
  if (!fu || fu.type !== "text") return null;
  if (!followUpRequired(question, answers)) return null;
  if (validateStep(question, answers)) return null;
  const t = getByPath(answers, fu.key);
  if (question.type === "scale" || question.type === "multi_select") {
    const len = String(t ?? "").trim().length;
    if (len === 0) return "This field is required";
    return `Please enter at least 150 characters (${150 - len} more needed)`;
  }
  if (!t || !String(t).trim()) return "This field is required";
  return null;
}

/** Prunes conditional follow-up fields that shouldn't apply and shapes the final submit payload. */
export function buildSubmitAnswers(answers: WeeklySurveyAnswers): Record<string, unknown> {
  const s2 = (answers.section_2 as Record<string, unknown>) || {};
  const s3 = (answers.section_3 as Record<string, unknown>) || {};
  const s4 = (answers.section_4 as Record<string, unknown>) || {};
  const s5 = (answers.section_5 as Record<string, unknown>) || {};

  const scaleReason = (rating: unknown, reason: unknown, max = 5) =>
    rating != null && Number(rating) < max ? (reason ?? null) : null;

  const out: Record<string, Record<string, unknown>> = {
    section_2: {
      project_work: s2.project_work,
      blockers_encountered: s2.blockers_encountered,
      blockers_description:
        s2.blockers_encountered === "yes" ? (s2.blockers_description ?? null) : null,
      task_clarity: s2.task_clarity,
      drop_in_session_rating: s2.drop_in_session_rating,
      drop_in_session_rating_reason: scaleReason(
        s2.drop_in_session_rating,
        s2.drop_in_session_rating_reason,
      ),
    },
    section_3: {
      mentor_support_rating: s3.mentor_support_rating,
      mentor_rating_reason: scaleReason(s3.mentor_support_rating, s3.mentor_rating_reason),
    },
    section_4: {
      mentorship_attended: s4.mentorship_attended,
      session_usefulness:
        s4.mentorship_attended === "yes" ? (s4.session_usefulness ?? null) : null,
      employability_help_needed: s4.employability_help_needed ?? [],
      employability_help_others_text:
        Array.isArray(s4.employability_help_needed) &&
        (s4.employability_help_needed as unknown[]).includes("others")
          ? (s4.employability_help_others_text ?? null)
          : null,
    },
    section_5: {
      lms_technical_issues: s5.lms_technical_issues,
      lms_issue_description:
        s5.lms_technical_issues === "frequently" || s5.lms_technical_issues === "occasionally"
          ? (s5.lms_issue_description ?? null)
          : null,
      communication_effectiveness: s5.communication_effectiveness,
      overall_experience_rating: s5.overall_experience_rating,
    },
  };

  const extra = s5.additional_support_suggestions;
  if (extra != null && String(extra).trim() !== "") {
    out.section_5.additional_support_suggestions = String(extra).slice(0, 5000);
  }

  return out;
}

export function formatPeriodRange(period: WeeklySurveyPeriod | null | undefined): string | null {
  if (!period?.period_start || !period?.period_ends_at) return null;
  try {
    const a = new Date(period.period_start);
    const b = new Date(period.period_ends_at);
    return `${a.toLocaleDateString()} – ${b.toLocaleDateString()}`;
  } catch {
    return null;
  }
}
