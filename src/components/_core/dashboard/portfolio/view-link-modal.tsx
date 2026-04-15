"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ViewLinkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  href?: string;
};

export function ViewLinkModal({
  open,
  onOpenChange,
  href,
}: ViewLinkModalProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const resolvedHref =
    typeof window !== "undefined" && href?.startsWith("/")
      ? `${window.location.origin}${href}`
      : href;

  useEffect(() => {
    if (open) {
      setCopyStatus("idle");
    }
  }, [open]);

  const handleCopyHref = async () => {
    if (!href) return;

    try {
      await navigator.clipboard.writeText(resolvedHref ?? "");
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center" showCloseButton>
        <DialogHeader className="flex flex-col items-center justify-center text-center sm:block sm:text-left">
          <div className="flex justify-center mb-2">
            <span className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-primary">
              <LinkIcon className="size-6" aria-hidden />
            </span>
          </div>
          <DialogTitle className="text-center mt-4">View link</DialogTitle>
          <DialogDescription className="text-center mt-2">
            This link will take you to another site. Do you want to continue?
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 flex items-center gap-2">
          <p
            className="text-sm text-primary break-all text-left flex-1"
            title={resolvedHref}
          >
            {resolvedHref ?? "No link available"}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => void handleCopyHref()}
            disabled={!href}
            className="size-8 shrink-0 text-zinc-600 hover:text-primary cursor-pointer"
            aria-label="Copy link"
          >
            <Copy className="size-4" aria-hidden />
          </Button>
        </div>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white text-zinc-700 hover:bg-zinc-50 flex-1"
          >
            Cancel
          </Button>
          {href ? (
            <Button asChild className="bg-primary text-white hover:bg-primary/90 flex-1">
              <Link target="_blank"
                rel="noopener noreferrer" href={href} onClick={() => onOpenChange(false)}>
                Continue
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-primary text-white hover:bg-primary/90 flex-1"
              disabled
            >
              Continue
            </Button>
          )}
        </DialogFooter>
        {copyStatus !== "idle" ? (
          <p
            className={`text-sm text-center ${
              copyStatus === "copied" ? "text-green-600" : "text-red-600"
            }`}
            role="status"
          >
            {copyStatus === "copied"
              ? "Link copied."
              : "Could not copy link."}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
