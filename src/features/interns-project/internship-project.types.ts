import type {
  ReadinessTestFieldSettings,
  ReadinessTestFieldType,
  ReadinessTestSubmitResultDataRaw,
} from "@/features/readiness-test/types";

export type InternProjectTool = {
  id: string;
  name: string;
  link: string;
  videoLink: string;
};

export enum InternProjectCareerStage {
  Uniformity = "uniformity",
  Formative = "formative",
  Transitional = "transitional",
  Emerging = "emerging",
  Collaborative = "collaborative",
  Professional = "professional",
}

export enum InternProjectStatus {
  Draft = "draft",
  Active = "active",
  Deactivated = "deactivated",
  Completed = "completed",
}

export type CreateInternProjectInput = {
  cohort_id: number | string;
  program_id: number | string;
  title: string;
  careerStage: InternProjectCareerStage;
  duration: string;
  startDate: string;
  endDate: string;
  summary: string;
  businessContext: string;
  purpose: string;
  expectedOutcomes: string;
  /** Filled on later steps via update */
  companyName?: string;
  industry?: string;
  companyOverview?: string;
  businessChallenge?: string;
  rationale?: string;
  projectObjectives?: string;
  inScope?: string;
  outOfScope?: string;
  tools?: InternProjectTool[];
  keyTakeaways?: string;
  closingNote?: string;
  projectPhases?: string;
  expectedDeliverables?: string;
  skills?: string[];
  coverPreview?: File | null;
  logoPreview?: File | null;
};

export type InternProject = {
  id: number;
  created_by: number;
  cohort_id: number;
  program_id: number;
  title: string;
  slug?: string | null;
  careerStage: InternProjectCareerStage;
  duration: string;
  startDate: string;
  endDate: string;
  summary: string;
  businessContext: string;
  purpose: string;
  expectedOutcomes: string;
  coverPreview: string | null;
  logoPreview: string | null;
  companyName: string;
  industry: string;
  companyOverview: string;
  businessChallenge: string;
  rationale: string;
  projectObjectives: string;
  inScope: string;
  outOfScope: string;
  tools: InternProjectTool[];
  keyTakeaways: string;
  closingNote: string;
  projectPhases?: string | null;
  expectedDeliverables?: string | null;
  skills?: string[] | null;
  status?: InternProjectStatus | null;
  created_at: string;
  updated_at: string;
};

/** @deprecated Prefer `InternProject` for GET responses. */
export type InternProjectData = InternProject;

export type CreateInternProjectResponse = {
  success: boolean;
  message: string;
  data: InternProject | null;
};

/** Partial payload for PUT /intern-projects/:id — only send fields being updated. */
export type UpdateInternProjectInput = Partial<CreateInternProjectInput>;

export type UpdateInternProjectResponse = CreateInternProjectResponse;

/** PATCH /intern-projects/:id/status */
export type ChangeInternProjectStatusValue =
  | InternProjectStatus.Draft
  | InternProjectStatus.Active
  | InternProjectStatus.Deactivated
  | InternProjectStatus.Completed;

export type ChangeInternProjectStatusInput = {
  status: ChangeInternProjectStatusValue;
};

export type ChangeInternProjectStatusResponse = CreateInternProjectResponse;

export type InternProjectsResponse = {
  success: boolean;
  message: string;
  data: InternProject[];
};

/** GET /intern-projects/:id */
export type InternProjectResponse = {
  success: boolean;
  message: string;
  data: InternProject | null;
};

/** GET /intern-projects/slug/:slug */
export type InternProjectBySlugResponse = InternProjectResponse;

export type InternProjectTodoContentType = "text" | "document" | "video";

export type InternProjectTodoSolutionFormat = "text" | "url" | "file";

export type CreateInternProjectTodoTypeInput = {
  contentType: InternProjectTodoContentType;
  description?: string;
  docName?: string;
  docUrl?: string;
  videoUrl?: string;
  submissionRequired: boolean;
  solutionFormat?:
    | InternProjectTodoSolutionFormat[]
    | InternProjectTodoSolutionFormat;
  sortOrder?: number;
};

export type CreateInternProjectTodoInput = {
  week: number;
  title: string;
  description: string;
  dayOfWeek: string;
  deadlineDate?: string;
  deadlineTime?: string;
  sortOrder?: number;
  types: CreateInternProjectTodoTypeInput[];
};

/** Partial payload for PUT /intern-projects/:id/todos/:todoId */
export type UpdateInternProjectTodoInput = Partial<CreateInternProjectTodoInput>;

export type InternProjectTodoType = {
  id: number;
  contentType: InternProjectTodoContentType;
  description: string | null;
  docName: string | null;
  docUrl: string | null;
  videoUrl: string | null;
  submissionRequired: boolean;
  solutionFormat:
    | InternProjectTodoSolutionFormat[]
    | InternProjectTodoSolutionFormat
    | null;
  sortOrder: number;
  created_at: string;
  updated_at: string;
};

