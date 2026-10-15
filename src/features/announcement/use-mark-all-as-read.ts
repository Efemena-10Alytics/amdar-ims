"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import type {
  MarkAllAnnouncementsReadPayload,
  MarkAllAnnouncementsReadResponse,
} from "@/features/announcement/announcement.types";
import { announcementsQueryKey } from "@/features/announcement/use-get-announcement";
import { axiosInstance } from "@/lib/axios-instance";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage.trim();
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to mark announcements as read.";
}

/**
 * POST /api/v3/announcements/read-all
 */
export async function markAllAnnouncementsAsRead(
  payload: MarkAllAnnouncementsReadPayload,
): Promise<MarkAllAnnouncementsReadResponse> {
  const { data } = await axiosInstance.post<MarkAllAnnouncementsReadResponse>(
    "v3/announcements/read-all",
    {
      program_id: payload.program_id,
      cohort_id: payload.cohort_id,
    },
  );

  if (data?.success === false) {
    throw new Error(
      data.message?.trim() || "Failed to mark announcements as read.",
    );
  }

  return data;
}

export function useMarkAllAnnouncementsAsRead() {
  const queryClient = useQueryClient();
  const { cohortId, programId } = useSelectedEnrollmentIds();
  const [isMarking, setIsMarking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = useCallback(() => setErrorMessage(""), []);

  const markAllAsRead = useCallback(
    async (payload?: Partial<MarkAllAnnouncementsReadPayload>) => {
      const resolvedProgramId = payload?.program_id ?? programId;
      const resolvedCohortId = payload?.cohort_id ?? cohortId;

      if (resolvedProgramId == null || resolvedCohortId == null) {
        const message = "Select a program and cohort first.";
        setErrorMessage(message);
        throw new Error(message);
      }

      setIsMarking(true);
      setErrorMessage("");

      try {
        const response = await markAllAnnouncementsAsRead({
          program_id: resolvedProgramId,
          cohort_id: resolvedCohortId,
        });

        await queryClient.invalidateQueries({
          queryKey: announcementsQueryKey,
        });

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsMarking(false);
      }
    },
    [cohortId, programId, queryClient],
  );

  return {
    markAllAsRead,
    isMarking,
    errorMessage,
    clearError,
  };
}
