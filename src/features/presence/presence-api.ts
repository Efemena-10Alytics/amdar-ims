import { axiosInstance } from "@/lib/axios-instance";

export type PresencePingPayload = {
  cohortId?: number | null;
  programId?: number | null;
};

export type PresencePingData = {
  sessionId: number;
  startedAt: string;
  lastPingAt: string;
  activeSeconds: number;
  dayTimeSpentMinutes: number;
  onlineUntil: string;
};

export type PresencePingResponse = {
  success: boolean;
  message: string;
  data: PresencePingData;
};

/**
 * POST /api/v3/presence/ping
 * Sends cohort/program when both are known; otherwise `{}`.
 */
export async function pingPresence(
  payload: PresencePingPayload = {},
): Promise<PresencePingResponse> {
  const { cohortId, programId } = payload;
  const body =
    typeof cohortId === "number" && typeof programId === "number"
      ? { cohort_id: cohortId, program_id: programId }
      : {};

  const { data } = await axiosInstance.post<PresencePingResponse>(
    "v3/presence/ping",
    body,
  );

  return data;
}
