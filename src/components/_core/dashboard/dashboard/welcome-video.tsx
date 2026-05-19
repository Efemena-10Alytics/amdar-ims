"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getYoutubeThumbnail } from "@/components/_core/landing-pages/shared/youtube-video";
import { VideoPlayerModal } from "@/components/_core/landing-pages/shared/video-player-modal";

const DEFAULT_VIDEO_THUMBNAIL = "/images/pngs/video-thumbnail.jpeg";
const PROGRAM_VIDEO_URL =
  "https://www.youtube.com/watch?v=jY-j0xYXzpo&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=12";

const WelcomeVideo = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const videoThumbnail =
    getYoutubeThumbnail(PROGRAM_VIDEO_URL) || DEFAULT_VIDEO_THUMBNAIL;

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
        aria-label="Play guide video"
      >
        <Image
          src={thumbnailError ? DEFAULT_VIDEO_THUMBNAIL : videoThumbnail}
          alt="Guide video thumbnail"
          fill
          className="object-cover"
          onError={() => setThumbnailError(true)}
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
        videoUrl={PROGRAM_VIDEO_URL}
        title="Program video"
      />
    </>
  );
};

export default WelcomeVideo;
