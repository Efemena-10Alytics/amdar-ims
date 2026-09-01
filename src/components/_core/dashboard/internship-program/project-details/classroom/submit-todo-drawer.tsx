"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CloudUpload, Link2, Type, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCareerStageLabel } from "@/components/_core/dashboard/internship-program/project-details/project-content";
import type {
  InternProjectTodoSolutionFormat,
  InternProjectTodoSubmissionItem,
} from "@/features/interns-project/internship-project.types";
import { useEditMyTodoSubmission } from "@/features/interns-project/use-edit-my-todo-submission";
import { useGetMyTodoSubmission } from "@/features/interns-project/use-get-my-todo-submission";
import { useGetTodoSubmissionComments } from "@/features/interns-project/use-get-todo-submission-comment";
import { useSubmitTodo } from "@/features/interns-project/use-submit-todo";
import { useIsSpecialistPreview } from "@/features/internship/use-is-specialist-preview";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
] as const;
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/csv",
];
const ACCEPTED_ACCEPT_ATTR =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/csv";
const FILE_TYPE_HINT = "PDF, JPEG, PNG, Word, Excel, or CSV (max 5MB)";

function isAcceptedSubmissionFile(file: File): boolean {
  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";

  return (
    ACCEPTED_MIME_TYPES.includes(file.type) ||
    ACCEPTED_EXTENSIONS.includes(
      extension as (typeof ACCEPTED_EXTENSIONS)[number],
    )
  );
}

const SOLUTION_OPTIONS = [
  { id: "file" as const, label: "File", icon: CloudUpload },
  { id: "text" as const, label: "Text", icon: Type },
  { id: "url" as const, label: "URL", icon: Link2 },
];

const DEFAULT_SOLUTION_FORMATS: InternProjectTodoSolutionFormat[] = [
  "file",
  "text",
  "url",
];

type SubmitTodoDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careerStage?: string | null;
  userName?: string | null;
  projectId?: number | string | null;
  todoId?: number | string | null;
  typeId?: number | string | null;
  submissionId?: number | string | null;
  solutionFormats?:
    | InternProjectTodoSolutionFormat[]
    | InternProjectTodoSolutionFormat
    | null;
};

function getDisplayName(user: Record<string, unknown> | null): string {
  if (!user) return "Intern";

  const nested =
    user.user && typeof user.user === "object"
      ? (user.user as Record<string, unknown>)
      : user;

  const first =
    nested.firstName ?? nested.first_name ?? nested.name ?? nested.username;
  const last = nested.lastName ?? nested.last_name;

  const firstName = typeof first === "string" ? first.trim() : "";
  const lastName = typeof last === "string" ? last.trim() : "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Intern";
}

