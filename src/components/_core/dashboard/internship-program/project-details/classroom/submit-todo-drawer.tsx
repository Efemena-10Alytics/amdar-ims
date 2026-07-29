"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CloudUpload, Link2, Type, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCareerStageLabel } from "@/components/_core/dashboard/internship-program/project-details/project-content";
import type { InternProjectTodoSolutionFormat } from "@/features/interns-project/internship-project.types";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const SOLUTION_OPTIONS = [
  { id: "file" as const, label: "File", icon: CloudUpload },
  { id: "text" as const, label: "Text", icon: Type },
  { id: "url" as const, label: "URL", icon: Link2 },
];

type SubmitTodoDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careerStage?: string | null;
  userName?: string | null;
  solutionFormat?: InternProjectTodoSolutionFormat | null;
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

export default function SubmitTodoDrawer({
  open,
  onOpenChange,
  careerStage,
  userName,
  solutionFormat = null,
}: SubmitTodoDrawerProps) {
  const authUser = useAuthStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lockedFormat = solutionFormat ?? null;
  const [activeFormat, setActiveFormat] =
    useState<InternProjectTodoSolutionFormat>(lockedFormat ?? "file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textSolution, setTextSolution] = useState("");
  const [urlSolution, setUrlSolution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const displayName = userName?.trim() || getDisplayName(authUser);
  const canSwitchFormat = lockedFormat == null;

  useEffect(() => {
    if (!open) return;
    setActiveFormat(lockedFormat ?? "file");
    setErrorMessage("");
  }, [lockedFormat, open]);

  const resetSolution = () => {
    setSelectedFile(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setTextSolution("");
    setUrlSolution("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetSolution();
      setErrorMessage("");
    }
    onOpenChange(nextOpen);
  };

  const handleFormatChange = (format: InternProjectTodoSolutionFormat) => {
    if (!canSwitchFormat) return;
    setActiveFormat(format);
    setErrorMessage("");
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage("Please upload a JPEG or PNG file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("File must be 5MB or smaller.");
      return;
    }

    setErrorMessage("");
    setSelectedFile(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l-0 bg-[#F7F9FA] p-0 sm:max-w-md"
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

          <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-8">
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
                {!canSwitchFormat ? (
                  <span className="rounded-full bg-[#E8F0F3] px-2.5 py-1 text-xs font-medium capitalize text-[#156374]">
                    {activeFormat}
                  </span>
                ) : null}
              </div>

              {canSwitchFormat ? (
                <div className="inline-flex w-full rounded-full bg-[#E4EBEF] p-1">
                  {SOLUTION_OPTIONS.map((option) => {
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
                    accept="image/jpeg,image/png"
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
                      selectedFile && "border-solid border-[#156374] bg-[#E8F0F3]",
                    )}
                  >
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt={selectedFile?.name || "Uploaded solution"}
                        className="mb-3 max-h-28 rounded-lg object-contain"
                      />
                    ) : (
                      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white text-[#78909C] shadow-sm">
                        <CloudUpload className="size-6" aria-hidden />
                      </span>
                    )}
                    <p className="text-sm font-semibold text-[#173740]">
                      {selectedFile ? selectedFile.name : "Click to upload file"}
                    </p>
                    <p className="mt-1 text-xs text-[#94A3B8]">
                      Jpeg, png (max 5mb)
                    </p>
                  </button>

                  {selectedFile ? (
                    <button
                      type="button"
                      onClick={resetSolution}
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
                    setTextSolution(event.target.value);
                    setErrorMessage("");
                  }}
                  rows={8}
                  placeholder="Write your solution here..."
                  className="min-h-44 w-full resize-y rounded-xl border border-[#D5E0E4] bg-[#EEF3F5] px-4 py-3 text-sm text-[#173740] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
                />
              ) : null}

              {activeFormat === "url" ? (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={urlSolution}
                    onChange={(event) => {
                      setUrlSolution(event.target.value);
                      setErrorMessage("");
                    }}
                    onBlur={() => {
                      if (urlSolution.trim() && !isValidHttpUrl(urlSolution.trim())) {
                        setErrorMessage("Enter a valid http or https URL.");
                      }
                    }}
                    placeholder="https://example.com/your-solution"
                    className="h-12 w-full rounded-xl border border-[#D5E0E4] bg-[#EEF3F5] px-4 text-sm text-[#173740] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
                  />
                  <p className="text-xs text-[#94A3B8]">
                    Paste a public link to your solution
                  </p>
                </div>
              ) : null}

              {errorMessage ? (
                <p className="text-xs font-medium text-[#C0392B]">{errorMessage}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[#173740]">Comment</p>
              <div className="min-h-28 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#94A3B8]">
                Comments from your specialist will show here
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
