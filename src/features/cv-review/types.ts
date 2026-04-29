export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface ConfigData {
  internships: string[];
  roles: string[];
  cohorts: string[];
}

export interface CVReviewFormState {
  email: string;
  name: string;
  phone: string;
  internship: string;
  internship_other: string;
  cohort: string;
  linkedin: string;
  github: string;
  target_role: string;
  target_role_other: string;
  industry_tailoring: "Yes" | "No" | "";
  industry_specialization: string;
  cv_file: File | null;
}

export interface SubmissionResponse {
  name: string;
  email: string;
  target_role: string;
}

export const defaultCVReviewFormState: CVReviewFormState = {
  email: "",
  name: "",
  phone: "",
  internship: "",
  internship_other: "",
  cohort: "",
  linkedin: "",
  github: "",
  target_role: "",
  target_role_other: "",
  industry_tailoring: "",
  industry_specialization: "",
  cv_file: null,
};
