/** Announcement API types (`/api/v3/announcements`). */

export type AnnouncementType = "project" | "general" | string;

export type AnnouncementFormat = "link" | "material" | "video" | string;

export type Announcement = {
  id: number;
  type: AnnouncementType;
  title: string;
  message: string;
  category: string | null;
  format: AnnouncementFormat | null;
  url: string | null;
  fileUrl: string | null;
  fileName: string | null;
  mimeType: string | null;
  resourceId: number | null;
  internProjectId: number | null;
  projectTitle: string | null;
  programId: number;
  cohortId: number;
  postedById: number;
  postedByName: string;
  createdAt: string;
  readAt: string | null;
};

export type AnnouncementsData = {
  count: number;
  newer: Announcement[];
  older: Announcement[];
};

/** GET /api/v3/announcements */
export type GetAnnouncementsQuery = {
  program_id: number | string;
  cohort_id: number | string;
};

export type GetAnnouncementsResponse = {
  success: boolean;
  message: string;
  data: AnnouncementsData | null;
};

/** POST /api/v3/announcements/read-all */
export type MarkAllAnnouncementsReadPayload = {
  program_id: number | string;
  cohort_id: number | string;
};

export type MarkAllAnnouncementsReadResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};
