import type { CheckoutCohort } from "@/types/payment";

export type DefermentProgram = {
  id: number;
  title: string;
  slug?: string;
};

export type DefermentProgramsApiResponse = {
  success?: boolean;
  message?: string;
  data?: DefermentProgram[];
  programs?: DefermentProgram[];
};

export type DefermentCohortsApiResponse = {
  success?: boolean;
  message?: string;
  data?: CheckoutCohort[];
  cohorts?: CheckoutCohort[];
};

export type SubmitDefermentPayload = {
  current_cohort_id: number;
  current_program_id: number;
  new_cohort_id: number;
  new_program_id: number;
  reason: string;
  discount_reason?: string;
  file?: File | null;
};

export type SubmitDefermentResponse = {
  success?: boolean;
  message?: string;
};
