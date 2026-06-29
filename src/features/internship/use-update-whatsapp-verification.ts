"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import { USER_ENROLLMENT_QUERY_KEY } from "@/features/internship/use-get-user-enrollment";
import type { UserEnrollment } from "@/types/user/enrollment";

export type UpdateWhatsappVerificationPayload = {
  isVerifiedWhatsapp: boolean;
};

type UpdateWhatsappVerificationResponse = {
  success: boolean;
  message: string;
  data: UserEnrollment | null;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage.trim();
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to update WhatsApp verification.";
}

export async function updateWhatsappVerification(
  payload: UpdateWhatsappVerificationPayload,
): Promise<UpdateWhatsappVerificationResponse> {
  const { data } = await axiosInstance.put<UpdateWhatsappVerificationResponse>(
    "v3/user/enrollment/whatsapp-verification",
    payload,
  );

  if (data.success === false) {
    throw new Error(
      data.message?.trim() || "Failed to update WhatsApp verification.",
    );
  }

  return data;
}

export function useUpdateWhatsappVerification() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateVerification = useCallback(
    async (isVerifiedWhatsapp = true) => {
      setIsUpdating(true);
      setErrorMessage("");

      try {
        const result = await updateWhatsappVerification({ isVerifiedWhatsapp });
        await queryClient.invalidateQueries({ queryKey: USER_ENROLLMENT_QUERY_KEY });
        return result;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [queryClient],
  );

  return {
    updateVerification,
    isUpdating,
    errorMessage,
  };
}
