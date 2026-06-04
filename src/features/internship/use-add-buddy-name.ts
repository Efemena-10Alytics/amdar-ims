import { useCallback, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";

export type AddBuddyNamePayload = {
  buddy_name: string;
};

export type AddBuddyNameResponse = {
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
  return "Failed to save buddy name.";
}

export async function addBuddyName(
  payload: AddBuddyNamePayload,
): Promise<AddBuddyNameResponse> {
  const { data } = await axiosInstance.post<AddBuddyNameResponse>(
    "v3/user/buddy-name",
    payload,
  );

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to save buddy name.");
  }

  return data;
}

export function useAddBuddyName() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitBuddyName = useCallback(async (buddyName: string) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      return await addBuddyName({ buddy_name: buddyName.trim() });
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitBuddyName, isSubmitting, errorMessage };
}
