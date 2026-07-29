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
  solutionFormat?: InternProjectTodoSolutionFormat;
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
  solutionFormat: InternProjectTodoSolutionFormat | null;
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
