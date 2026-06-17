import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";

export type RequestProgramBrochurePayload = {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  programOfInterest: number;
};

export type RequestProgramBrochureResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to request program brochure.";
}

/** POST v3/program-brochure */
export async function requestProgramBrochure(
  payload: RequestProgramBrochurePayload,
): Promise<RequestProgramBrochureResponse> {
  const { data } = await axiosInstance.post<RequestProgramBrochureResponse>(
    "v3/program-brochure",
    payload,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to request program brochure.");
  }

  return data;
}

export function useRequestBrochure() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requestBrochure = useCallback(
    async (payload: RequestProgramBrochurePayload) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        return await requestProgramBrochure(payload);
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

  return { requestBrochure, isSubmitting, errorMessage };
}
