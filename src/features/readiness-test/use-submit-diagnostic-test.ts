import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import type {
  ReadinessTestSubmitPayload,
  ReadinessTestSubmitResponse,
} from "@/features/readiness-test/types";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to submit form.";
}

export async function submitDiagnosticTest(
  formId: string | number,
  payload: ReadinessTestSubmitPayload,
): Promise<ReadinessTestSubmitResponse> {
  const { data } = await axiosInstance.post<ReadinessTestSubmitResponse>(
    `v3/forms/${formId}/submit`,
    payload,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to submit form.");
  }

  return data;
}

export function useSubmitDiagnosticTest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitDiagnosticTestForm = useCallback(
    async (formId: string | number, payload: ReadinessTestSubmitPayload) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        return await submitDiagnosticTest(formId, payload);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { submitDiagnosticTestForm, isSubmitting, errorMessage };
}
