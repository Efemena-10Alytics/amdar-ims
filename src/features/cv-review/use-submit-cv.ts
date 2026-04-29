import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import type { ApiResponse, SubmissionResponse, ValidationError } from "./types";

type SubmitCVError =
  | { type: "validation"; fieldErrors: Record<string, string[]>; message: string }
  | { type: "rate_limit"; message: string }
  | { type: "generic"; message: string };

async function submitCV(
  formData: FormData,
): Promise<SubmissionResponse> {
  const res = await axiosInstance.post<ApiResponse<SubmissionResponse>>(
    "cv-review/submit",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data.data;
}

export function useSubmitCV(): {
  submit: (formData: FormData) => Promise<SubmissionResponse>;
  isSubmitting: boolean;
  errorMessage: string;
  fieldErrors: Record<string, string[]>;
  successData: SubmissionResponse | null;
  clearError: () => void;
  reset: () => void;
} {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successData, setSuccessData] = useState<SubmissionResponse | null>(null);

  const clearError = useCallback(() => {
    setErrorMessage("");
    setFieldErrors({});
  }, []);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setErrorMessage("");
    setFieldErrors({});
    setSuccessData(null);
  }, []);

  const submit = useCallback(async (formData: FormData): Promise<SubmissionResponse> => {
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const data = await submitCV(formData);
      setSuccessData(data);
      return data;
    } catch (error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: ValidationError & { message?: string };
          headers?: Record<string, string>;
        };
        message?: string;
        code?: string;
      };

      const status = axiosError.response?.status;

      if (status === 422) {
        const serverErrors = axiosError.response?.data?.errors ?? {};
        const serverMessage =
          axiosError.response?.data?.message ?? "Please fix the errors below.";
        setFieldErrors(serverErrors);
        setErrorMessage(serverMessage);
        const err: SubmitCVError = {
          type: "validation",
          fieldErrors: serverErrors,
          message: serverMessage,
        };
        throw err;
      }

      if (status === 429) {
        const retryAfter = axiosError.response?.headers?.["retry-after"];
        const waitMsg = retryAfter
          ? ` Please try again in ${retryAfter} seconds.`
          : " Please try again in a moment.";
        const msg = `Too many requests.${waitMsg}`;
        setErrorMessage(msg);
        const err: SubmitCVError = { type: "rate_limit", message: msg };
        throw err;
      }

      if (axiosError.code === "ERR_NETWORK" || !axiosError.response) {
        const msg =
          "Network error. Please check your connection and try again.";
        setErrorMessage(msg);
        const err: SubmitCVError = { type: "generic", message: msg };
        throw err;
      }

      const msg =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Something went wrong. Please try again.";
      setErrorMessage(msg);
      const err: SubmitCVError = { type: "generic", message: msg };
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    submit,
    isSubmitting,
    errorMessage,
    fieldErrors,
    successData,
    clearError,
    reset,
  };
}
