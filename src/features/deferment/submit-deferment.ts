import { axiosInstance } from "@/lib/axios-instance";

export type DefermentFormPayload = {
  first_name: string;
  last_name: string;
  email: string;
  current_cohort_id: number;
  current_program_id: number;
  target_cohort_id: number;
  switch_program: boolean;
  aware_defer_once: boolean;
  reason: string;
};

export type SubmitDefermentResponse = {
  success: boolean;
  message: string;
};

export async function submitDefermentRequest(
  payload: DefermentFormPayload,
): Promise<SubmitDefermentResponse> {
  const { data } = await axiosInstance.post<SubmitDefermentResponse>(
    "v3/user/deferment",
    payload,
  );

  return data;
}
