import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";

/**
 * Mirrors the validator on `EmployabilityExpertBookingController::store`.
 * Everything except `user_id` is required server-side.
 */
export type BookEmployabilitySessionPayload = {
  user_id?: number;
  program_id: number;
  cohort_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  issue: string;
  purpose_of_use: string;
};

export type BookEmployabilitySessionResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

const FALLBACK_MESSAGE = "Failed to book your employability session.";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    // `throttle:public_forms` guards this endpoint.
    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    const body = error.response?.data as LaravelErrorBody | undefined;

    // 422 carries per-field detail, including failed `exists:` checks on the
    // program/cohort ids.
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

export async function bookEmployabilitySession(
  payload: BookEmployabilitySessionPayload,
): Promise<BookEmployabilitySessionResponse> {
  const { data } = await axiosInstance.post<BookEmployabilitySessionResponse>(
    "employability-expert-bookings",
    payload,
  );

  if (data?.success === false) {
    throw new Error(data.message?.trim() || FALLBACK_MESSAGE);
  }

  return data;
}

export function useBookEmployabilitySession() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = useCallback(() => setErrorMessage(""), []);

  const submitEmployabilitySession = useCallback(
    async (payload: BookEmployabilitySessionPayload) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        return await bookEmployabilitySession(payload);
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

  return {
    submitEmployabilitySession,
    isSubmitting,
    errorMessage,
    clearError,
  };
}
