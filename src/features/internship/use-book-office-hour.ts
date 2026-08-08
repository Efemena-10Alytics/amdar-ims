import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";

export type BookOfficeHourPayload = {
  full_name: string;
  cohort: string;
  cohort_id: number;
  program: string;
  program_id: number;
  email: string;
  phone: string;
  reasons: string;
};

export type BookOfficeHourResponse = {
  success?: boolean;
  message?: string;
  /** Booking/calendar link returned by the API. */
  link?: string;
  data?: {
    link?: string;
  };
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to book office hour.";
}

/** Returns the booking link from either a flat or `data`-wrapped response. */
export function getBookingLink(
  response: BookOfficeHourResponse | undefined,
): string | null {
  const link = response?.link ?? response?.data?.link;
  return typeof link === "string" && link.trim() ? link.trim() : null;
}

export async function bookOfficeHour(
  payload: BookOfficeHourPayload,
): Promise<BookOfficeHourResponse> {
  const { data } = await axiosInstance.post<BookOfficeHourResponse>(
    "internships/booked-office-hours",
    payload,
  );

  if (data?.success === false) {
    throw new Error(data.message?.trim() || "Failed to book office hour.");
  }

  return data;
}

export function useBookOfficeHour() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = useCallback(() => setErrorMessage(""), []);

  const submitOfficeHour = useCallback(
    async (payload: BookOfficeHourPayload) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        return await bookOfficeHour(payload);
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

  return { submitOfficeHour, isSubmitting, errorMessage, clearError };
}
