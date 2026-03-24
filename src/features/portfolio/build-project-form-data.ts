export type ProjectTool = {
  name: string;
  image?: string;
};

export type AddProjectFormData = {
  title: string;
  category: string;
  overview: string;
  rationale: string;
  aim: string;
  scope: string;
  expert: string;
  solutionUrl: string;
  mediaLink: string;
  tools: ProjectTool[];
  coverFile: File | null;
  projectFiles: File[];
  /**
   * PATCH/update: when the user does not upload a new cover, send the existing
   * cover URL so the API does not clear it.
   */
  retainCoverImageUrl?: string | null;
  /**
   * PATCH/update: existing gallery image URLs to keep (plus any new `projectFiles`).
   */
  retainImageUrls?: string[];
};

function isRetainableRemoteImageUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (u.startsWith("blob:")) return false;
  return true;
}

/** Multipart body for create/update project (Laravel-style nested keys). */
export function buildProjectFormData(data: AddProjectFormData): FormData {
  const formData = new FormData();
  const prefix = "projects[0]";
  formData.append(`${prefix}[title]`, data.title.trim());
  formData.append(`${prefix}[category]`, data.category.trim());
  formData.append(`${prefix}[overview]`, data.overview.trim());
  formData.append(`${prefix}[rationale]`, data.rationale.trim());
  formData.append(`${prefix}[aim]`, data.aim.trim());
  formData.append(`${prefix}[scope]`, data.scope.trim());
  formData.append(`${prefix}[excerpt]`, data.expert.trim());
  formData.append(`${prefix}[solutionUrl]`, data.solutionUrl.trim());
  formData.append(`${prefix}[mediaLink]`, data.mediaLink.trim());

  if (data.coverFile) {
    formData.append(`${prefix}[coverImage]`, data.coverFile);
  } else if (
    data.retainCoverImageUrl &&
    isRetainableRemoteImageUrl(data.retainCoverImageUrl)
  ) {
    formData.append(
      `${prefix}[coverImage]`,
      data.retainCoverImageUrl.trim(),
    );
  }

  let imageIndex = 0;
  const maxImages = 6;
  const retained = (data.retainImageUrls ?? []).filter(isRetainableRemoteImageUrl);
  for (const url of retained) {
    if (imageIndex >= maxImages) break;
    formData.append(`${prefix}[images][${imageIndex}]`, url.trim());
    imageIndex += 1;
  }
  const room = maxImages - imageIndex;
  data.projectFiles.slice(0, Math.max(0, room)).forEach((file) => {
    formData.append(`${prefix}[images][${imageIndex}]`, file);
    imageIndex += 1;
  });

  data.tools.forEach((tool, i) => {
    formData.append(`${prefix}[tools][${i}][name]`, tool.name.trim());
    if (tool.image?.trim()) {
      formData.append(`${prefix}[tools][${i}][image]`, tool.image.trim());
    }
  });

  return formData;
}
