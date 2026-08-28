"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

type DefermentFileUploadProps = {
  id: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  label?: string;
  className?: string;
};

export function DefermentFileUpload({
  id,
  file,
  onFileChange,
  label = "Supporting document (optional)",
  className,
}: DefermentFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !isImageFile(file)) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleFile = useCallback(
    (nextFile: File | null) => {
      if (!nextFile) return;
      onFileChange(nextFile);
    },
    [onFileChange],
  );

  const handleRemove = useCallback(() => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onFileChange]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
      handleFile(event.dataTransfer.files[0] ?? null);
    },
    [handleFile],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#092A31]">
        {label}
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
      />

      {file ? (
        <div className="overflow-hidden rounded-xl border border-[#CBD5E1] bg-white">
          {previewUrl ? (
            <div className="relative border-b border-[#E2E8F0] bg-[#F8FAFC] p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                className="mx-auto max-h-48 w-full rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-8">
              <div className="flex size-16 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white">
                <FileText className="size-8 text-[#156374]" aria-hidden />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              {isImageFile(file) ? (
                <ImageIcon className="size-5 shrink-0 text-[#156374]" aria-hidden />
              ) : (
                <FileText className="size-5 shrink-0 text-[#156374]" aria-hidden />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#092A31]">
                  {file.name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E2E8F0] text-[#64748B] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-10 transition-colors",
            dragOver && "border-[#156374] bg-[#F0F9FB]",
            "cursor-pointer hover:border-[#156374] hover:bg-[#F0F9FB]",
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full border border-[#CBD5E1] bg-white">
            <Upload className="size-6 text-[#156374]" aria-hidden />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#092A31]">
              Click to upload or drag and drop
            </p>
            <p className="mt-0.5 text-xs text-[#64748B]">
              Images, PDF, or Word documents
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
