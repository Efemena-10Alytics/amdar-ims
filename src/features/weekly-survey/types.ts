export type WeeklySurveyQuestionType =
  | "single_choice"
  | "yes_no"
  | "scale"
  | "multi_select"
  | "text";

export type WeeklySurveyOption = {
  value: string;
  label: string;
};

export type WeeklySurveyFollowUp = {
  key: string;
  type: "text";
  placeholder?: string;
  required?: boolean;
  when?: unknown;
  when_any?: unknown[];
  /** Present on some backend definitions (e.g. "others" in a multi_select) but not
   *  consumed by client validation — that case is handled by a dedicated fallback
   *  in the multi_select field renderer instead. Kept here for type fidelity. */
  when_includes?: unknown;
  when_max?: number;
};

export type WeeklySurveyQuestion = {
  key: string;
  text: string;
  type: WeeklySurveyQuestionType;
  required?: boolean;
  min?: number;
  max?: number;
  hint?: string;
  placeholder?: string;
  options?: WeeklySurveyOption[];
  show_when?: Record<string, unknown>;
  follow_up?: WeeklySurveyFollowUp;
};

export type WeeklySurveySection = {
  id: number;
  title: string;
  questions: WeeklySurveyQuestion[];
};

export type WeeklySurveyPeriod = {
  period_start: string;
  period_ends_at: string;
};

export type WeeklySurveyQuestionsData = {
  version: number;
  sections: WeeklySurveySection[];
  period: WeeklySurveyPeriod | null;
};

export type WeeklySurveyQuestionsResponse = {
  data: WeeklySurveyQuestionsData;
};

export type WeeklySurveyStatusData = {
  submitted: boolean;
  submitted_at: string | null;
};

/** Unlike `questions`/`submit`, this endpoint returns the bare status object — no `data` wrapper. */
export type WeeklySurveyStatusResponse = WeeklySurveyStatusData;

/** Nested map keyed by section (e.g. `section_2`), values keyed by question key. */
export type WeeklySurveyAnswers = Record<string, unknown>;

export type WeeklySurveySubmitPayload = {
  cohort_id: number;
  internship_course_id: number;
  answers: Record<string, unknown>;
};

/** The submission model, returned bare under `data` on success (201) — no `success`/`message`. */
export type WeeklySurveySubmitResponse = {
  data?: unknown;
};
