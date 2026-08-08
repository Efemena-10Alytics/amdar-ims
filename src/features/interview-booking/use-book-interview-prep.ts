import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";

/**
 * Mirrors the validator on `InterviewBookingController::store`.
 * `full_name` is the only required field; everything else is nullable.
 */
export type BookInterviewPrepInput = {
  full_name: string;
  email?: string;
  phone_number?: string;
  cohort_program?: string;
  program?: string;
  program_id?: number;
  cohort_id?: number;
  job_link?: string;
  details?: string;
  interview_stage?: string;
  job_description?: string;
  /** YYYY-MM-DD */
  interview_date?: string;
  /** pdf/doc/docx only, enforced server-side. */
  cv?: File | null;
};

export type BookInterviewPrepResponse = {
  success?: boolean;
  message?: string;
  /** `SetInterviewBooking` for the cohort/program pair, when one exists. */
  data?: { link?: string } | null;
};

type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

const FALLBACK_MESSAGE = "Failed to book your interview prep session.";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    // `throttle:public_forms` guards this endpoint.
    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    const body = error.response?.data as LaravelErrorBody | undefined;

    // 422 carries per-field detail — most often a rejected CV file type.
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

/** Returns the booking link from the response, or null when none is set up. */
export function getInterviewBookingLink(
  response: BookInterviewPrepResponse | undefined,
): string | null {
  const link = response?.data?.link;
  return typeof link === "string" && link.trim() ? link.trim() : null;
}

function buildFormData(input: BookInterviewPrepInput): FormData {
  const formData = new FormData();

  const { cv, ...fields } = input;

  for (const [key, value] of Object.entries(fields)) {
    if (value == null) continue;
    const asString = typeof value === "number" ? String(value) : value.trim();
    if (!asString) continue;
    formData.append(key, asString);
  }

  if (cv) {
    formData.append("cv", cv);
  }

  return formData;
}

export async function bookInterviewPrep(
  input: BookInterviewPrepInput,
): Promise<BookInterviewPrepResponse> {
  // axios strips this header for FormData so the browser sets the boundary.
  const { data } = await axiosInstance.post<BookInterviewPrepResponse>(
    "interview-bookings",
    buildFormData(input),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (data?.success === false) {
    throw new Error(data.message?.trim() || FALLBACK_MESSAGE);
  }

  return data;
}

export function useBookInterviewPrep() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = useCallback(() => setErrorMessage(""), []);

  const submitInterviewPrep = useCallback(
    async (input: BookInterviewPrepInput) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        return await bookInterviewPrep(input);
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

  return { submitInterviewPrep, isSubmitting, errorMessage, clearError };
}
