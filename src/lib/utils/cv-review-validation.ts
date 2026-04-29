import type { CVReviewFormState } from "@/features/cv-review/types";

const COHORT_REGEX =
  /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateCohortFormat(cohort: string): boolean {
  return COHORT_REGEX.test(cohort.trim());
}

export function validateCVFile(file: File): string | null {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(ext) && !ACCEPTED_MIME_TYPES.includes(file.type)) {
    return "Only PDF or DOCX files are accepted.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size must be under 10 MB (current: ${(file.size / 1024 / 1024).toFixed(2)} MB).`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function buildCVFormData(state: CVReviewFormState): FormData {
  const fd = new FormData();

  fd.append("email", state.email.trim());
  fd.append("name", state.name.trim());
  if (state.phone.trim()) fd.append("phone", state.phone.trim());

  const internshipValue =
    state.internship === "Other" && state.internship_other.trim()
      ? "Other"
      : state.internship;
  fd.append("internship", internshipValue);
  if (state.internship === "Other" && state.internship_other.trim()) {
    fd.append("internship_other", state.internship_other.trim());
  }

  fd.append("cohort", state.cohort);
  fd.append("linkedin", state.linkedin.trim());
  if (state.github.trim()) fd.append("github", state.github.trim());

  const roleValue =
    state.target_role === "Other" && state.target_role_other.trim()
      ? "Other"
      : state.target_role;
  fd.append("target_role", roleValue);
  if (state.target_role === "Other" && state.target_role_other.trim()) {
    fd.append("target_role_other", state.target_role_other.trim());
  }

  fd.append("industry_tailoring", state.industry_tailoring as string);
  if (state.industry_tailoring === "Yes" && state.industry_specialization.trim()) {
    fd.append("industry_specialization", state.industry_specialization.trim());
  }

  if (state.cv_file) {
    fd.append("cv_file", state.cv_file);
  }

  return fd;
}

export interface ClientValidationErrors {
  [field: string]: string;
}

export function validateCVReviewForm(
  state: CVReviewFormState,
): ClientValidationErrors {
  const errors: ClientValidationErrors = {};

  if (!state.name.trim()) errors.name = "Full name is required.";
  if (!state.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!state.internship) errors.internship = "Please select an internship.";
  if (state.internship === "Other" && !state.internship_other.trim()) {
    errors.internship_other = "Please specify your internship.";
  }
  if (!state.cohort) {
    errors.cohort = "Please select a cohort.";
  } else if (!validateCohortFormat(state.cohort)) {
    errors.cohort = 'Cohort must be in format "Month YYYY" (e.g. "May 2025").';
  }
  if (!state.linkedin.trim()) errors.linkedin = "LinkedIn URL is required.";
  if (!state.target_role) errors.target_role = "Please select a target role.";
  if (state.target_role === "Other" && !state.target_role_other.trim()) {
    errors.target_role_other = "Please specify your target role.";
  }
  if (!state.industry_tailoring) {
    errors.industry_tailoring = "Please indicate if you want industry tailoring.";
  }
  if (!state.cv_file) {
    errors.cv_file = "Please upload your CV file.";
  } else {
    const fileError = validateCVFile(state.cv_file);
    if (fileError) errors.cv_file = fileError;
  }

  return errors;
}
