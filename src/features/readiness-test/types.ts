export type ReadinessTestContextType = "readiness_test" | (string & {});

export type ReadinessTestFieldType =
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "short_answer"
  | "long_answer"
  | "single_text"
  | "phone"
  | "url"
  | "calendar"
  | "upload"
  | "time";

export type ReadinessTestOptionCondition =
  | "correct_answer"
  | "points"
  | "none";

export type ReadinessTestFieldOption = {
  id: number;
  form_field_id: number;
  label: string;
  points: number | null;
  is_correct: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export type ReadinessTestChoiceFieldSettings = {
  option_condition: ReadinessTestOptionCondition;
};

export type ReadinessTestWordLimitFieldSettings = {
  min_words: number;
  max_words: number;
};

export type ReadinessTestLocationFieldSettings = {
  location: string;
};

export type ReadinessTestDateFieldSettings = {
  date_format: string;
};

export type ReadinessTestUploadFieldSettings = {
  size_limit_mb: number;
  allowed_types: string[];
};

export type ReadinessTestFieldSettings =
  | ReadinessTestChoiceFieldSettings
  | ReadinessTestWordLimitFieldSettings
  | ReadinessTestLocationFieldSettings
  | ReadinessTestDateFieldSettings
  | ReadinessTestUploadFieldSettings
  | Record<string, unknown>;

export type ReadinessTestFormField = {
  id: number;
  form_id: number;
  form_section_id: number | null;
  type: ReadinessTestFieldType;
  label: string;
  description: string | null;
  is_required: boolean;
  order: number;
  settings: ReadinessTestFieldSettings;
  created_at: string;
  updated_at: string;
  options: ReadinessTestFieldOption[];
};

export type ReadinessTestFormSection = {
  id: number;
  form_id: number;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
};

/** Shared dynamic form payload for readiness/diagnostic assessments. */
export type ReadinessTestForm = {
  id: number;
  created_by: number;
  title: string;
  description: string | null;
  context_type: ReadinessTestContextType;
  context_type_id: number;
  cohort_id: number;
  program_id: number;
  passing_score: number | null;
  max_attempts: number;
  duration: number | null;
  guidelines: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  sections: ReadinessTestFormSection[];
  fields: ReadinessTestFormField[];
};

export type ReadinessTestFormApiResponse = {
  success: boolean;
  message: string;
  data: ReadinessTestForm | null;
};

export type ReadinessTestSubmitUploadFile = {
  name: string;
  key: string;
  url: string;
};

export type ReadinessTestSubmitAnswerValue =
  | { option_id: number }
  | { option_ids: number[] }
  | string
  | ReadinessTestSubmitUploadFile[];

export type ReadinessTestSubmitAnswer = {
  field_id: number;
  value: ReadinessTestSubmitAnswerValue;
};

export type ReadinessTestSubmitPayload = {
  answers: ReadinessTestSubmitAnswer[];
};

export type ReadinessTestSubmitResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};
