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
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
  program: EnrollmentProgram;
  cohort: EnrollmentCohort;
};

export type UserEnrollmentApiResponse = {
  success: boolean;
  message: string;
  data: UserEnrollment;
};
