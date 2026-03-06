"use client";

import { useRef, useState } from "react";
import { Cloud } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { portfolioInputStyle } from "./portfolio-styles";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = "image/jpeg,image/jpg";

type AddToolsPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: (toolName: string, imageFile: File | null) => void;
  children: React.ReactNode;
};

export function AddToolsPopover({
  open,
  onOpenChange,
  onDone,
  children,
}: AddToolsPopoverProps) {
  const [toolName, setToolName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setToolName("");
    setImageFile(null);
    setUploadError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const setFileFromFile = (file: File) => {
    setUploadError(null);
    if (!file.type.match(/^image\/(jpeg|jpg)$/)) {
      setUploadError("Please use a JPEG image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File must be under ${MAX_FILE_SIZE_MB}mb.`);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileFromFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setFileFromFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDone = () => {
    const name = toolName.trim();
    if (!name) return;
    onDone(name, imageFile);
    reset();
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-80 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">
          Add tools
        </h3>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload tool image"
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-[#F8FAFC] py-6 px-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
            uploadError && "border-red-200 bg-red-50/50",
          )}
        >
          {previewUrl ? (
            <div className="relative size-14 rounded-full overflow-hidden bg-white border border-zinc-200">
              <img
                src={previewUrl}
                alt=""
                className="size-full object-contain"
              />
            </div>
          ) : (
            <Cloud className="size-8 text-zinc-400 mb-1" aria-hidden />
          )}
          <span className="text-sm font-medium text-zinc-700">
            {previewUrl ? "Change image" : "Upload image"}
          </span>
          <span className="text-xs text-zinc-500 mt-0.5">
            Jpeg (max {MAX_FILE_SIZE_MB}mb)
          </span>
          {uploadError && (
            <span className="text-xs text-red-600 mt-1">{uploadError}</span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <label
            htmlFor="add-tool-name"
            className="text-sm font-medium text-zinc-900 block"
          >
            Tool name
          </label>
          <Input
            id="add-tool-name"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleDone();
              }
            }}
            placeholder="Enter your tool name"
            className={cn(portfolioInputStyle, "rounded-lg border-zinc-200")}
          />
        </div>

        <Button
          type="button"
          onClick={handleDone}
          className="w-full rounded-lg bg-primary text-white hover:bg-primary/90 h-10 font-medium"
        >
          Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}