function getStageShortLabel(stage?: string | null) {
  if (!stage) return "Stage";
  const label = formatCareerStageLabel(stage).replace(/ stage$/i, "");
  return label;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeSolutionFormats(
  formats?: InternProjectTodoSolutionFormat[] | InternProjectTodoSolutionFormat | null,
): InternProjectTodoSolutionFormat[] {
  const values = Array.isArray(formats)
    ? formats
    : typeof formats === "string" && formats.trim()
      ? [formats]
      : [];

  const unique = Array.from(
    new Set(values.filter(Boolean)),
  ) as InternProjectTodoSolutionFormat[];

  if (!unique.length) return DEFAULT_SOLUTION_FORMATS;

  return SOLUTION_OPTIONS.map((option) => option.id).filter((id) =>
    unique.includes(id),
  );
}

function readSolutionField(
  item: Record<string, unknown> | null | undefined,
  ...keys: string[]
): string | null {
  if (!item) return null;
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function extractUrlValue(item: Record<string, unknown> | undefined) {
  return (
    readSolutionField(item, "contentUrl", "content_url", "url", "link") ??
    (() => {
      const text = readSolutionField(item, "contentText", "content_text");
      if (text && /^https?:\/\//i.test(text)) return text;
      return null;
    })()
  );
}

export default function SubmitTodoDrawer({
  open,
  onOpenChange,
  careerStage,
  userName,
  projectId = null,
  todoId = null,
  typeId = null,
  submissionId = null,
  solutionFormats = null,
}: SubmitTodoDrawerProps) {
  const authUser = useAuthStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDirtyRef = useRef(false);
  const wasOpenRef = useRef(false);
  const availableFormats = useMemo(
    () => normalizeSolutionFormats(solutionFormats),
    [solutionFormats],
  );
  const [activeFormat, setActiveFormat] =
    useState<InternProjectTodoSolutionFormat>(availableFormats[0] ?? "file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [existingFileName, setExistingFileName] = useState<string | null>(null);
  const [textSolution, setTextSolution] = useState("");
  const [urlSolution, setUrlSolution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Keep submission warm so edit opens already prefilled.
  const {
    data: mySubmission = null,
    isLoading: isMySubmissionLoading,
  } = useGetMyTodoSubmission(projectId, todoId, typeId);

  const resolvedSubmissionId = mySubmission?.id ?? submissionId;
  const hasExistingSubmission = Boolean(mySubmission?.id);

  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments,
  } = useGetTodoSubmissionComments(
    projectId,
    todoId,
    typeId,
    resolvedSubmissionId,
    {
      enabled: open && !mySubmission?.feedback?.length,
    },
  );

  const {
    submitTodo,
    isSubmitting,
    errorMessage: submitErrorMessage,
  } = useSubmitTodo();
  const {
    editTodoSubmission,
    isSubmitting: isEditing,
    errorMessage: editErrorMessage,
  } = useEditMyTodoSubmission();

  const displayName = userName?.trim() || getDisplayName(authUser);
  const visibleOptions = SOLUTION_OPTIONS.filter((option) =>
    availableFormats.includes(option.id),
  );
  const showFormatTabs = visibleOptions.length > 1;
  const isSaving = isSubmitting || isEditing;
  // A specialist may open the drawer to see exactly what the intern is asked
  // for, but must not submit into a cohort they only service. The API refuses
  // this anyway (ensureUserEnrolled); stopping it here turns a raw 403 into an
  // explained, disabled control.
  const { isPreview } = useIsSpecialistPreview();

  const canSubmit =
    Boolean(projectId && todoId && typeId) && !isSaving && !isPreview;
  const feedbackItems = mySubmission?.feedback?.length
    ? mySubmission.feedback
    : comments;

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;

    if (justOpened) {
      isDirtyRef.current = false;
      setErrorMessage("");
    }

    if (!open) return;

    setActiveFormat((current) =>
      availableFormats.includes(current)
        ? current
        : (availableFormats[0] ?? "file"),
    );
  }, [availableFormats, open]);

  useEffect(() => {
    if (!open || isMySubmissionLoading || isDirtyRef.current) return;

    setSelectedFile(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!mySubmission?.solution?.length) {
      setTextSolution("");
      setUrlSolution("");
      setExistingFileUrl(null);
      setExistingFileName(null);
      return;
    }

    const urlItem =
      mySubmission.solution.find((item) => item.type === "url") ??
      mySubmission.solution.find((item) =>
        Boolean(extractUrlValue(item as unknown as Record<string, unknown>)),
      );
    const textItem = mySubmission.solution.find(
      (item) => item.type === "text" && item !== urlItem,
    );
    const fileItem = mySubmission.solution.find((item) => item.type === "file");

    setTextSolution(
      readSolutionField(
        textItem as Record<string, unknown> | undefined,
        "contentText",
        "content_text",
      ) ?? "",
    );
    setUrlSolution(
      extractUrlValue(urlItem as Record<string, unknown> | undefined) ?? "",
    );
    setExistingFileUrl(
      readSolutionField(
        fileItem as Record<string, unknown> | undefined,
        "fileUrl",
        "file_url",
      ),
    );
    setExistingFileName(
      readSolutionField(
        fileItem as Record<string, unknown> | undefined,
        "fileName",
        "file_name",
      ),
    );

    const preferredFormat = mySubmission.solution.find((item) =>
      availableFormats.includes(item.type),
    )?.type;
    if (preferredFormat) {
      setActiveFormat(preferredFormat);
    }
  }, [availableFormats, isMySubmissionLoading, mySubmission, open]);

  const markDirty = () => {
    isDirtyRef.current = true;
  };

  const resetSolution = () => {
    setSelectedFile(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setExistingFileUrl(null);
    setExistingFileName(null);
    setTextSolution("");
    setUrlSolution("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setErrorMessage("");
      isDirtyRef.current = false;
    }
    onOpenChange(nextOpen);
  };

  const handleFormatChange = (format: InternProjectTodoSolutionFormat) => {
    if (!availableFormats.includes(format)) return;
    setActiveFormat(format);
    setErrorMessage("");
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!isAcceptedSubmissionFile(file)) {
      setErrorMessage("Please upload a PDF, JPEG, PNG, Word, Excel, or CSV file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("File must be 5MB or smaller.");
      return;
    }

    markDirty();
    setErrorMessage("");
    setSelectedFile(file);
    setExistingFileUrl(null);
    setExistingFileName(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
    });
  };

  const buildSubmissionItems = (): InternProjectTodoSubmissionItem[] | null => {
    const items: InternProjectTodoSubmissionItem[] = [];
    let sortOrder = 0;

    if (availableFormats.includes("text") && textSolution.trim()) {
      items.push({
        type: "text",
        contentText: textSolution.trim(),
        sortOrder: sortOrder++,
      });
    }

    if (availableFormats.includes("url") && urlSolution.trim()) {
      const contentUrl = urlSolution.trim();
      if (!isValidHttpUrl(contentUrl)) {
        setErrorMessage("Enter a valid http or https URL.");
        return null;
      }
      items.push({
        type: "url",
        contentUrl,
        sortOrder: sortOrder++,
      });
    }

    if (availableFormats.includes("file") && selectedFile) {
      items.push({
        type: "file",
        file: selectedFile,
        sortOrder: sortOrder++,
      });
    }

    if (!items.length) {
      if (activeFormat === "file") {
        setErrorMessage(
          existingFileUrl
            ? "Choose a new file to replace your current submission."
            : "Please upload a file.",
        );
      } else if (activeFormat === "text") {
        setErrorMessage("Please enter your solution text.");
      } else if (activeFormat === "url") {
        setErrorMessage("Please paste your solution link.");
      } else {
        setErrorMessage("Please provide a solution.");
      }
      return null;
    }

    return items;
  };

  const handleSubmit = async () => {
    if (!projectId || !todoId || !typeId) {
      setErrorMessage("Missing project, todo, or type details.");
      return;
    }

    const items = buildSubmissionItems();
    if (!items) return;

    try {
      if (hasExistingSubmission) {
        await editTodoSubmission({
          projectId,
          todoId,
          typeId,
          payload: { items },
        });
      } else {
        await submitTodo({
          projectId,
          todoId,
          typeId,
          payload: { items },
        });
      }
      resetSolution();
      onOpenChange(false);
    } catch {
      // errorMessage is already set by the hook
    }
  };

  const filePreviewSrc = previewUrl || existingFileUrl;
  const isImagePreview =
    Boolean(previewUrl) ||
    Boolean(existingFileUrl && /\.(jpe?g|png)(\?|$)/i.test(existingFileUrl));
  const fileLabel =
    selectedFile?.name || existingFileName || "Click to upload file";
  const mutationErrorMessage = submitErrorMessage || editErrorMessage;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l-0 bg-[#F7F9FA] p-0 sm:max-w-xl"
      >
        <div className="flex h-full flex-col">
          <div className="px-5 pt-5 pb-4">
            <SheetClose className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
              <X className="size-3.5" />
              Close
            </SheetClose>
            <SheetTitle className="mt-4 text-3xl font-semibold text-[#173740]">
              Todo Submission
            </SheetTitle>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-6">
            <div className="flex items-center gap-3 rounded-2xl bg-[#0F4652] px-4 py-3 text-white">
              <Image
                src="/images/svgs/illustration/Smug 2.svg"
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full bg-[#E8F0F3] object-contain p-1"
              />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{displayName}</p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#9DE0B4]">
                  <span className="size-1.5 rounded-full bg-[#3DD68C]" aria-hidden />
                  {getStageShortLabel(careerStage)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#173740]">Solution</p>
                {!showFormatTabs ? (
                  <span className="rounded-full bg-[#E8F0F3] px-2.5 py-1 text-xs font-medium capitalize text-[#156374]">
                    {activeFormat}
                  </span>
                ) : null}
              </div>

              {isMySubmissionLoading ? (
                <p className="text-sm text-[#94A3B8]">Loading your submission...</p>
              ) : null}

              {showFormatTabs ? (
                <div className="inline-flex w-full rounded-full bg-[#E4EBEF] p-1">
                  {visibleOptions.map((option) => {
                    const isActive = option.id === activeFormat;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleFormatChange(option.id)}
                        className={cn(
                          "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition",
                          isActive
                            ? "bg-white text-[#156374] shadow-sm"
                            : "text-[#64748B] hover:text-[#156374]",
                        )}
                      >
                        <Icon className="size-3.5" aria-hidden />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {activeFormat === "file" ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_ACCEPT_ATTR}
                    className="hidden"
                    onChange={(event) =>
                      handleFileChange(event.target.files?.[0] ?? null)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex min-h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D5E0E4] bg-[#EEF3F5] px-4 py-8 text-center transition hover:border-[#9DB8C0]",
                      (selectedFile || existingFileUrl) &&
                        "border-solid border-[#156374] bg-[#E8F0F3]",
                    )}
                  >
                    {filePreviewSrc && isImagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={filePreviewSrc}
                        alt={fileLabel}
                        className="mb-3 max-h-28 rounded-lg object-contain"
                      />
                    ) : (
                      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white text-[#78909C] shadow-sm">
                        <CloudUpload className="size-6" aria-hidden />
                      </span>
                    )}
                    <p className="text-sm font-semibold text-[#173740]">
                      {fileLabel}
                    </p>
                    <p className="mt-1 text-xs text-[#94A3B8]">
                      {FILE_TYPE_HINT}
                    </p>
                  </button>

                  {selectedFile || existingFileUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setExistingFileUrl(null);
                        setExistingFileName(null);
                        setPreviewUrl((current) => {
                          if (current) URL.revokeObjectURL(current);
                          return null;
                        });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-xs font-medium text-[#156374] underline underline-offset-2"
                    >
                      Remove file
                    </button>
                  ) : null}
                </>
              ) : null}

              {activeFormat === "text" ? (
                <textarea
                  value={textSolution}
                  onChange={(event) => {
                    markDirty();
                    setTextSolution(event.target.value);
                    setErrorMessage("");
                  }}
                  rows={8}
                  placeholder="Write your solution here..."
                  className="min-h-44 w-full resize-y rounded-xl border border-[#D5E0E4] bg-[#EEF3F5] px-4 py-3 text-sm text-[#173740] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
                />
              ) : null}

              {activeFormat === "url" ? (
                <div className="relative">
                  <input
                    type="url"
                    value={urlSolution}
                    onChange={(event) => {
                      markDirty();
                      setUrlSolution(event.target.value);
                      setErrorMessage("");
                    }}
                    onBlur={() => {
                      if (
                        urlSolution.trim() &&
                        !isValidHttpUrl(urlSolution.trim())
                      ) {
                        setErrorMessage("Enter a valid http or https URL.");
                      }
                    }}
                    placeholder="Paste your solution Link"
                    className="h-12 w-full rounded-xl border border-[#D5E0E4] bg-[#EEF3F5] py-3 pr-11 pl-4 text-sm text-[#173740] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
                  />
                  <Link2
                    className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#94A3B8]"
                    aria-hidden
                  />
                </div>
              ) : null}

              {errorMessage || mutationErrorMessage ? (
                <p className="text-xs font-medium text-[#C0392B]">
                  {errorMessage || mutationErrorMessage}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[#173740]">Comment</p>
              {!resolvedSubmissionId ? (
                <p className="text-sm text-[#94A3B8]">
                  Comments from your specialist will show here
                </p>
              ) : isCommentsLoading && !mySubmission?.feedback?.length ? (
                <p className="text-sm text-[#94A3B8]">Loading comments...</p>
              ) : isCommentsError && !mySubmission?.feedback?.length ? (
                <div className="space-y-2">
                  <p className="text-sm text-[#C0392B]">
                    Failed to load comments.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      void refetchComments();
                    }}
                    className="text-xs font-medium text-[#156374] underline underline-offset-2"
                  >
                    Retry
                  </button>
                </div>
              ) : feedbackItems.length ? (
                <div className="space-y-3">
                  {feedbackItems.map((item) => (
                    <article key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#173740]">
                          {item.name}
                        </p>
                        <time className="text-[11px] text-[#94A3B8]">
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-sm leading-relaxed text-[#64748B]">
                        {item.comment}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#94A3B8]">
                  Comments from your specialist will show here
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] bg-[#F7F9FA] px-5 py-4">
            {isPreview ? (
              <p className="mb-3 text-center text-sm text-[#64748B]">
                You&apos;re viewing this cohort as a specialist. This is what
                the intern is asked to submit — submitting is theirs to do.
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                void handleSubmit();
              }}
              disabled={!canSubmit}
              title={
                isPreview
                  ? "Specialists can't submit work into a cohort they service"
                  : undefined
              }
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0F4652] text-sm font-semibold text-white transition hover:bg-[#0C3B45] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving
                ? hasExistingSubmission
                  ? "Updating..."
                  : "Submitting..."
                : hasExistingSubmission
                  ? "Update solution"
                  : "Submit solution"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
