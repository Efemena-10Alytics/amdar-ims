"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export const IMS_WORKS_WATCHED_STORAGE_KEY = "onboarding-ims-works-watched";

type HowTheImsWorksModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  storageKey?: string;
};

function readWatched(storageKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function writeWatched(storageKey: string) {
  try {
    localStorage.setItem(storageKey, "1");
  } catch {
    // Ignore storage access errors.
  }
}

export function hasWatchedHowTheImsWorks(storageKey = IMS_WORKS_WATCHED_STORAGE_KEY) {
  return readWatched(storageKey);
}

export default function HowTheImsWorksModal({
  open,
  onOpenChange,
  videoUrl,
  storageKey = IMS_WORKS_WATCHED_STORAGE_KEY,
}: HowTheImsWorksModalProps) {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open && videoUrl) {
      setLoading(true);
      setConfirmed(false);
    }
  }, [open, videoUrl]);

  const handleReady = () => setLoading(false);

  const handleConfirm = () => {
    if (!confirmed) return;
    writeWatched(storageKey);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // Require explicit confirmation before dismissing.
        if (!nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="flex max-h-[min(90vh,100dvh)] w-[min(1280px,95vw)] max-w-[900px] flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0"
        style={{
          width: "min(1280px, 95vw)",
          maxWidth: "900px",
        }}
        showCloseButton={false}
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">How the IMS works</DialogTitle>

        <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-black aspect-video max-h-[calc(min(90vh,100dvh)-7.5rem)]">
          {loading ? (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/60"
              aria-hidden
            >
              <Loader2 className="size-12 animate-spin text-white" />
            </div>
          ) : null}
          {videoUrl ? (
            <ReactPlayer
              src={videoUrl}
              playing={open}
              controls
              width="100%"
              height="100%"
              onReady={handleReady}
              onStart={handleReady}
            />
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-4 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
            />
            <span className="text-sm text-primary">
              I have watched this video
            </span>
          </label>

          <button
            type="button"
            disabled={!confirmed}
            onClick={handleConfirm}
            className="h-11 w-full max-w-72 rounded-full bg-primary text-sm font-semibold text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0] sm:w-auto sm:min-w-44"
          >
            Confirm &amp; continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
