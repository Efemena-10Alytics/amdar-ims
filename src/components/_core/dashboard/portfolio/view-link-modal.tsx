"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LinkIcon } from "lucide-react";
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

  useEffect(() => {
    if (open) {
      setCopyStatus("idle");
    }
  }, [open]);

  const handleCopyHref = async () => {
    if (!href) return;

    try {
      const valueToCopy =
        typeof window !== "undefined" && href.startsWith("/")
          ? `${window.location.origin}${href}`
          : href;
      await navigator.clipboard.writeText(valueToCopy);
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
            <button
              type="button"
              onClick={() => void handleCopyHref()}
              disabled={!href}
              className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-primary transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Copy portfolio link"
            >
              <LinkIcon className="size-6" aria-hidden />
            </button>
          </div>
          <DialogTitle className="text-center mt-4">View link</DialogTitle>
          <DialogDescription className="text-center mt-2">
            This link will take you to another site. Do you want to continue?
          </DialogDescription>
        </DialogHeader>
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
              ? "Portfolio link copied."
              : "Could not copy the portfolio link."}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
