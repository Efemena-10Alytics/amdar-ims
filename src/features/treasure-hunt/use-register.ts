import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";

export type TreasureHunterRegisterPayload = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
};

export type TreasureHunterTreasure = {
  id: number;
  name: string;
  units: number;
};

export type TreasureHunterRegisterData = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  treasure_id: number;
  treasure: TreasureHunterTreasure;
};

export type TreasureHunterRegisterResponse = {
  success: boolean;
  message: string;
  data: TreasureHunterRegisterData;
};

type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

const FALLBACK_MESSAGE = "Failed to register treasure hunter.";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    const body = error.response?.data as LaravelErrorBody | undefined;
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

/** POST /api/v3/treasure-hunters/register */
export async function registerTreasureHunter(
  payload: TreasureHunterRegisterPayload,
): Promise<TreasureHunterRegisterResponse> {
  const { data } = await axiosInstance.post<TreasureHunterRegisterResponse>(
    "v3/treasure-hunters/register",
    payload,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || FALLBACK_MESSAGE);
  }

  return data;
}

export function useRegisterTreasureHunter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<TreasureHunterRegisterData | null>(null);

  const clearError = useCallback(() => setErrorMessage(""), []);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setErrorMessage("");
    setData(null);
  }, []);

  const register = useCallback(async (payload: TreasureHunterRegisterPayload) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await registerTreasureHunter(payload);
      setData(response.data);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    register,
    isSubmitting,
    errorMessage,
    data,
    clearError,
    reset,
  };
}