export type InternProjectTodo = {
  id: number;
  intern_project_id: number;
  created_by: number | null;
  week: number;
  title: string;
  description: string;
  dayOfWeek: string;
  deadlineDate: string | null;
  deadlineTime: string | null;
  sortOrder: number;
  types: InternProjectTodoType[];
  submissionId?: number | null;
  submission?: { id: number } | null;
  latestSubmission?: { id: number } | null;
  submissions?: Array<{ id: number }> | null;
  created_at: string;
  updated_at: string;
};

export type CreateInternProjectTodoResponse = {
  success: boolean;
  message: string;
  data: InternProjectTodo | null;
};

/** GET /intern-projects/:id/todos */
export type InternProjectTodosResponse = {
  success: boolean;
  message: string;
  data: InternProjectTodo[];
};

/** GET /intern-projects/:id/todos/:todoId */
export type InternProjectTodoResponse = {
  success: boolean;
  message: string;
  data: InternProjectTodo | null;
};

/** PUT /intern-projects/:id/todos/:todoId */
export type UpdateInternProjectTodoResponse = InternProjectTodoResponse;

/** POST /intern-projects/:id/todos/:todoId/submissions */
export type InternProjectTodoSubmissionItem =
  | {
      type: "text";
      contentText: string;
      sortOrder: number;
    }
  | {
      type: "url";
      contentUrl: string;
      sortOrder: number;
    }
  | {
      type: "file";
      contentUrl: string;
      sortOrder: number;
    };

export type SubmitInternProjectTodoPayload = {
  items: InternProjectTodoSubmissionItem[];
};

/** PUT /intern-projects/:id/todos/:todoId/submissions */
export type EditInternProjectTodoSubmissionPayload = SubmitInternProjectTodoPayload;

export type InternProjectTodoSubmission = {
  id: number;
  intern_project_id?: number;
  intern_project_todo_id?: number;
  items?: InternProjectTodoSubmissionItem[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type SubmitInternProjectTodoResponse = {
  success: boolean;
  message: string;
  data: InternProjectTodoSubmission | null;
};

/** GET /intern-projects/:project/todos/:todo/submissions/:submission/comments */
export type InternProjectTodoSubmissionComment = {
  id: number;
  submissionId: number;
  specialistId: number;
  name: string;
  comment: string;
  created_at: string;
  updated_at: string;
};

export type InternProjectTodoSubmissionCommentsResponse = {
  success: boolean;
  message: string;
  data?:
    | InternProjectTodoSubmissionComment[]
    | { comments: InternProjectTodoSubmissionComment[] }
    | null;
  comments?: InternProjectTodoSubmissionComment[];
};

/** GET /intern-projects/:project/todos/:todo/submissions/me */
export type InternProjectTodoSubmissionSolutionItem = {
  id: number;
  type: InternProjectTodoSolutionFormat;
  contentText: string | null;
  contentUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
  mimeType: string | null;
  sortOrder: number;
  created_at: string;
  updated_at: string;
};

export type InternProjectTodoSubmissionFeedback = {
  id: number;
  name: string;
  comment: string;
  created_at: string;
};

export type MyInternProjectTodoSubmission = {
  id: number;
  internProjectTodoId: number;
  status: string;
  submittedAt: string;
  isLate: boolean;
  solution: InternProjectTodoSubmissionSolutionItem[];
  feedback: InternProjectTodoSubmissionFeedback[];
};

export type MyInternProjectTodoSubmissionResponse = {
  success: boolean;
  message: string;
  data: MyInternProjectTodoSubmission | null;
};

/** GET /intern-projects/:id/assessments/me */
export type ProjectAssessmentType = "pre" | "post";

/** Option as served to the intern taking the test — no `is_correct`, no `points`. */
export type ProjectAssessmentFieldOption = {
  id: number;
  form_field_id: number;
  label: string;
  order: number;
};

export type ProjectAssessmentField = {
  id: number;
  form_id: number;
  form_section_id: number | null;
  type: ReadinessTestFieldType;
  label: string;
  description: string | null;
  is_required: boolean;
  order: number;
  settings: ReadinessTestFieldSettings;
  options: ProjectAssessmentFieldOption[];
};

/**
 * What the intern picked on one question. `is_correct` reports whether their
 * answer earned the mark — the correct option is never sent.
 */
export type ProjectAssessmentAnswer = {
  field_id: number;
  option_ids: number[];
  /** Only set for free-text questions. */
  value: string | null;
  is_correct: boolean | null;
};

export type ProjectAssessmentSubmission = ReadinessTestSubmitResultDataRaw & {
  answers: ProjectAssessmentAnswer[];
};

export type ProjectAssessment = {
  id: number;
  title: string;
  description: string | null;
  /** Minutes, matching how every other form consumer reads this. */
  duration: number | null;
  question_count: number;
  max_score: number;
  max_attempts: number | null;
  attempts_used: number;
  can_attempt: boolean;
  is_locked: boolean;
  locked_reason: string | null;
  fields: ProjectAssessmentField[];
  my_latest_submission: ProjectAssessmentSubmission | null;
};

export type ProjectAssessments = {
  pre: ProjectAssessment | null;
  post: ProjectAssessment | null;
};

export type ProjectAssessmentsResponse = {
  success: boolean;
  message: string;
  data: ProjectAssessments | null;
};
