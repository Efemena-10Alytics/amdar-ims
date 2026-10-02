/** Live session API types (`/api/v3/live-sessions`). */

export const LIVE_SESSION_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
] as const;

export type LiveSessionDayCategory = (typeof LIVE_SESSION_DAYS)[number];

export const LIVE_SESSION_TYPE_SLUGS = [
  "mentorship",
  "drop-in-session",
] as const;

export type LiveSessionTypeSlug = (typeof LIVE_SESSION_TYPE_SLUGS)[number];

/** POST /api/v3/live-sessions */
export type CreateLiveSessionInput = {
  category: LiveSessionDayCategory | string;
  startTime: string;
  endTime: string;
  description: string;
  link: string;
  sessionType: LiveSessionTypeSlug | string;
};

export type LiveSession = {
  id: number;
  category: string;
  startTime: string;
  endTime: string;
  description: string;
  link: string | null;
  sessionType: string;
  programId?: number | null;
  cohortId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CreateLiveSessionResponse = {
  success: boolean;
  message: string;
  data: LiveSession | null;
};

/** PUT /api/v3/live-sessions/{id} */
export type UpdateLiveSessionInput = CreateLiveSessionInput;

export type UpdateLiveSessionResponse = CreateLiveSessionResponse;

/** GET /api/v3/live-sessions */
export type GetLiveSessionsQuery = {
  program_id?: number | string;
  cohort_id?: number | string;
  category?: LiveSessionDayCategory | string;
  sessionType?: LiveSessionTypeSlug | string;
  search?: string;
};

export type GetLiveSessionsResponse = {
  success: boolean;
  message: string;
  data: LiveSession[] | null;
};

/** GET /api/v3/live-sessions/{id} */
export type GetLiveSessionResponse = {
  success: boolean;
  message: string;
  data: LiveSession | null;
};

/** DELETE /api/v3/live-sessions/{id} */
export type DeleteLiveSessionResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};
