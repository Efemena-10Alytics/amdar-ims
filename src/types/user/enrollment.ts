export type EnrollmentStepStatus = "pending" | "completed";

export type EnrollmentProgram = {
  id: number;
  thumbnail: string | null;
  banner_image: string | null;
  title: string;
  company_name: string | null;
  about_company: string | null;
  internship_description: string | null;
  type: string | null;
  industry_name: string | null;
  level: string | null;
  mentor_count: number | null;
  daily_motivation: string | null;
  video_url: string | null;
  intern_title: string | null;
  /** Some API responses use this key instead of `intern_title`. */
  internship_title?: string | null;
  overviews: unknown;
  tools: unknown;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type EnrollmentCohort = {
  id: number;
  name: string;
  month: string | null;
  year: string | null;
  start_date: string;
  end_date: string | null;
  active_week: number | null;
  status: string;
  duration: number;
  version?: string | number | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingEnrollmentStepKey =
  | "orientationVideo"
  | "internshipStructureVideo"
  | "meetCohortLead"
  | "rulesAndEtiquettes"
  | "installationVideo"
  | "readinessTest";

export type OnboardingStepsCompletedState = Record<
  OnboardingEnrollmentStepKey,
  EnrollmentStepStatus
>;

/** API field name (typo preserved) */
export type PreDiagnosticCareerReadinessStepKey =
  | "welcomeVideo"
  | "careerKnowledgeDiscovery"
  | "CareerPathDiagnostic";

export type PreDiagnosticCareerReadinessSteps = Record<
  PreDiagnosticCareerReadinessStepKey,
  EnrollmentStepStatus
>;

export type PreDiagnosticTechnologyReadinessStepKey =
  | "technologyUseCase"
  | "practicalWalkthrough"
  | "TechnologyDiagnostic";

export type PreDiagnosticTechnologyReadinessSteps = Record<
  PreDiagnosticTechnologyReadinessStepKey,
  EnrollmentStepStatus
>;

export type PreDiagnosticImsProcessStepKey =
  | "HowTheImsWorks"
  | "imsProcessDiagnostic";

export type PreDiagnosticImsProcessSteps = Record<
  PreDiagnosticImsProcessStepKey,
  EnrollmentStepStatus
>;

export type PreDiagnosticStepsCompletedState = {
  /** API field name (typo preserved) */
  carrerReadiness: PreDiagnosticCareerReadinessSteps;
  TechnologyDiagnostic: PreDiagnosticTechnologyReadinessSteps;
  imsProcess: PreDiagnosticImsProcessSteps;
};

export type PreDiagnosticStepsCompletedUpdate = {
  carrerReadiness?: Partial<PreDiagnosticCareerReadinessSteps>;
  TechnologyDiagnostic?: Partial<PreDiagnosticTechnologyReadinessSteps>;
  imsProcess?: Partial<PreDiagnosticImsProcessSteps>;
};

export type UserEnrollment = {
  id: number;
  user_id: number;
  cohort_id: number;
  internship_course_id: number;
  program_id: number;
  status: string;
  joined_at: string;
  completed_at: string | null;
  dropped_at: string | null;
  notes: string | null;
  buddy_name: string | null;
  /** Present on some API responses when not nested under `cohort` */
  version?: string | number | null;
  created_at: string;
  updated_at: string;
  program: EnrollmentProgram;
  cohort: EnrollmentCohort;
  isOnboardingStepsCompleted: OnboardingStepsCompletedState;
  isPreDiagnosticStepsCompleted: PreDiagnosticStepsCompletedState;
};

export type UserEnrollmentApiResponse = {
  success: boolean;
  message: string;
  data: UserEnrollment;
};

export type OnboardingStepsCompleted = Partial<
  Record<OnboardingEnrollmentStepKey, EnrollmentStepStatus>
>;

/** @deprecated Use `EnrollmentStepStatus` */
export type OnboardingStepCompletionStatus = EnrollmentStepStatus;

export type UpdateEnrollmentStepsPayload = {
  isOnboardingStepsCompleted?: OnboardingStepsCompleted;
  isPreDiagnosticStepsCompleted?: PreDiagnosticStepsCompletedUpdate;
};

export type UpdateEnrollmentStepsResponse = {
  success: boolean;
  message: string;
  data: UserEnrollment;
};
