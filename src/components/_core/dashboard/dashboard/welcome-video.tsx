"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { VideoPlayerModal } from "@/components/_core/landing-pages/shared/video-player-modal";
import { useGetPreDiagnostic } from "@/features/pre-diagnostic/use-get-pre-diagnostic";

const DEFAULT_VIDEO_THUMBNAIL = "/images/pngs/video-thumbnail.jpeg";
const IMS_WORKS_FALLBACK_VIDEO = "https://vimeo.com/1123856639";

const WelcomeVideo = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const { data: preDiagnostic } = useGetPreDiagnostic();

  const videoUrl =
    preDiagnostic?.ims_readiness?.howTheImsWorks?.link?.trim() ||
    IMS_WORKS_FALLBACK_VIDEO;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className="relative h-full w-full min-h-52 cursor-pointer overflow-hidden rounded-2xl bg-gray-200 lg:min-h-0"
        onClick={() => setVideoOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setVideoOpen(true);
          }
        }}
        aria-label="Play how the IMS works video"
      >
        <Image
          src={DEFAULT_VIDEO_THUMBNAIL}
          alt="How the IMS works video thumbnail"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-black/40 p-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#1E7C8D]">
              <Play className="size-3.5 fill-white text-white" />
            </span>
            <span className="text-sm font-medium text-white">Play to see guide</span>
          </div>
        </div>
      </div>

      <VideoPlayerModal
        open={videoOpen}
        onOpenChange={setVideoOpen}
        videoUrl={videoUrl}
        title="How the IMS works"
      />
    </>
  );
};

export default WelcomeVideo;
