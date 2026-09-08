import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import type {
  TreasureHunterRegisterData,
  TreasureHunterRegisterResponse,
} from "./use-register";

export type TreasureHunterWinPayload = {
  hunter_id: number;
  treasure_id: number;
};

export type TreasureHunterWinData = TreasureHunterRegisterData;

export type TreasureHunterWinResponse = TreasureHunterRegisterResponse;

type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

const FALLBACK_MESSAGE = "Failed to claim treasure.";

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

/** POST /api/v3/treasure-hunters/win */
export async function winTreasure(
  payload: TreasureHunterWinPayload,
): Promise<TreasureHunterWinResponse> {
  const { data } = await axiosInstance.post<TreasureHunterWinResponse>(
    "v3/treasure-hunters/win",
    payload,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || FALLBACK_MESSAGE);
  }

  return data;
}

export function useWinTreasure() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<TreasureHunterWinData | null>(null);

  const clearError = useCallback(() => setErrorMessage(""), []);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setErrorMessage("");
    setData(null);
  }, []);

  const win = useCallback(async (payload: TreasureHunterWinPayload) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await winTreasure(payload);
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
    win,
    isSubmitting,
    errorMessage,
    data,
    clearError,
    reset,
  };
}
