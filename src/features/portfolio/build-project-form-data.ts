export type ProjectTool = {
  name: string;
  image?: string;
};

export type AddProjectFormData = {
  title: string;
  category: string;
  duration: string;
  overview: string;
  summary: string;
  problem: string;
  role: string;
  features: string[];
  challengesAndSolutions: string;
  impactAndOutcomes: string;
  durationBreakdown: string;
  solutionUrl: string;
  mediaUrl: string;
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
  formData.append(`${prefix}[duration]`, data.duration.trim());
  formData.append(`${prefix}[overview]`, data.overview.trim());
  formData.append(`${prefix}[summary]`, data.summary.trim());
  formData.append(`${prefix}[problem]`, data.problem.trim());
  formData.append(`${prefix}[role]`, data.role.trim());
  data.features.forEach((feature, index) => {
    formData.append(`${prefix}[features][${index}]`, feature.trim());
  });
  formData.append(
    `${prefix}[challengesAndSolutions]`,
    data.challengesAndSolutions.trim(),
  );
  formData.append(
    `${prefix}[impactAndOutcomes]`,
    data.impactAndOutcomes.trim(),
  );
  formData.append(`${prefix}[durationBreakdown]`, data.durationBreakdown.trim());
  formData.append(`${prefix}[solutionUrl]`, data.solutionUrl.trim());
  formData.append(`${prefix}[mediaUrl]`, data.mediaUrl.trim());

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
    formData.append(`${prefix}[projectFiles][${imageIndex}]`, url.trim());
    imageIndex += 1;
  }
  const room = maxImages - imageIndex;
  data.projectFiles.slice(0, Math.max(0, room)).forEach((file) => {
    formData.append(`${prefix}[projectFiles][${imageIndex}]`, file);
    imageIndex += 1;
  });

  data.tools.forEach((tool, i) => {
    formData.append(`${prefix}[tools][${i}][title]`, tool.name.trim());
    if (tool.image?.trim()) {
      formData.append(`${prefix}[tools][${i}][image]`, tool.image.trim());
    }
  });

  return formData;
}
