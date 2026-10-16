import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import type { WeeklySurveySkipPayload, WeeklySurveySkipResponse } from "./types";

type LaravelErrorBody = { message?: string; errors?: Record<string, string[]> };

const FALLBACK_MESSAGE = "Something went wrong while skipping. Please try again.";

export async function skipWeeklySurvey(
  payload: WeeklySurveySkipPayload,
): Promise<WeeklySurveySkipResponse> {
  const { data } = await axiosInstance.post<WeeklySurveySkipResponse>(
    "internships/weekly-survey/skip",
    payload,
  );
  return data;
}

export function getWeeklySurveySkipErrorMessage(error: unknown): {
  message: string;
  isAlreadySubmitted: boolean;
} {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 409) {
      return {
        message: "You already completed or skipped this week’s survey.",
        isAlreadySubmitted: true,
      };
    }

    const body = error.response?.data as LaravelErrorBody | undefined;

    if (status === 404) {
      return {
        message:
          body?.message?.trim() ||
          "No weekly survey submission found from last week to duplicate.",
        isAlreadySubmitted: false,
      };
    }

    if (status === 422 && body?.errors) {
      const flat = Object.values(body.errors).flat();
      if (flat.length) return { message: flat.join(" "), isAlreadySubmitted: false };
    }

    if (typeof body?.message === "string" && body.message.trim()) {
      return { message: body.message.trim(), isAlreadySubmitted: false };
    }
  }

  if (error instanceof Error && error.message) {
    return { message: error.message, isAlreadySubmitted: false };
  }

  return { message: FALLBACK_MESSAGE, isAlreadySubmitted: false };
}
