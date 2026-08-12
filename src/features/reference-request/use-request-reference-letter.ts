import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";

/**
 * Mirrors the validator on `ReferenceRequestController::storeLetter`.
 * Any key outside this set is discarded server-side, so nothing else is sent.
 */
export type RequestReferenceLetterPayload = {
  full_name: string;
  email: string;
  phone_number: string;
  reason: string;
  cohort_program?: string;
  program?: string;
  program_id?: number;
  cohort_id?: number;
  additional_info?: string;
  job_role?: string;
  company_name?: string;
  company_website?: string;
};

export type RequestReferenceLetterResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

const FALLBACK_MESSAGE = "Failed to submit your reference letter request.";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    // `throttle:public_forms` guards this endpoint.
    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    const body = error.response?.data as LaravelErrorBody | undefined;

    // 422 carries per-field detail that is more useful than the summary line.
    const firstFieldError = Object.values(body?.errors ?? {})
      .flat()
      .find((message) => typeof message === "string" && message.trim());
    if (firstFieldError) return firstFieldError.trim();

    if (typeof body?.message === "string" && body.message.trim()) {
      return body.message.trim();
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return FALLBACK_MESSAGE;
}

export async function requestReferenceLetter(
  payload: RequestReferenceLetterPayload,
): Promise<RequestReferenceLetterResponse> {
  const { data } = await axiosInstance.post<RequestReferenceLetterResponse>(
    "reference-requests/letter",
    payload,
  );

  if (data?.success === false) {
    throw new Error(data.message?.trim() || FALLBACK_MESSAGE);
  }

  return data;
}

export function useRequestReferenceLetter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = useCallback(() => setErrorMessage(""), []);

  const submitReferenceLetter = useCallback(
    async (payload: RequestReferenceLetterPayload) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        return await requestReferenceLetter(payload);
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

  return { submitReferenceLetter, isSubmitting, errorMessage, clearError };
}
