/** The booking APIs accept pdf/doc/docx only (`mimes:pdf,doc,docx` server-side). */
export const ACCEPTED_CV_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

export const ACCEPTED_CV_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/** Client cap. The API allows 20MB; we hold uploads to the designed 5MB. */
export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

export const CV_ACCEPT_ATTRIBUTE = ".pdf,.doc,.docx";

export const CV_HINT_TEXT = "PDF, DOC, DOCX (max 5mb)";

/** Rejects anything the API would 422 on, before we attempt the upload. */
export function isAcceptedCv(file: File): boolean {
  const name = file.name.toLowerCase();
  const hasExtension = ACCEPTED_CV_EXTENSIONS.some((extension) =>
    name.endsWith(extension),
  );
  // Some browsers report an empty type for .doc — fall back to the extension.
  const hasMimeType =
    !file.type ||
    (ACCEPTED_CV_MIME_TYPES as readonly string[]).includes(file.type);

  return hasExtension && hasMimeType;
}

/** Shared validation for the CV upload controls. Returns "" when valid. */
export function getCvValidationError(file: File): string {
  if (!isAcceptedCv(file)) return "Please upload a PDF, DOC or DOCX file.";
  if (file.size > MAX_CV_SIZE_BYTES) return "File must be 5 MB or smaller.";
  return "";
}
