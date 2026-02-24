"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Mentors from "./mentors";
import type { InternshipProgram } from "@/types/internship-program";
import { getYoutubeThumbnail } from "../../../shared/youtube-video";
import { VideoPlayerModal } from "../../../shared/video-player-modal";
import { useGetNextCohort } from "@/features/internship/use-get-next-cohort";

interface RightProps {
  program?: InternshipProgram;
}

/** Fallback when video has no YouTube thumbnail (e.g. Vimeo) or image fails. */
const DEFAULT_VIDEO_THUMBNAIL = "/images/pngs/video-thumbnail.jpeg";

function getCountdownTo(targetDateStr: string | null): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const target = new Date(targetDateStr + "T00:00:00").getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((target - now) / 1000));
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds };
}

const Right = ({ program }: RightProps) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const { data: internshipStartDate } = useGetNextCohort();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });


  const PROGRAM_VIDEO_URL =
    program?.payment_url ??
    "https://www.youtube.com/watch?v=jY-j0xYXzpo&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=12";

  const videoThumbnail =
    getYoutubeThumbnail(PROGRAM_VIDEO_URL) ||
    (program as { image?: string } | undefined)?.image ||
    DEFAULT_VIDEO_THUMBNAIL;

  const mentors =
    program?.mentors?.map((m) => ({
      id: m.id,
      name: m.name,
      title: m.role,
      image: m.image,
      linkedin: m.linkedin_url ?? "#",
    })) ?? [];

  // Sync countdown when internshipStartDate loads
  useEffect(() => {
    setCountdown(getCountdownTo(internshipStartDate ?? null));
  }, [internshipStartDate]);

  // Countdown timer: recalculate every second from target date
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownTo(internshipStartDate ?? null));
    }, 1000);
    return () => clearInterval(interval);
  }, [internshipStartDate]);

  return (
    <div className="space-y-6 mt-20">
      {/* Video Player Section */}
      <div
        role="button"
        tabIndex={0}
        className="relative rounded-lg overflow-hidden bg-gray-200 aspect-video cursor-pointer"
        onClick={() => setVideoOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setVideoOpen(true);
          }
        }}
        aria-label="Play program video"
      >
        {videoThumbnail ? (
          <Image
            src={thumbnailError ? DEFAULT_VIDEO_THUMBNAIL : DEFAULT_VIDEO_THUMBNAIL}
            alt="Video thumbnail"
            fill
            className="object-cover"
            onError={() => setThumbnailError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[#E8EFF1]" />
        )}
        <div className="absolute inset-0 flex items-end p-3 justify-start bg-black/40">
          <div className="flex items-center gap-2">
            <div className="border-2 border-gray-500 w-6 h-6 bg-primary rounded-full flex items-center justify-center pointer-events-none">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-white text-sm font-medium">Play to view</span>
          </div>
        </div>
      </div>

      <VideoPlayerModal
        open={videoOpen}
        onOpenChange={setVideoOpen}
        videoUrl={PROGRAM_VIDEO_URL}
        title="Program video"
      />

      {/* Secure Your Seat Section */}
      <div className="bg-[#F8FAFB] rounded-lg p-6">
        <h3 className="font-semibold text-[#092A31] mb-4">Secure your seat</h3>

        {/* Countdown Timer */}
        <div className="flex gap-2 mb-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-[#092A31] mb-1">
              {String(countdown.days).padStart(2, "0")} :
            </div>
            <div className="text-xs text-[#092A31]">D</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#092A31] mb-1">
              {String(countdown.hours).padStart(2, "0")} :
            </div>
            <div className="text-xs text-[#092A31]">Hrs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#092A31] mb-1">
              {String(countdown.minutes).padStart(2, "0")} :
            </div>
            <div className="text-xs text-[#092A31]">Min</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#092A31] mb-1">
              {String(countdown.seconds).padStart(2, "0")}
            </div>
            <div className="text-xs text-[#092A31]">Sec</div>
          </div>
        </div>

        <a
          href={`/payment/${program?.id}`}
          className="text-primary underline text-sm font-medium"
        >
          Apply for the next cohort
        </a>
      </div>

      {/* Skills You Will Learn Section */}
      <div className="bg-[#F8FAFB] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#092A31] mb-4">
          Skills you will learn
        </h3>
        <div className="flex flex-wrap gap-2">
          {program?.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-full bg-[#E8EFF1] text-sm text-[#092A31] font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Mentors Section */}
      <div>
        <h3 className="text-xl font-bold text-[#092A31] mb-4">Mentors</h3>
        <Mentors mentors={mentors} />
      </div>
    </div>
  );
};

export default Right;
