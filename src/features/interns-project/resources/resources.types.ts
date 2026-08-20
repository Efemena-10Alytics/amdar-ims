export type ResourceCategory =
  | "onboarding"
  | "session-recording"
  | "mentorship"
  | "drop-in-session"
  | "project-hub"
  | "employability-session"
  | "faqs"
  | "others";

/** Resource content is either a link (`url`) or a document upload (`file`). */
export type ResourceFormat = "link" | "material" | "video";

type CreateResourceBase = {
  title: string;
  category: ResourceCategory | string;
  program_id: number | string;
  cohort_id: number | string;
};

export type CreateResourceLinkInput = CreateResourceBase & {
  format: "link" | "video" | string;
  url: string;
  file?: never;
};

export type CreateResourceDocumentInput = CreateResourceBase & {
  format: "material" | string;
  file: File;
  url?: never;
};

/** POST /api/v3/resources — provide either `url` (link/video) or `file` (document). */
export type CreateResourceInput =
  | CreateResourceLinkInput
  | CreateResourceDocumentInput;

type UpdateResourceBase = {
  title: string;
  category: ResourceCategory | string;
};

export type UpdateResourceLinkInput = UpdateResourceBase & {
  format: "link" | "video" | string;
  url: string;
  file?: never;
};

export type UpdateResourceDocumentInput = UpdateResourceBase & {
  format: "material" | string;
  file: File;
  url?: never;
};

/** Keep existing file/url and only update metadata. */
export type UpdateResourceMetadataInput = UpdateResourceBase & {
  format: ResourceFormat | string;
  url?: never;
  file?: never;
};

/** PUT /api/v3/resources/:id — link, new document, or metadata-only. */
export type UpdateResourceInput =
  | UpdateResourceLinkInput
  | UpdateResourceDocumentInput
  | UpdateResourceMetadataInput;

export type Resource = {
  id: number;
  title: string;
  category: string;
  format: ResourceFormat | string;
  url: string | null;
  fileUrl: string | null;
  fileName: string | null;
  mimeType: string | null;
  postedById: number;
  postedByName: string;
  internProjectId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateResourceResponse = {
  success: boolean;
  message: string;
  data: Resource | null;
};

export type UpdateResourceResponse = CreateResourceResponse;

/** DELETE /api/v3/resources/:id */
export type DeleteResourceResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

export type ResourceStats = {
  total: number;
  videos: number;
  links: number;
  materials: number;
};

export type ResourcesData = {
  stats: ResourceStats;
  resources: Resource[];
};

/** GET /api/v3/intern-projects/{projectId}/resources */
export type GetResourcesResponse = {
  success: boolean;
  message: string;
  data: ResourcesData | null;
};

export type GetResourcesQuery = {
  project_id: number | string;
  search?: string;
  category?: ResourceCategory | string;
  format?: ResourceFormat | string;
  per_page?: number;
  page?: number;
};
