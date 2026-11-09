"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { axiosInstance } from "@/lib/axios-instance";

/** POST /api/v3/global-talent-email */
export type SendGlobalTalentEmailPayload = {
  title: string;
  name: string;
  email: string;
  program: string;
  cohort: string;
};

export type SendGlobalTalentEmailResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

export function getGlobalTalentEmailErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage.trim();
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to send global talent email.";
}

export async function sendGlobalTalentEmail(
  payload: SendGlobalTalentEmailPayload,
): Promise<SendGlobalTalentEmailResponse> {
  const { data } = await axiosInstance.post<SendGlobalTalentEmailResponse>(
    "v3/global-talent-email",
    payload,
  );

  if (data?.success === false) {
    throw new Error(
      data.message?.trim() || "Failed to send global talent email.",
    );
  }

  return data;
}

export function useSendGlobalTalentEmail() {
  return useMutation({
    mutationFn: (payload: SendGlobalTalentEmailPayload) =>
      sendGlobalTalentEmail(payload),
  });
}
