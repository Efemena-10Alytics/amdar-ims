import type { InternProjectTodoSubmissionItem } from "./internship-project.types";

export function submissionItemsHaveFile(
  items: InternProjectTodoSubmissionItem[],
): boolean {
  return items.some(
    (item) => item.type === "file" && "file" in item && item.file instanceof File,
  );
}

/** Builds nested FormData: items[i][type], items[i][file|contentText|contentUrl], items[i][sortOrder] */
export function buildTodoSubmissionFormData(
  items: InternProjectTodoSubmissionItem[],
): FormData {
  const formData = new FormData();

  items.forEach((item, index) => {
    const prefix = `items[${index}]`;
    formData.append(`${prefix}[type]`, item.type);
    formData.append(`${prefix}[sortOrder]`, String(item.sortOrder));

    if (item.type === "text") {
      formData.append(`${prefix}[contentText]`, item.contentText);
      return;
    }

    if (item.type === "url") {
      formData.append(`${prefix}[contentUrl]`, item.contentUrl);
      return;
    }

    if ("file" in item && item.file instanceof File) {
      formData.append(`${prefix}[file]`, item.file);
      return;
    }

    if ("contentUrl" in item && item.contentUrl) {
      formData.append(`${prefix}[contentUrl]`, item.contentUrl);
    }
  });

  return formData;
}
