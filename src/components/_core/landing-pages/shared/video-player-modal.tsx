"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export interface VideoPlayerModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when open state should change (e.g. user closes) */
  onOpenChange: (open: boolean) => void;
  /** Video URL (YouTube, Vimeo, etc.). When empty and open, nothing is rendered inside. */
  videoUrl: string | null;
  /** Accessible title for the dialog (e.g. "Program video") */
  title?: string;
  /** Show the default close (X) button. Default true. */
  showCloseButton?: boolean;
  /** Optional: transparent background, no shadow (e.g. for overlay-style modals). Default false. */
  transparent?: boolean;
}

/**
 * Reusable modal that plays a video with ReactPlayer.
 * Use when you need to open a video in a large modal (e.g. from a thumbnail or card).
 */
export function VideoPlayerModal({
  open,
  onOpenChange,
  videoUrl,
  title = "Video",
  showCloseButton = true,
  transparent = false,
}: VideoPlayerModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && videoUrl) setLoading(true);
  }, [open, videoUrl]);

  const handleReady = () => setLoading(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden border-0 max-w-7xl w-[min(1280px,95vw)] max-h-[90vh]"
        style={{
          width: "min(1280px, 95vw)",
          maxWidth: "900px",
          ...(transparent && {
            backgroundColor: "transparent",
            boxShadow: "none",
          }),
        }}
        showCloseButton={showCloseButton}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {videoUrl && (
          <div className="relative w-full aspect-video bg-black min-h-90 rounded-lg overflow-hidden">
            {loading && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 rounded-lg"
                aria-hidden
              >
                <Loader2 className="size-12 animate-spin text-white" />
              </div>
            )}
            <ReactPlayer
              src={videoUrl}
              playing={open}
              controls
              width="100%"
              height="100%"
              onReady={handleReady}
              onStart={handleReady}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default VideoPlayerModal;
