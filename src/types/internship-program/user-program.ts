export type UserProgramsResponse = {
  status: string;
  courses: UserProgramCourse[];
  userCohorts: UserCohort[];
};

export type UserProgramCourse = {
  id: number;
  thumbnail: string;
  slug: string;
  banner_image: string;
  title: string;
  company_name: string;
  about_company: string;
  internship_description: string;
  type: string;
  industry_name: string;
  level: string;
  mentor_count: number;
  created_at: string;
  updated_at: string;
  daily_motivation: unknown;
  video_url: string;
  intern_title: string;
  overviews: unknown;
  tools: unknown;
  brochure_url: unknown;
  activities?: UserProgramActivity[];
  tasks?: UserProgramTask[];
  modules?: UserProgramModule[];
};

export type UserProgramActivity = {
  id: number;
  internship_course_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  repeat: number;
  is_calendar: number;
  week_number: number;
  link?: string;
  active_from_date: string;
  is_published: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  tracked_by?: string;
  internship_project_id: number;
};

export type UserProgramTask = {
  id: number;
  internship_course_id: number;
  title: string;
  description?: string;
  type: string;
  resource_url?: string;
  created_at: string;
  updated_at: string;
  day_of_week: number;
  week_number: number;
  internship_project_id: number;
  task_text?: string;
  resource_urls?: UserProgramResourceUrl[];
  resource_files?: UserProgramResourceFile[];
  order: number;
  has_deliverable: boolean;
  has_quiz: boolean;
};

export type UserProgramResourceUrl = {
  name: string;
  url: string;
};

export type UserProgramResourceFile = {
  name: string;
  file: string;
};

export type UserProgramModule = {
  week: number;
  activities: UserProgramActivity[];
  tasks: UserProgramTask[];
};

export type UserCohort = {
  id: number;
  user_id: number;
  cohort_id: number;
  internship_course_id: number;
  status: string;
  joined_at: string;
  completed_at: unknown;
  dropped_at: unknown;
  notes: unknown;
  buddy_name?: string;
  is_verified_whatsapp: boolean;
  version: unknown;
  is_onboarding_steps_completed?: UserCohortOnboardingSteps;
  is_pre_diagnostic_steps_completed?: UserCohortPreDiagnosticSteps;
  created_at: string;
  updated_at: string;
  program: UserCohortProgram;
  cohort: UserCohortCohort;
};

export type UserCohortOnboardingSteps = {
  orientationVideo?: unknown;
  internshipStructureVideo?: unknown;
  meetCohortLead?: unknown;
  rulesAndEtiquettes?: unknown;
  installationVideo?: unknown;
  readinessTest?: unknown;
};

export type UserCohortPreDiagnosticSteps = {
  carrerReadiness?: {
    welcomeVideo?: unknown;
    careerKnowledgeDiscovery?: unknown;
    CareerPathDiagnostic?: unknown;
  };
  TechnologyDiagnostic?: {
    technologyUseCase?: unknown;
    practicalWalkthrough?: unknown;
    TechnologyDiagnostic?: unknown;
  };
  imsProcess?: {
    HowTheImsWorks?: unknown;
    imsProcessDiagnostic?: unknown;
  };
};

export type UserCohortProgram = {
  id: number;
  thumbnail: string;
  slug: string;
  banner_image: string;
  title: string;
  company_name: string;
  about_company: string;
  internship_description: string;
  type: string;
  industry_name: string;
  level: string;
  mentor_count: number;
  created_at: string;
  updated_at: string;
  daily_motivation: unknown;
  video_url: string;
  intern_title: string;
  overviews: unknown;
  tools: unknown;
  brochure_url: unknown;
};

export type UserCohortCohort = {
  id: number;
  name: string;
  month: string;
  year: string;
  start_date: string;
  end_date: string;
  active_week: number;
  status: string;
  created_at: string;
  updated_at: string;
  duration: number;
};

export function pickProgramId(
  item: Pick<UserCohort, "internship_course_id" | "program">,
): number | null {
  if (typeof item.program?.id === "number" && Number.isFinite(item.program.id)) {
    return item.program.id;
  }
  if (
    typeof item.internship_course_id === "number" &&
    Number.isFinite(item.internship_course_id)
  ) {
    return item.internship_course_id;
  }
  return null;
}

export function pickCohortId(
  item: Pick<UserCohort, "cohort_id" | "cohort">,
): number | null {
  if (typeof item.cohort_id === "number" && Number.isFinite(item.cohort_id)) {
    return item.cohort_id;
  }
  if (typeof item.cohort?.id === "number" && Number.isFinite(item.cohort.id)) {
    return item.cohort.id;
  }
  return null;
}

export function getUserProgramTitle(
  item: Pick<UserCohort, "program">,
): string {
  return item.program?.title?.trim() || "Program";
}

export function getUserCohortLabel(
  item: Pick<UserCohort, "cohort">,
): string {
  const cohort = item.cohort;
  const name = cohort?.name?.trim();
  const year = cohort?.year?.trim();
  const month = cohort?.month?.trim();

  if (name) {
    if (year && !name.includes(year)) {
      return `${name} · ${year}`;
    }
    return name;
  }

  const monthYear = [month, year].filter(Boolean).join(" ");
  return monthYear || "Cohort";
}

export function getEnrollmentSelection(item: UserCohort) {
  return {
    enrollmentId: item.id,
    programId: pickProgramId(item),
    cohortId: pickCohortId(item),
  };
}

export function normalizeUserProgramsResponse(
  data: UserProgramsResponse | null | undefined,
): UserProgramsResponse {
  return {
    status: data?.status ?? "",
    courses: Array.isArray(data?.courses) ? data.courses : [],
    userCohorts: Array.isArray(data?.userCohorts) ? data.userCohorts : [],
  };
}
