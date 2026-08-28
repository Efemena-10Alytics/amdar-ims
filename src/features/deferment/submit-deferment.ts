import { axiosInstance } from "@/lib/axios-instance";
import type {
  SubmitDefermentPayload,
  SubmitDefermentResponse,
} from "@/types/deferment";

export async function submitDefermentRequest(
  payload: SubmitDefermentPayload,
): Promise<SubmitDefermentResponse> {
  const {
    current_cohort_id,
    current_program_id,
    new_cohort_id,
    new_program_id,
    reason,
    discount_reason,
    file,
  } = payload;

  if (file) {
    const formData = new FormData();
    formData.append("current_cohort_id", String(current_cohort_id));
    formData.append("current_program_id", String(current_program_id));
    formData.append("new_cohort_id", String(new_cohort_id));
    formData.append("new_program_id", String(new_program_id));
    formData.append("reason", reason);
    if (discount_reason?.trim()) {
      formData.append("discount_reason", discount_reason.trim());
    }
    formData.append("file_1", file);

    const { data } = await axiosInstance.post<SubmitDefermentResponse>(
      "internships/deferments",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  }

  const { data } = await axiosInstance.post<SubmitDefermentResponse>(
    "internships/deferments",
    {
      current_cohort_id,
      current_program_id,
      new_cohort_id,
      new_program_id,
      reason,
      ...(discount_reason?.trim()
        ? { discount_reason: discount_reason.trim() }
        : {}),
    },
  );

  return data;
}
